// Edge Function para compartilhamento público de keepsakes
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// Configuração de CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

// Inicializa o cliente Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Cache simples em memória (para demonstração)
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

// Função para buscar keepsake pública
async function getPublicKeepsake(id: string) {
  try {
    // Verificar cache primeiro
    const cacheKey = `keepsake_${id}`
    const cached = cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('Retornando keepsake do cache')
      return { success: true, data: cached.data }
    }

    // Buscar keepsake pública no banco
    const { data: keepsake, error } = await supabase
      .from('keepsakes')
      .select(`
        id,
        title,
        message_content,
        delivery_date,
        type,
        created_at,
        profiles!inner (
          full_name
        )
      `)
      .eq('id', id)
      .eq('is_public', true)
      .eq('status', 'sent')
      .single()

    if (error || !keepsake) {
      return { 
        success: false, 
        error: 'Keepsake não encontrada ou não é pública' 
      }
    }

    // Verificar se a keepsake já foi entregue (só mostra públicas após entrega)
    const deliveryDate = new Date(keepsake.delivery_date)
    const now = new Date()
    
    if (deliveryDate > now) {
      return { 
        success: false, 
        error: 'Esta keepsake ainda não foi entregue' 
      }
    }

    // Sanitizar dados para compartilhamento público
    const publicData = {
      id: keepsake.id,
      title: keepsake.title,
      message_content: keepsake.message_content,
      delivery_date: keepsake.delivery_date,
      type: keepsake.type,
      created_at: keepsake.created_at,
      sender_name: keepsake.profiles.full_name
    }

    // Armazenar no cache
    cache.set(cacheKey, {
      data: publicData,
      timestamp: Date.now()
    })

    return { success: true, data: publicData }

  } catch (error) {
    console.error('Erro ao buscar keepsake pública:', error)
    return { 
      success: false, 
      error: 'Erro interno do servidor' 
    }
  }
}

// Handler da Edge Function
Deno.serve(async (req) => {
  // Lidar com requisições OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Apenas GET é permitido
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Método não permitido' }),
      {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }

  try {
    // Extrair ID da URL
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const keepsakeId = pathParts[pathParts.length - 1]

    if (!keepsakeId || keepsakeId.length !== 36) {
      return new Response(
        JSON.stringify({ error: 'ID da keepsake inválido' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      )
    }

    const result = await getPublicKeepsake(keepsakeId)

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      )
    }

    return new Response(
      JSON.stringify(result.data),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300', // Cache por 5 minutos
          ...corsHeaders,
        },
      }
    )

  } catch (error) {
    console.error('Erro na função public-keepsake:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
})