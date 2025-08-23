
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNotifications } from "./useNotifications";

export const useRealtimeDeliveries = (enabled: boolean = true) => {
  const { createNotification } = useNotifications();

  useEffect(() => {
    if (!enabled) return;
    // Subscribe to delivery status changes
    const channel = supabase
      .channel('delivery-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'deliveries'
        },
        (payload) => {
          const delivery = payload.new;
          const oldDelivery = payload.old;
          
          // Check if status changed to delivered
          if (oldDelivery.status !== 'delivered' && delivery.status === 'delivered') {
            createNotification(
              "Entrega Realizada",
              `A sua mensagem "${delivery.title}" foi entregue com sucesso!`,
              "delivery"
            );
          }
          
          // Check if status changed to cancelled
          if (oldDelivery.status !== 'cancelled' && delivery.status === 'cancelled') {
            createNotification(
              "Entrega Cancelada",
              `A sua mensagem "${delivery.title}" foi cancelada.`,
              "delivery"
            );
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'deliveries'
        },
        (payload) => {
          const delivery = payload.new;
          createNotification(
            "Nova Entrega Agendada",
            `A sua mensagem "${delivery.title}" foi agendada com sucesso!`,
            "delivery"
          );
        }
      )
      .subscribe();

    // Subscribe to payment updates
    const paymentsChannel = supabase
      .channel('payment-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'payments'
        },
        (payload) => {
          const payment = payload.new;
          const oldPayment = payload.old;
          
          if (oldPayment.status !== 'completed' && payment.status === 'completed') {
            createNotification(
              "Pagamento Confirmado",
              `O seu pagamento de €${payment.amount} foi processado com sucesso.`,
              "payment"
            );
          }
          
          if (oldPayment.status !== 'failed' && payment.status === 'failed') {
            createNotification(
              "Pagamento Falhado",
              `O seu pagamento de €${payment.amount} não foi processado. Tente novamente.`,
              "payment"
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(paymentsChannel);
    };
  }, [enabled, createNotification]);
};
