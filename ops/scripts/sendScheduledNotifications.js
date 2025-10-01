// Script Node.js para processar notificações agendadas
// Requer: npm install @supabase/supabase-js node-fetch

const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function sendNotificationEmail({ to, subject, text }) {
  // Exemplo usando SendGrid
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const SENDGRID_SENDER = process.env.SENDGRID_SENDER;
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: SENDGRID_SENDER },
      subject,
      content: [{ type: 'text/plain', value: text }]
    })
  });
  if (!response.ok) throw new Error(await response.text());
}

async function processScheduledNotifications() {

  const { data: notifications, error: _err } = await supabase
    .from('scheduled_notifications')
    .select('*')
    .eq('status', 'pending')
    .lte('delivery_date', new Date().toISOString());

  if (_err) throw _err;
  if (!notifications.length) return;

  for (const notif of notifications) {
    try {
      await sendNotificationEmail({
        to: notif.user_email,
        subject: 'Entrega programada enviada!',
        text: notif.message
      });
      await sendNotificationEmail({
        to: notif.recipient_email,
        subject: 'Recebeste uma keepsake!',
        text: notif.message
      });
      await supabase
        .from('scheduled_notifications')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', notif.id);
    } catch {
      await supabase
        .from('scheduled_notifications')
        .update({ status: 'error' })
        .eq('id', notif.id);
    }
  }
}

processScheduledNotifications().then(() => {
  console.log('Notificações processadas.');
  process.exit(0);
});
