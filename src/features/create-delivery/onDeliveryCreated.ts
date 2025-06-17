// Exemplo de uso do agendamento de notificação na criação de entrega
import { scheduleDeliveryNotification } from "@/lib/notificationScheduler";

// Chamar esta função ao criar uma nova entrega
export function onDeliveryCreated({
  id,
  userEmail,
  recipientEmail,
  deliveryDate,
  message
}: {
  id: string;
  userEmail: string;
  recipientEmail: string;
  deliveryDate: string;
  message: string;
}) {
  scheduleDeliveryNotification({
    id,
    userEmail,
    recipientEmail,
    deliveryDate,
    message
  });
}
