// Função para criar uma sessão de checkout Stripe via Supabase Edge Function
import { supabase } from "@/integrations/supabase/client";

export async function createStripeCheckoutSession({
  amount,
  currency = "EUR",
  description,
  deliveryId,
  userEmail
}: {
  amount: number;
  currency?: string;
  description: string;
  deliveryId: string;
  userEmail: string;
}): Promise<string> {
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: { amount, currency, description, deliveryId, userEmail }
  });

  if (error) {
    console.error('Error creating checkout session:', error);
    throw new Error("Erro ao criar sessão de pagamento");
  }

  if (!data?.id) {
    throw new Error("Resposta inválida do servidor de pagamento");
  }

  // Construct Stripe checkout URL from session ID
  return `https://checkout.stripe.com/pay/${data.id}`;
}
