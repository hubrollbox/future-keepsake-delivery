import { createContext } from "react";

export interface CartItem {
  id: string;
  product_id: string;
  product_title: string;
  product_price: number;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: string, title: string, price: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
