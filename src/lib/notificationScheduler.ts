// Utilitário para agendar e enviar notificações de entrega
// NOTA: Em produção, o agendamento deve ser feito por backend/cronjob. Aqui é um mock para MVP.

import { sendNotificationEmail } from "@/lib/emailService";

export interface DeliveryNotification {
  id: string;
  userEmail: string;
  recipientEmail: string;
  deliveryDate: string; // ISO string
  message: string;
}

// Mock: lista de notificações agendadas (em produção, viria da base de dados)
const scheduledNotifications: DeliveryNotification[] = [];

export function scheduleDeliveryNotification(notification: DeliveryNotification) {
  scheduledNotifications.push(notification);
}

// Função para verificar e enviar notificações agendadas (chamar periodicamente)
export async function processScheduledNotifications() {
  const now = new Date();
  for (const notif of scheduledNotifications) {
    const deliveryTime = new Date(notif.deliveryDate);
    if (deliveryTime <= now) {
      // Enviar email para utilizador e destinatário
      await sendNotificationEmail({
        to: notif.userEmail,
        subject: "Entrega programada enviada!",
        text: notif.message
      });
      await sendNotificationEmail({
        to: notif.recipientEmail,
        subject: "Recebeste uma keepsake!",
        text: notif.message
      });
      // Remover da lista (simula envio)
      scheduledNotifications.splice(scheduledNotifications.indexOf(notif), 1);
    }
  }
}
