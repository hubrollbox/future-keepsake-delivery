// Mock de geração de link de pagamento (ex: Stripe Checkout)
export async function generatePaymentLink({
  amount,
  currency = "EUR",
  description,
  deliveryId
}: {
  amount: number;
  currency?: string;
  description: string;
  deliveryId: string;
}) {
  // Em produção, chamar API backend que gera link real (ex: Stripe)
  // Aqui, devolve um link fictício
  return `https://pagamento.exemplo.com/pay?ref=${deliveryId}`;
}
