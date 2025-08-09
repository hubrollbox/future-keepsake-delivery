// Função para criar uma sessão de checkout Stripe via API própria ou Supabase Edge Function
// Substitua a URL pelo endpoint real do backend

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
  const response = await fetch("/api/create-stripe-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency, description, deliveryId, userEmail })
  });
  if (!response.ok) throw new Error("Erro ao criar sessão de pagamento");
  const data = await response.json();
  return data.checkoutUrl; // URL do Stripe Checkout
}
