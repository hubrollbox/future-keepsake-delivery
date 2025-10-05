import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { CartContext, CartItem } from "./CartContext";
import { logger } from "@/lib/logger";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCartItems = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      logger.error("Error fetching cart items", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o carrinho.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const addToCart = async (productId: string, title: string, _price: number) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar produtos ao carrinho.",
        variant: "destructive",
      });
      return;
    }
    try {
      const existingItem = items.find(item => item.product_id === productId);
      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + 1);
        return;
      }
      
      // SECURITY: Don't send price from client - the database trigger will set the correct price
      const { data, error } = await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: productId,
          // Price and title will be set by validate_cart_item_price() trigger
          quantity: 1,
        })
        .select()
        .single();
      if (error) throw error;
      setItems(prev => [data, ...prev]);
      toast({
        title: "Produto adicionado",
        description: `${title} foi adicionado ao carrinho.`,
      });
    } catch (error) {
      logger.error("Error adding to cart", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }
    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq("id", itemId);
      if (error) throw error;
      setItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));
    } catch (error) {
      logger.error("Error updating quantity", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a quantidade.",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId);
      if (error) throw error;
      setItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: "Produto removido",
        description: "O produto foi removido do carrinho.",
      });
    } catch (error) {
      logger.error("Error removing from cart", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o produto.",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);
      if (error) throw error;
      setItems([]);
    } catch (error) {
      logger.error("Error clearing cart", error);
      throw error;
    }
  };

  const getTotalPrice = () => items.reduce((total, item) => total + (item.product_price * item.quantity), 0);
  const getTotalItems = () => items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setItems([]); // Limpa o carrinho quando o usuário faz logout ou user é null
    }
  }, [user, fetchCartItems]);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
