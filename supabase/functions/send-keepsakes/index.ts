// Edge Function para processar e enviar keepsakes agendadas
// Versão otimizada com processamento paralelo, gerenciamento de timezone e tratamento robusto de erros
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { Resend } from 'npm:resend@2.0.0'
import { DateTime } from 'npm:luxon@3.4.4'

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

// Configuração de processamento em lote
const BATCH_SIZE = 50 // Máximo de keepsakes por execução
const MAX_CONCURRENT_EMAILS = 10 // Máximo de emails simultâneos

// Configuração de retry para emails
const MAX_RETRY_ATTEMPTS = 3
const INITIAL_RETRY_DELAY = 1000 // 1 segundo
const RETRY_BACKOFF_MULTIPLIER = 2

// Configuração de rate limiting
const RATE_LIMIT_PER_USER_PER_HOUR = 50 // Máximo de emails por usuário por hora
const RATE_LIMIT_CACHE = new Map<string, { count: number; resetTime: number }>()

// Função para escape HTML - previne XSS
function escapeHtml(unsafe: string): string {
  if (!unsafe || typeof unsafe !== 'string') {
    return 'Conteúdo não disponível'
  }
  
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\//g, '&#x2F;')
}

// Função para validar formato de e-mail
function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }
  
  // Regex mais robusta para validação de e-mail
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  
  return emailRegex.test(email) && email.length <= 254 // RFC 5321 limit
}

// Função para verificar rate limiting por usuário
function checkRateLimit(userId: string): { allowed: boolean; resetTime: number } {
  const now = Date.now()
  const userLimit = RATE_LIMIT_CACHE.get(userId)
  
  if (!userLimit || now > userLimit.resetTime) {
    // Reset ou primeira vez
    RATE_LIMIT_CACHE.set(userId, {
      count: 1,
      resetTime: now + (60 * 60 * 1000) // 1 hora
    })
    return { allowed: true, resetTime: now + (60 * 60 * 1000) }
  }
  
  if (userLimit.count >= RATE_LIMIT_PER_USER_PER_HOUR) {
    return { allowed: false, resetTime: userLimit.resetTime }
  }
  
  userLimit.count++
  return { allowed: true, resetTime: userLimit.resetTime }
}

// Função para sanitizar dados de entrada
interface Keepsake {
  title?: string;
  message?: string;
  message_content?: string;
  id: string;
  user_id: string;
  delivery_date: string;
  status: string;
  type: string;
  recipients: Recipient[];
  users: User[];

}

function sanitizeKeepsakeData(keepsake: Keepsake): Keepsake {
  return {
    ...keepsake,
    title: escapeHtml(keepsake.title || ''),
    message: escapeHtml(keepsake.message || ''),
    message_content: escapeHtml(keepsake.message_content || '')
  }
}

// Função para sanitizar dados do usuário
interface User {
  full_name?: string;
  email?: string;

}

function sanitizeUserData(user: User): User {
  return {
    ...user,
    full_name: escapeHtml(user.full_name || ''),
    email: user.email // Email não precisa de escape, mas será validado
  }
}

// Função para sanitizar dados do destinatário
interface Recipient {
  name?: string;
  email?: string;

}

function sanitizeRecipientData(recipient: Recipient): Recipient {
  return {
    ...recipient,
    name: escapeHtml(recipient.name || ''),
    email: recipient.email // Email não precisa de escape, mas será validado
  }
}



// Função para delay com exponential backoff
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Função para logging estruturado com contexto
function logWithContext(level: 'info' | 'error' | 'warn', message: string, context: Record<string, unknown> = {}) {
  const timestamp = DateTime.now().setZone(PORTUGAL_TIMEZONE).toISO()
  const logEntry = {
    timestamp,
    level,
    message,
    ...context
  }
  
  if (level === 'error') {
    console.error(JSON.stringify(logEntry))
  } else if (level === 'warn') {
    console.warn(JSON.stringify(logEntry))
  } else {
    console.log(JSON.stringify(logEntry))
  }
}

// Função para enviar email com retry e exponential backoff
async function sendEmailWithRetry(
  to: string, 
  subject: string, 
  htmlContent: string, 
  fromName: string,
  keepsakeId?: string,
  attempt: number = 1
): Promise<{ success: boolean; result?: unknown; error?: Error }> {
  const context = { keepsakeId, to, subject, attempt }
  
  try {
    const result = await resend.emails.send({
      from: `${fromName} <noreply@keepla.pt>`,
      to: [to],
      subject: subject,
      html: htmlContent,
    })
    
    logWithContext('info', 'Email enviado com sucesso', { ...context, result })
    return { success: true, result }
  } catch (error) {
    logWithContext('error', 'Erro ao enviar email', { ...context, error: error.message })
    
    // Retry logic com exponential backoff
    if (attempt < MAX_RETRY_ATTEMPTS) {
      const delayMs = INITIAL_RETRY_DELAY * Math.pow(RETRY_BACKOFF_MULTIPLIER, attempt - 1)
      logWithContext('info', `Tentando reenvio em ${delayMs}ms`, { ...context, nextAttempt: attempt + 1 })
      
      await delay(delayMs)
      return sendEmailWithRetry(to, subject, htmlContent, fromName, keepsakeId, attempt + 1)
    }
    
    return { success: false, error }
  }
}

// Função para processar keepsakes pendentes com otimizações
async function processKeepsakes() {
  try {
    // Obter data/hora atual em timezone de Portugal usando Luxon
    const nowInPortugal = DateTime.now().setZone(PORTUGAL_TIMEZONE)
    const currentDateTime = nowInPortugal.toISO()
    
    console.log(`Processando keepsakes às ${currentDateTime} (Portugal timezone)`)
    
    // Buscar keepsakes digitais agendadas para hoje ou datas passadas com limite
    // Usando status 'pending' conforme especificado na função SQL
    // Buscar keepsakes primeiro
    const { data: keepsakes, error: keepsakeError } = await supabase
      .from('keepsakes')
      .select(`
        *,
        recipients (
          id,
          name,
          email,
          delivery_channel,
          relationship
        )
      `)
      .eq('status', 'pending')
      .eq('type', 'digital')
      .lte('delivery_date', currentDateTime)
      .limit(BATCH_SIZE)
      .order('delivery_date', { ascending: true })
    
    if (keepsakeError) {
      throw new Error(`Erro ao buscar keepsakes: ${keepsakeError.message}`)
    }
    
    // Buscar perfis dos remetentes separadamente
    if (keepsakes && keepsakes.length > 0) {
      const userIds = [...new Set(keepsakes.map(k => k.user_id))]
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', userIds)
      
      if (profilesError) {
        logWithContext('warn', 'Erro ao buscar perfis', { error: profilesError.message })
      }
      
      // Mapear perfis para keepsakes
      const profilesMap = new Map(profiles?.map(p => [p.id, p]) || [])
      keepsakes.forEach(k => {
        (k as any).profiles = profilesMap.get(k.user_id) || null
      })
    }
    
    if (!keepsakes || keepsakes.length === 0) {
      console.log('Nenhuma keepsake pendente para envio')
      return { processed: 0 }
    }
    
    console.log(`Encontradas ${keepsakes.length} keepsakes para processar`)
    
    let processedCount = 0
    const errors: Array<{ keepsakeId: string; error: string }> = []
    
    // Processar keepsakes em paralelo com controle de concorrência
    const processPromises = keepsakes.map(async (keepsake: Keepsake) => {
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
        
        // Preparar todos os emails para envio paralelo
        const emailPromises: Array<Promise<{ success: boolean; result?: unknown; error?: unknown }>> = []
        
        for (const recipient of recipients) {
          // Validate and sanitize recipient email
          if (!isValidEmail(recipient.email)) {
            logWithContext('error', `Invalid recipient email format: ${recipient.email}`, { keepsakeId: keepsake.id, recipientEmail: recipient.email });
            continue;
          }

          // Check rate limit for recipient
          const rateLimitCheck = checkRateLimit(recipient.email);
          if (!rateLimitCheck.allowed) {
            logWithContext('warn', `Rate limit exceeded for recipient: ${recipient.email}`, { keepsakeId: keepsake.id, recipientEmail: recipient.email, resetTime: rateLimitCheck.resetTime });
            continue;
          }

          // Sanitize keepsake and user data
          const sanitizedKeepsake = sanitizeKeepsakeData(keepsake);
          const sanitizedSender = sanitizeUserData(senderData);
          const sanitizedRecipient = sanitizeRecipientData(recipient);

          // Template de email para o destinatário
          const recipientEmailHtml = `
            <div style="font-family: 'Fraunces', serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F5F5;">
              <div style="background: white; padding: 30px; border-radius: 12px; border: 2px solid #E63946;">
                <h1 style="color: #3D4A5A; margin-bottom: 20px; font-size: 24px;">${sanitizedKeepsake.title}</h1>
                
                <p style="color: #3D4A5A; line-height: 1.6; margin-bottom: 20px;">
                  Olá ${sanitizedRecipient.name},
                </p>
                
                <p style="color: #3D4A5A; line-height: 1.6; margin-bottom: 20px;">
                  Você recebeu uma mensagem especial de ${sanitizedSender.full_name}:
                </p>
                
                <div style="background-color: #ECE5DA; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #3D4A5A; margin: 0; font-style: italic;">
                    ${sanitizedKeepsake.message || sanitizedKeepsake.message_content || 'Mensagem não disponível'}
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
          
          // Template de email para o remetente (com validação)
          let senderEmailHtml = '';
          let shouldSendToSender = true;
          
          // Validate sender email
          if (!isValidEmail(senderData.email)) {
            logWithContext('error', `Invalid sender email format: ${senderData.email}`, { keepsakeId: keepsake.id, senderEmail: senderData.email });
            shouldSendToSender = false;
          } else {
            // Check rate limit for sender
            const senderRateLimitCheck = checkRateLimit(senderData.email, 'sender');
            if (!senderRateLimitCheck.allowed) {
              logWithContext('warn', `Rate limit exceeded for sender: ${senderData.email}`, { keepsakeId: keepsake.id, senderEmail: senderData.email, resetTime: senderRateLimitCheck.resetTime });
              shouldSendToSender = false;
            }
          }
          
          if (shouldSendToSender) {
            senderEmailHtml = `
              <div style="font-family: 'Fraunces', serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F5F5;">
                <div style="background: white; padding: 30px; border-radius: 12px; border: 2px solid #E63946;">
                  <h1 style="color: #3D4A5A; margin-bottom: 20px; font-size: 24px;">Sua mensagem foi entregue!</h1>
                  
                  <p style="color: #3D4A5A; line-height: 1.6; margin-bottom: 20px;">
                    Olá ${sanitizedSender.full_name},
                  </p>
                  
                  <p style="color: #3D4A5A; line-height: 1.6; margin-bottom: 20px;">
                    Sua mensagem "${sanitizedKeepsake.title}" foi entregue com sucesso para ${sanitizedRecipient.name}.
                  </p>
                  
                  <div style="background-color: #ECE5DA; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="color: #3D4A5A; margin: 0; font-style: italic;">
                      ${sanitizedKeepsake.message || sanitizedKeepsake.message_content || 'Mensagem não disponível'}
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
            `;
          }
          
          // Adicionar emails à lista de promessas com retry
          emailPromises.push(
            sendEmailWithRetry(
              recipient.email,
              `Você recebeu uma mensagem especial: ${sanitizedKeepsake.title}`,
              recipientEmailHtml,
              'FuturoPresente',
              keepsake.id
            )
          );
          
          // Only send to sender if validation passed
          if (shouldSendToSender) {
            emailPromises.push(
              sendEmailWithRetry(
                senderData.email,
                `Sua mensagem "${sanitizedKeepsake.title}" foi entregue!`,
                senderEmailHtml,
                'FuturoPresente',
                keepsake.id
              )
            );
          }
        }
        
        // Enviar emails em lotes para controlar concorrência
        const emailResults: Array<PromiseSettledResult<{ success: boolean; result?: unknown; error?: Error }>> = []
        for (let i = 0; i < emailPromises.length; i += MAX_CONCURRENT_EMAILS) {
          const batch = emailPromises.slice(i, i + MAX_CONCURRENT_EMAILS)
          const batchResults = await Promise.allSettled(batch)
          emailResults.push(...batchResults)
          
          // Pequena pausa entre lotes para não sobrecarregar
          if (i + MAX_CONCURRENT_EMAILS < emailPromises.length) {
            await delay(100)
          }
        }
        
        // Verificar resultados dos emails
        const failedEmails = emailResults.filter(result => 
          result.status === 'rejected' || 
          (result.status === 'fulfilled' && !result.value.success)
        )
        
        const successfulEmails = emailResults.filter(result => 
          result.status === 'fulfilled' && result.value.success
        )
        
        // Log detalhado dos resultados
        logWithContext('info', 'Resultados do envio de emails', {
          keepsakeId: keepsake.id,
          totalEmails: emailResults.length,
          successful: successfulEmails.length,
          failed: failedEmails.length
        })
        
        if (failedEmails.length > 0) {
          logWithContext('error', 'Emails falharam após todas as tentativas', {
            keepsakeId: keepsake.id,
            failedCount: failedEmails.length
          })
          
          failedEmails.forEach((result, index) => {
            if (result.status === 'rejected') {
              logWithContext('error', `Email rejeitado`, {
                keepsakeId: keepsake.id,
                emailIndex: index + 1,
                error: result.reason
              })
            } else {
              logWithContext('error', `Email falhou`, {
                keepsakeId: keepsake.id,
                emailIndex: index + 1,
                error: result.value.error
              })
            }
          })
        }
        
        // Se todos os emails falharam, marcar como erro
        if (failedEmails.length === emailResults.length) {
          throw new Error(`Todos os emails falharam para keepsake ${keepsake.id}`)
        }
        
        // Se alguns emails falharam, marcar como parcialmente enviado
        const status = failedEmails.length > 0 ? 'partial_sent' : 'sent'
        
        // Operações atômicas: atualizar status e criar notificação
        const sentAt = DateTime.now().setZone(PORTUGAL_TIMEZONE).toISO()
        
        // Usar transação para garantir atomicidade
        const { error: transactionError } = await supabase.rpc('execute_keepsake_completion', {
          p_keepsake_id: keepsake.id,
          p_status: status,
          p_sent_at: sentAt,
          p_user_id: keepsake.user_id,
          p_title: keepsake.title,
          p_failed_emails: failedEmails.length
        })
        
        if (transactionError) {
          // Fallback para operações individuais se a função RPC não existir
          logWithContext('warn', 'Função RPC não disponível, usando operações individuais', {
            keepsakeId: keepsake.id,
            error: transactionError.message
          })
          
          // Atualizar status da keepsake
          const { error: updateError } = await supabase
            .from('keepsakes')
            .update({ 
              status: status,
              sent_at: sentAt,
              updated_at: sentAt
            })
            .eq('id', keepsake.id)
          
          if (updateError) {
            throw new Error(`Erro ao atualizar status da keepsake: ${updateError.message}`)
          }
          
          // Criar notificação para o usuário
          const notificationContent = status === 'sent' 
            ? `Sua mensagem "${keepsake.title}" foi entregue com sucesso.`
            : `Sua mensagem "${keepsake.title}" foi parcialmente entregue. ${failedEmails.length} email(s) falharam.`
            
          const { error: notificationError } = await supabase
            .from('notifications')
            .insert({
              user_id: keepsake.user_id,
              title: status === 'sent' ? 'Mensagem entregue' : 'Mensagem parcialmente entregue',
              content: notificationContent,
              type: 'keepsake_delivery',
              status: 'unread',
              keepsake_id: keepsake.id
            })
          
          if (notificationError) {
            logWithContext('error', 'Erro ao criar notificação', {
              keepsakeId: keepsake.id,
              error: notificationError.message
            })
            // Não falhar a operação por erro de notificação
          }
        } else {
          logWithContext('info', 'Operações atômicas executadas com sucesso', {
            keepsakeId: keepsake.id,
            status: status
          })
        }
        
        return { success: true, keepsakeId: keepsake.id }
        
      } catch (error) {
        logWithContext('error', 'Erro crítico ao processar keepsake', {
          keepsakeId: keepsake.id,
          error: error.message,
          stack: error.stack
        })
        
        // Atualizar status da keepsake para 'error' com timezone correto
        const errorAt = DateTime.now().setZone(PORTUGAL_TIMEZONE).toISO()
        try {
          const { error: updateError } = await supabase
            .from('keepsakes')
            .update({ 
              status: 'error',
              updated_at: errorAt,
              error_message: error.message
            })
            .eq('id', keepsake.id)
          
          if (updateError) {
            logWithContext('error', 'Erro ao atualizar status para erro', {
              keepsakeId: keepsake.id,
              updateError: updateError.message
            })
          }
          
          // Criar notificação de erro para o usuário
          const { error: notificationError } = await supabase
            .from('notifications')
            .insert({
              user_id: keepsake.user_id,
              title: 'Erro no envio da mensagem',
              content: `Houve um erro ao enviar sua mensagem "${keepsake.title}". Nossa equipe foi notificada.`,
              type: 'keepsake_error',
              status: 'unread',
              keepsake_id: keepsake.id
            })
          
          if (notificationError) {
            logWithContext('error', 'Erro ao criar notificação de erro', {
              keepsakeId: keepsake.id,
              notificationError: notificationError.message
            })
          }
        } catch (updateError) {
          logWithContext('error', 'Erro crítico ao atualizar status de erro', {
            keepsakeId: keepsake.id,
            originalError: error.message,
            updateError: updateError.message
          })
        }
        
        return { success: false, keepsakeId: keepsake.id, error: error.message }
      }
    })
    
    // Aguardar processamento de todas as keepsakes
    const results = await Promise.allSettled(processPromises)
    
    // Contar sucessos e falhas com logging detalhado
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value.success) {
        processedCount++
        logWithContext('info', 'Keepsake processada com sucesso', {
          keepsakeId: result.value.keepsakeId
        })
      } else {
        const error = result.status === 'rejected' ? result.reason : result.value.error
        const keepsakeId = result.status === 'fulfilled' ? result.value.keepsakeId : 'unknown'
        errors.push({ keepsakeId, error })
        logWithContext('error', 'Falha no processamento da keepsake', {
          keepsakeId,
          error,
          resultStatus: result.status
        })
      }
    })
    
    return { 
      processed: processedCount, 
      total: keepsakes.length,
      errors: errors.length,
      errorDetails: errors
    }
    
  } catch (error) {
    logWithContext('error', 'Erro crítico na função processKeepsakes', {
      error: error.message,
      stack: error.stack
    })
    return { error: error.message }
  }
}

// Handler para a Edge Function
Deno.serve(async (req) => {
  const requestId = crypto.randomUUID()
  const startTime = Date.now()
  
  // Log da requisição recebida
  logWithContext('info', 'Requisição recebida', {
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.headers.get('user-agent')
  })
  
  try {
    // Lidar com requisições OPTIONS (CORS preflight)
    if (req.method === 'OPTIONS') {
      logWithContext('info', 'Requisição OPTIONS processada', { requestId })
      return new Response(null, { headers: corsHeaders })
    }
    
    // Verificar se a requisição é um POST
    if (req.method === 'POST') {
      try {
        const result = await processKeepsakes()
        const duration = Date.now() - startTime
        
        logWithContext('info', 'Processamento concluído com sucesso', {
          requestId,
          duration,
          result
        })
        
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
        const duration = Date.now() - startTime
        
        logWithContext('error', 'Erro crítico no processamento', {
          requestId,
          duration,
          error: error.message,
          stack: error.stack
        })
        
        return new Response(
          JSON.stringify({ 
            error: 'Erro interno do servidor', 
            details: error.message,
            requestId 
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        )
      }
    }
    
    // Método não suportado - log do erro
    logWithContext('warn', 'Método HTTP não suportado', {
      requestId,
      method: req.method,
      url: req.url
    })
    
    return new Response(
      JSON.stringify({ 
        error: 'Método não suportado',
        allowedMethods: ['POST', 'OPTIONS'],
        requestId
      }),
      {
        status: 405,
        headers: { 
          'Content-Type': 'application/json',
          'Allow': 'POST, OPTIONS',
          ...corsHeaders 
        },
      }
    )
  } catch (error) {
    const duration = Date.now() - startTime
    
    logWithContext('error', 'Erro crítico no handler principal', {
      requestId,
      duration,
      error: error.message,
      stack: error.stack
    })
    
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno crítico',
        requestId
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
})