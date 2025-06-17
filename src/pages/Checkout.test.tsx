import { render, screen, fireEvent } from '@testing-library/react';
import Checkout from './Checkout';
import { CartContext } from '@/contexts/CartContextExport';
import { vi, describe, it, expect } from 'vitest';

const mockCart = {
  items: [
    { id: 'item-1', product_id: '1', product_title: 'Produto Teste', product_price: 10, quantity: 1 }
  ],
  getTotalPrice: () => 10,
  clearCart: vi.fn(),
  loading: false,
  addToCart: vi.fn(),
  updateQuantity: vi.fn(),
  removeFromCart: vi.fn(),
  getTotalItems: () => 1,
};

const mockUser = { email: 'teste@exemplo.com' };

const AuthContext = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

describe('Checkout', () => {
  it('exibe mensagem de erro se campos obrigatórios não forem preenchidos', () => {
    render(
      <AuthContext>
        <CartContext.Provider value={mockCart}>
          <Checkout />
        </CartContext.Provider>
      </AuthContext>
    );
    fireEvent.click(screen.getByText(/finalizar compra/i));
    expect(screen.getByText(/preencha todos os campos obrigatórios/i)).toBeInTheDocument();
  });
});
