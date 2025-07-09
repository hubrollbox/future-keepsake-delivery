import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Só POST permitido' });
  }

  const { to, subject, body } = req.body;
  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Faltam campos: to, subject ou body' });
  }

  try {
    const resp = await resend.emails.send({
      from: 'Keepla <noreply@keepla.pt>',
      to,
      subject,
      html: `<p>${body}</p>`,
    });
    res.status(200).json({ success: true, id: resp.id });
  } catch (err) {
    console.error('Erro envio email:', err);
    res.status(500).json({ error: 'Falha ao enviar email' });
  }
}