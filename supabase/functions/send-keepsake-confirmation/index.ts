// Envia email de confirmação ao criador quando uma cápsula é criada
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@2.0.0'
import { getCorsHeaders } from '../_shared/cors.ts'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

function escapeHtml(s: string) {
  return (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })
  } catch { return iso }
}

function buildHtml(opts: { name: string; title: string; recipientName: string; deliveryDate: string }) {
  const { name, title, recipientName, deliveryDate } = opts
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5f5f5;font-family:Georgia,serif;color:#0a0a0a;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;background:#ffffff;">
    <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:28px;font-weight:400;margin:0 0 24px;letter-spacing:-0.5px;">A sua cápsula foi guardada</h1>
    <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">Olá ${escapeHtml(name)},</p>
    <p style="font-size:16px;line-height:1.6;margin:0 0 24px;">A cápsula <em>"${escapeHtml(title)}"</em> foi criada com sucesso e será entregue a <strong>${escapeHtml(recipientName)}</strong> no dia <strong>${formatDate(deliveryDate)}</strong>.</p>
    <div style="border-left:3px solid #DC143C;padding:12px 0 12px 16px;margin:24px 0;background:#fafafa;">
      <p style="margin:0;font-size:14px;color:#444;">Vamos avisá-lo um dia antes e quando a entrega for concluída.</p>
    </div>
    <p style="font-size:14px;color:#666;margin:32px 0 0;">Obrigado por confiar na Keepla.<br/>— Equipa Keepla</p>
  </div></body></html>`
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin') || undefined)
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const auth = req.headers.get('Authorization')
    if (!auth?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const body = await req.json().catch(() => ({}))
    const keepsakeId: string | undefined = body?.keepsake_id
    if (!keepsakeId) {
      return new Response(JSON.stringify({ error: 'keepsake_id required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const authClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: auth } } })
    const { data: u } = await authClient.auth.getUser(auth.replace('Bearer ', ''))
    if (!u?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const admin = createClient(supabaseUrl, serviceKey)
    const { data: ks } = await admin.from('keepsakes').select('id,user_id,title,delivery_date,creator_confirmation_sent_at').eq('id', keepsakeId).maybeSingle()
    if (!ks || ks.user_id !== u.user.id) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (ks.creator_confirmation_sent_at) {
      return new Response(JSON.stringify({ success: true, skipped: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const { data: profile } = await admin.from('profiles').select('email,full_name').eq('id', ks.user_id).maybeSingle()
    const { data: recipient } = await admin.from('recipients').select('name').eq('keepsake_id', ks.id).maybeSingle()

    if (!profile?.email) {
      return new Response(JSON.stringify({ error: 'No creator email' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const html = buildHtml({
      name: profile.full_name || 'olá',
      title: ks.title || 'Sem título',
      recipientName: recipient?.name || 'o destinatário',
      deliveryDate: ks.delivery_date,
    })

    await resend.emails.send({
      from: 'Keepla <noreply@keepla.pt>',
      to: [profile.email],
      subject: `Cápsula guardada: ${ks.title || ''}`.slice(0, 80),
      html,
    })

    await admin.from('keepsakes').update({ creator_confirmation_sent_at: new Date().toISOString() }).eq('id', ks.id)

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    console.error('send-keepsake-confirmation error', e)
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
