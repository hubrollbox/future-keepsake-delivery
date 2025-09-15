import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface HuggingFaceRequest {
  inputs: string;
  parameters?: {
    max_length?: number;
    temperature?: number;
    do_sample?: boolean;
  };
}

interface SuggestionRequest {
  message: string;
  keywords: string[];
  userId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verificar autenticação
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const { message, keywords, userId }: SuggestionRequest = await req.json()

    // Verificar quota do usuário
    const { data: usage, error: usageError } = await supabaseClient
      .from('api_usage')
      .select('*')
      .eq('user_id', userId)
      .eq('date', new Date().toISOString().split('T')[0])
      .single()

    if (usageError && usageError.code !== 'PGRST116') {
      throw usageError
    }

    // Verificar limites por plano
    const { data: userProfile } = await supabaseClient
      .from('users')
      .select('subscription_tier')
      .eq('id', userId)
      .single()

    const tier = userProfile?.subscription_tier || 'free'
    const limits = {
      free: 3,
      premium: 50,
      family: 100
    }

    const currentUsage = usage?.huggingface_requests || 0
    if (currentUsage >= limits[tier as keyof typeof limits]) {
      return new Response(
        JSON.stringify({ 
          error: 'Quota exceeded', 
          message: `Limite de ${limits[tier as keyof typeof limits]} sugestões diárias atingido. Faça upgrade para mais sugestões!`,
          upgradeRequired: true
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Criar prompt contextualizado baseado nas keywords
    const contextPrompt = createContextualPrompt(message, keywords)

    // Chamar Hugging Face API
    const huggingFaceResponse = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('HUGGINGFACE_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: contextPrompt,
          parameters: {
            max_length: 200,
            temperature: 0.7,
            do_sample: true,
            pad_token_id: 50256
          }
        } as HuggingFaceRequest),
      }
    )

    if (!huggingFaceResponse.ok) {
      const errorText = await huggingFaceResponse.text()
      console.error('Hugging Face API error:', errorText)
      
      // Fallback para sugestões pré-definidas
      const fallbackSuggestion = getFallbackSuggestion(keywords)
      
      return new Response(
        JSON.stringify({ 
          suggestion: fallbackSuggestion,
          fallback: true,
          message: 'Sugestão gerada localmente (serviço de IA temporariamente indisponível)'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const result = await huggingFaceResponse.json()
    let suggestion = ''

    if (Array.isArray(result) && result.length > 0) {
      suggestion = result[0].generated_text || ''
    } else if (result.generated_text) {
      suggestion = result.generated_text
    }

    // Limpar e melhorar a sugestão
    suggestion = cleanAndEnhanceSuggestion(suggestion, contextPrompt)

    // Registrar uso da API
    await supabaseClient
      .from('api_usage')
      .upsert({
        user_id: userId,
        date: new Date().toISOString().split('T')[0],
        huggingface_requests: currentUsage + 1,
        updated_at: new Date().toISOString()
      })

    return new Response(
      JSON.stringify({ 
        suggestion,
        remainingQuota: limits[tier as keyof typeof limits] - (currentUsage + 1),
        tier
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in huggingface-suggestion function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: 'Erro interno do servidor. Tente novamente mais tarde.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

function createContextualPrompt(message: string, keywords: string[]): string {
  const keywordContext = {
    aniversario: 'Esta é uma mensagem de aniversário especial. Torne-a mais emotiva e celebrativa.',
    amor: 'Esta é uma mensagem de amor. Adicione romance e carinho.',
    conquista: 'Esta é sobre uma conquista importante. Celebre o sucesso e inspire.',
    familia: 'Esta é uma mensagem familiar. Torne-a calorosa e afetuosa.',
    amizade: 'Esta é sobre amizade. Torne-a sincera e reconfortante.'
  }

  let context = 'Melhore esta mensagem de cápsula do tempo: '
  
  if (keywords.length > 0) {
    const primaryKeyword = keywords[0]
    if (keywordContext[primaryKeyword as keyof typeof keywordContext]) {
      context = keywordContext[primaryKeyword as keyof typeof keywordContext] + ' '
    }
  }

  return `${context}"${message}". Responda apenas com a versão melhorada da mensagem, sem explicações adicionais.`
}

function cleanAndEnhanceSuggestion(suggestion: string, originalPrompt: string): string {
  // Remover o prompt original da resposta
  let cleaned = suggestion.replace(originalPrompt, '').trim()
  
  // Remover aspas desnecessárias
  cleaned = cleaned.replace(/^["']|["']$/g, '')
  
  // Limitar tamanho
  if (cleaned.length > 300) {
    cleaned = cleaned.substring(0, 300).trim()
    // Tentar terminar em uma frase completa
    const lastPeriod = cleaned.lastIndexOf('.')
    if (lastPeriod > 200) {
      cleaned = cleaned.substring(0, lastPeriod + 1)
    }
  }
  
  // Se a sugestão estiver muito curta ou vazia, usar fallback
  if (cleaned.length < 20) {
    return 'Sua mensagem está perfeita! Considere adicionar mais detalhes sobre seus sentimentos e memórias especiais.'
  }
  
  return cleaned
}

function getFallbackSuggestion(keywords: string[]): string {
  const fallbacks = {
    aniversario: 'Que este novo ano de vida seja repleto de alegrias, conquistas e momentos inesquecíveis. Parabéns! 🎂',
    amor: 'Cada momento ao seu lado é um presente. Você torna minha vida mais colorida e cheia de significado. 💕',
    conquista: 'Sua dedicação e esforço trouxeram você até aqui. Continue brilhando e inspirando todos ao seu redor! 🏆',
    familia: 'A família é o tesouro mais precioso que temos. Obrigado por todos os momentos especiais que compartilhamos. 👨‍👩‍👧‍👦',
    amizade: 'Ter você como amigo é uma das maiores bênçãos da minha vida. Obrigado por estar sempre presente. 🤝'
  }

  if (keywords.length > 0) {
    const primaryKeyword = keywords[0]
    return fallbacks[primaryKeyword as keyof typeof fallbacks] || 
           'Sua mensagem é especial! Considere adicionar mais detalhes pessoais para torná-la ainda mais significativa.'
  }

  return 'Sua mensagem é especial! Considere adicionar mais detalhes pessoais para torná-la ainda mais significativa.'
}