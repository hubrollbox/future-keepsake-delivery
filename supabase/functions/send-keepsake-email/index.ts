import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface KeepsakeEmailData {
  keepsake_id: string
  recipient_email: string
  recipient_name: string
  sender_name: string
  title: string
  message_content: string
  delivery_date: string
}

// HTML entity encoding to prevent XSS attacks
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { keepsake_id, recipient_email, recipient_name, sender_name, title, message_content, delivery_date }: KeepsakeEmailData = await req.json()

    // Validate required fields
    if (!keepsake_id || !recipient_email || !title || !message_content) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Sanitize user inputs to prevent XSS
    const safeRecipientName = escapeHtml(recipient_name || 'destinatário');
    const safeSenderName = escapeHtml(sender_name || 'alguém especial');
    const safeTitle = escapeHtml(title);
    const safeMessageContent = escapeHtml(message_content).replace(/\n/g, '<br>');

    // Email template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Você recebeu uma Cápsula Digital</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎁 Cápsula Digital Recebida</h1>
          <p>Uma mensagem especial chegou para você!</p>
        </div>
        <div class="content">
          <p>Olá <strong>${safeRecipientName}</strong>,</p>
          <p>Você recebeu uma cápsula digital de <strong>${safeSenderName}</strong>!</p>
          
          <div class="message-box">
            <h3>📝 ${safeTitle}</h3>
            <p>${safeMessageContent}</p>
          </div>
          
          <p><strong>Data de entrega:</strong> ${new Date(delivery_date).toLocaleDateString('pt-BR')}</p>
          
          <div class="footer">
            <p>Esta mensagem foi enviada através do Future Keepsake Delivery</p>
            <p>Uma forma especial de preservar e compartilhar memórias 💝</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send email using Supabase Edge Function or external service
    // For now, we'll use a simple email service integration
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Future Keepsake <noreply@futurekeepsake.com>',
        to: [recipient_email],
        subject: `🎁 Cápsula Digital: ${title}`,
        html: emailHtml,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text()
      console.error('Email sending failed:', errorData)
      
      // Update notification status to failed
      await supabaseClient
        .from('unified_notifications')
        .update({ 
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('keepsake_id', keepsake_id)
        .eq('recipient_id', recipient_email)
      
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: errorData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const emailResult = await emailResponse.json()
    console.log('Email sent successfully:', emailResult)

    // Update notification status to sent
    const { error: updateError } = await supabaseClient
      .from('unified_notifications')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('keepsake_id', keepsake_id)

    if (updateError) {
      console.error('Failed to update notification status:', updateError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        email_id: emailResult.id 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in send-keepsake-email function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})