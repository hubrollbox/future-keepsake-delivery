// Serviço para envio de emails de notificação (exemplo usando SendGrid API)
// NOTA: Para produção, guardar a chave API em variável de ambiente

export async function sendNotificationEmail({
  to,
  subject,
  text,
  html
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  const SENDGRID_API_KEY = import.meta.env.VITE_SENDGRID_API_KEY;
  const SENDGRID_SENDER = import.meta.env.VITE_SENDGRID_SENDER;

  if (!SENDGRID_API_KEY || !SENDGRID_SENDER) {
    throw new Error("SendGrid API key ou sender não configurados");
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: SENDGRID_SENDER },
      subject,
      content: [
        { type: "text/plain", value: text },
        ...(html ? [{ type: "text/html", value: html }] : [])
      ]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erro ao enviar email: ${error}`);
  }

  return true;
}
