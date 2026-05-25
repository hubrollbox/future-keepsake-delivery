// Cron: envia ao criador (1) lembrete 1 dia antes e (2) confirmação no dia da entrega
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@2.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

function escapeHtml(s: string) {
  return (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}
function fmt(iso: string) {
  try { return new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' }) } catch { return iso }
}

function tpl({ kind, name, title, recipientName, deliveryDate }: { kind: 'reminder' | 'delivered'; name: string; title: string; recipientName: string; deliveryDate: string }) {
  const isReminder = kind === 'reminder'
  const heading = isReminder ? 'Amanhã é o grande dia' : 'A sua cápsula foi entregue'
  const body = isReminder
    ? `A cápsula <em>"${escapeHtml(title)}"</em> será entregue amanhã, ${escapeHtml(fmt(deliveryDate))}, a <strong>${escapeHtml(recipientName)}</strong>.`
    : `A cápsula <em>"${escapeHtml(title)}"</em> foi entregue hoje a <strong>${escapeHtml(recipientName)}</strong>.`
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5f5f5;font-family:Georgia,serif;color:#0a0a0a;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;background:#ffffff;">
    <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:28px;font-weight:400;margin:0 0 24px;letter-spacing:-0.5px;">${heading}</h1>
    <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">Olá ${escapeHtml(name)},</p>
    <p style="font-size:16px;line-height:1.6;margin:0 0 24px;">${body}</p>
    <p style="font-size:14px;color:#666;margin:32px 0 0;">— Equipa Keepla</p>
  </div></body></html>`
}

async function send(to: string, subject: string, html: string) {
  await resend.emails.send({ from: 'Keepla <noreply@keepla.pt>', to: [to], subject, html })
}

serve(async (req) => {
  const cronSecret = Deno.env.get('CRON_SECRET')
  const provided = req.headers.get('x-cron-secret')
  if (cronSecret && provided !== cronSecret) {
    return new Response('Unauthorized', { status: 401 })
  }

  const now = new Date()
  const tomorrow = new Date(now); tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
  const dayAfter = new Date(tomorrow); dayAfter.setUTCDate(dayAfter.getUTCDate() + 1)

  let reminders = 0, delivered = 0, errors = 0

  // 1) Lembretes 1 dia antes
  const { data: dueReminders } = await supabase
    .from('keepsakes')
    .select('id,user_id,title,delivery_date')
    .in('status', ['scheduled', 'pending'])
    .is('reminder_1day_sent_at', null)
    .gte('delivery_date', tomorrow.toISOString().slice(0, 10))
    .lt('delivery_date', dayAfter.toISOString().slice(0, 10))
    .limit(200)

  for (const ks of dueReminders ?? []) {
    try {
      const [{ data: profile }, { data: recipient }] = await Promise.all([
        supabase.from('profiles').select('email,full_name').eq('id', ks.user_id).maybeSingle(),
        supabase.from('recipients').select('name').eq('keepsake_id', ks.id).maybeSingle(),
      ])
      if (!profile?.email) continue
      await send(profile.email, `Lembrete: a sua cápsula é entregue amanhã`, tpl({
        kind: 'reminder', name: profile.full_name || 'olá', title: ks.title || '', recipientName: recipient?.name || 'o destinatário', deliveryDate: ks.delivery_date,
      }))
      await supabase.from('keepsakes').update({ reminder_1day_sent_at: new Date().toISOString() }).eq('id', ks.id)
      reminders++
    } catch (e) { errors++; console.error('reminder error', ks.id, e) }
  }

  // 2) Aviso no dia da entrega
  const { data: dueToday } = await supabase
    .from('keepsakes')
    .select('id,user_id,title,delivery_date')
    .is('creator_delivery_notice_sent_at', null)
    .lte('delivery_date', now.toISOString())
    .limit(200)

  for (const ks of dueToday ?? []) {
    try {
      const [{ data: profile }, { data: recipient }] = await Promise.all([
        supabase.from('profiles').select('email,full_name').eq('id', ks.user_id).maybeSingle(),
        supabase.from('recipients').select('name').eq('keepsake_id', ks.id).maybeSingle(),
      ])
      if (!profile?.email) continue
      await send(profile.email, `A sua cápsula foi entregue`, tpl({
        kind: 'delivered', name: profile.full_name || 'olá', title: ks.title || '', recipientName: recipient?.name || 'o destinatário', deliveryDate: ks.delivery_date,
      }))
      await supabase.from('keepsakes').update({ creator_delivery_notice_sent_at: new Date().toISOString() }).eq('id', ks.id)
      delivered++
    } catch (e) { errors++; console.error('delivered notice error', ks.id, e) }
  }

  return new Response(JSON.stringify({ reminders, delivered, errors }), { headers: { 'Content-Type': 'application/json' } })
})
