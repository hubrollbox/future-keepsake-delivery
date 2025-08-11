// Edge Function para processar e enviar keepsakes agendadas
// Versão melhorada com melhor tratamento de erros e timezone de Portugal
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { Resend } from 'npm:resend@2.0.0'

// Configuração de CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Inicializa o cliente Resend para envio de emails
const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

// Inicializa o cliente Supabase com as credenciais de serviço
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Configuração de timezone para Portugal
const PORTUGAL_TIMEZONE = 'Europe/Lisbon'

// Interface para os dados da keepsake
interface Keepsake {
  id: string
  title: string
  message_content: string
  delivery_date: string
  status: string
  user_id: string
  type: string
  message_type: string
}

// Interface para os dados do destinatário
interface Recipient {
  id: string
  name: string
  email: string
  keepsake_id: string
}

// Interface para os dados do usuário
interface Profile {
  id: string
  email: string
  full_name: string
}

// Função para enviar email usando Resend
async function sendEmail(to: string, subject: string, htmlContent: string, fromName: string) {
  try {
    const result = await resend.emails.send({
      from: `${fromName} <noreply@futurodopresente.com>`,
      to: [to],
      subject: subject,
      html: htmlContent,
    })
    
    console.log('Email enviado com sucesso:', result)
    return { success: true, result }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return { success: false, error }
  }
}

// Função para processar keepsakes pendentes
async function processKeepsakes() {
  try {
    // Obter data/hora atual em timezone de Portugal
    const nowInPortugal = new Date().toLocaleString('en-US', { timeZone: PORTUGAL_TIMEZONE })
    const currentDateTime = new Date(nowInPortugal).toISOString()
    
    console.log(`Processando keepsakes às ${currentDateTime} (Portugal timezone)`)
    
    // Buscar keepsakes digitais agendadas para hoje ou datas passadas
    // Usando status 'pending' conforme especificado na função SQL
    const { data: keepsakes, error: keepsakeError } = await supabase
      .from('keepsakes')
      .select(`
        *,
        recipients (
          id,
          name,
          email,
          delivery_channel,
          contact_info,
          relationship
        ),
        profiles (
          id,
          email,
          full_name
        )
      `)
      .eq('status', 'pending')
      .eq('type', 'digital')
      .lte('delivery_date', currentDateTime)
    
    if (keepsakeError) {
      throw new Error(`Erro ao buscar keepsakes: ${keepsakeError.message}`)
    }
    
    if (!keepsakes || keepsakes.length === 0) {
      console.log('Nenhuma keepsake pendente para envio')
      return { processed: 0 }
    }
    
    console.log(`Encontradas ${keepsakes.length} keepsakes para processar`)
    
    let processedCount = 0
    
    // Processar cada keepsake
    for (const keepsake of keepsakes) {
      try {
        // Verificar se os dados necessários estão presentes
        if (!keepsake.profiles) {
          throw new Error(`Dados do remetente não encontrados para a keepsake ${keepsake.id}`)
        }
        
        if (!keepsake.recipients || keepsake.recipients.length === 0) {
          throw new Error(`Nenhum destinatário encontrado para a keepsake ${keepsake.id}`)
        }
        
        const senderData = keepsake.profiles
        const recipients = keepsake.recipients
        
        // Enviar email para cada destinatário
        for (const recipient of recipients) {
          // Template de email para o destinatário
          const recipientEmailHtml = `
            <div style="font-family: 'Fraunces', serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F2F8;">
              <div style="background: white; padding: 30px; border-radius: 12px; border: 2px solid #DAB8C3;">
                <h1 style="color: #3D4A5A; margin-bottom: 20px; font-size: 24px;">${keepsake.title}</h1>
                
                <p style="color: #3D4A5A; line-height: 1.6; margin-bottom: 20px;">
                  Olá ${recipient.name},
                </p>
                
                <p style="color: #3D4A5A; line-height: 1.6; margin-bottom: 20px;">
                  Você recebeu uma mensagem especial de ${senderData.full_name}:
                </p>
                
                <div style="background-color: #ECE5DA; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #3D4A5A; margin: 0; font-style: italic;">
                    ${keepsake.message || keepsake.message_content || 'Mensagem não disponível'}
                  </p>
                </div>
                
                <p style="color: #3D4A5A; line-height: 1.6; margin-bottom: 20px;">
                  Esta mensagem foi programada para ser entregue hoje, esperamos que ela traga alegria ao seu dia!
                </p>
                
                <p style="color: #3D4A5A; line-height: 1.6; margin-bottom: 20px;">
                  Com carinho,<br>
                  <strong>Equipa FuturoPresente</strong>
                </p>
                
                <div style="text-align: center; margin-top: 30px;">
                  <p style="color: #A0AEC0; font-size: 14px; margin: 0;">
                    Presente no futuro
                  </p>
                </div>
              </div>
            </div>
          `
          
          // Template de email para o remetente
          const senderEmailHtml = `
            <div style="font-family: 'Fraunces', serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F2F8;">
              <div style="background: white; padding: 30px; border-radius: 12px; border: 2px solid #DAB8C3;">
                <h1 style="color: #3D4A5A; margin-bottom: 20px; font-size: 24px;">Sua mensagem foi entregue!</h1>
                
                <p style="color: #3D4A5A; line-height: 1.6; margin-bottom: 20px;">
                  Olá ${senderData.full_name},
                </p>
                
                <p style="color: #3D4A5A; line-height: 1.6; margin-bottom: 20px;">
                  Sua mensagem "${keepsake.title}" foi entregue com sucesso para ${recipient.name}.
                </p>
                
                <div style="background-color: #ECE5DA; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #3D4A5A; margin: 0; font-style: italic;">
                    ${keepsake.message || keepsake.message_content || 'Mensagem não disponível'}
                  </p>
                </div>
                
                <p style="color: #3D4A5A; line-height: 1.6; margin-bottom: 20px;">
                  Obrigado por usar o FuturoPresente para compartilhar momentos especiais!
                </p>
                
                <p style="color: #3D4A5A; line-height: 1.6; margin-bottom: 20px;">
                  Atenciosamente,<br>
                  <strong>Equipa FuturoPresente</strong>
                </p>
                
                <div style="text-align: center; margin-top: 30px;">
                  <p style="color: #A0AEC0; font-size: 14px; margin: 0;">
                    Presente no futuro
                  </p>
                </div>
              </div>
            </div>
          `
          
          // Enviar email para o destinatário
          const recipientEmailResult = await sendEmail(
            recipient.email,
            `Você recebeu uma mensagem especial: ${keepsake.title}`,
            recipientEmailHtml,
            'FuturoPresente'
          )
          
          if (!recipientEmailResult.success) {
            console.error(`Erro ao enviar email para destinatário ${recipient.email}:`, recipientEmailResult.error)
            continue
          }
          
          // Enviar email para o remetente
          const senderEmailResult = await sendEmail(
            senderData.email,
            `Sua mensagem "${keepsake.title}" foi entregue!`,
            senderEmailHtml,
            'FuturoPresente'
          )
          
          if (!senderEmailResult.success) {
            console.error(`Erro ao enviar email para remetente ${senderData.email}:`, senderEmailResult.error)
          }
        }
        
        // Atualizar status da keepsake para 'sent' e definir sent_at
        const { error: updateError } = await supabase
          .from('keepsakes')
          .update({ 
            status: 'sent',
            sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', keepsake.id)
        
        if (updateError) {
          throw new Error(`Erro ao atualizar status da keepsake: ${updateError.message}`)
        }
        
        // Criar notificação para o usuário
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: keepsake.user_id,
            title: 'Mensagem entregue',
            content: `Sua mensagem "${keepsake.title}" foi entregue com sucesso.`,
            type: 'keepsake_delivery',
            status: 'unread',
            keepsake_id: keepsake.id
          })
        
        if (notificationError) {
          console.error(`Erro ao criar notificação: ${notificationError.message}`)
        }
        
        processedCount++
        console.log(`Keepsake ${keepsake.id} processada com sucesso`)
        
      } catch (error) {
        console.error(`Erro ao processar keepsake ${keepsake.id}:`, error)
        
        // Atualizar status da keepsake para 'error'
        await supabase
          .from('keepsakes')
          .update({ 
            status: 'error',
            updated_at: new Date().toISOString()
          })
          .eq('id', keepsake.id)
      }
    }
    
    return { processed: processedCount }
    
  } catch (error) {
    console.error('Erro ao processar keepsakes:', error)
    return { error: error.message }
  }
}

// Handler para a Edge Function
Deno.serve(async (req) => {
  // Lidar com requisições OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  // Verificar se a requisição é um POST
  if (req.method === 'POST') {
    try {
      const result = await processKeepsakes()
      
      return new Response(
        JSON.stringify(result),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      )
    } catch (error) {
      console.error('Erro na função send-keepsakes:', error)
      
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao processar keepsakes', 
          details: error.message 
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      )
    }
  }
  
  // Método não suportado
  return new Response(
    JSON.stringify({ error: 'Método não suportado' }),
    {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    }
  )
})