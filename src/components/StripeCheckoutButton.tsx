import { stripePromise } from '@/lib/stripe';

interface StripeCheckoutButtonProps {
  items: {
    price: string; // ID do preço no Stripe
    quantity: number;
  }[];
}

export function StripeCheckoutButton({ items }: StripeCheckoutButtonProps) {
  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    const session = await response.json();

    const result = await stripe?.redirectToCheckout({
      sessionId: session.id,
    });

    if (result?.error) {
      console.error(result.error.message);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
    >
      Finalizar compra
    </button>
  );
}
