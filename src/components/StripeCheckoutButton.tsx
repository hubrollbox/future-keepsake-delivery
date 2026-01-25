import { stripePromise } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

interface StripeCheckoutButtonProps {
  items: {
    price: string; // ID do preço no Stripe
    quantity: number;
  }[];
}

export function StripeCheckoutButton({ items }: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const stripe = await stripePromise;

      // Call Supabase Edge Function instead of non-existent API route
      const { data, error: fnError } = await supabase.functions.invoke('create-checkout-session', {
        body: { items }
      });

      if (fnError) {
        console.error('Error creating checkout session:', fnError);
        setError('Erro ao iniciar pagamento. Tente novamente.');
        return;
      }

      if (!data?.id) {
        setError('Resposta inválida do servidor.');
        return;
      }

      // In newer versions of Stripe.js, use redirect instead of redirectToCheckout
      if (stripe) {
        window.location.href = `https://checkout.stripe.com/pay/${data.id}`;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'A processar...' : 'Finalizar compra'}
      </button>
      {error && <p className="text-destructive text-sm mt-2">{error}</p>}
    </div>
  );
}
