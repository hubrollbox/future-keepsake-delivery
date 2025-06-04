
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface CartButtonProps {
  onClick: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({ onClick }) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <Button
      variant="gold-outline"
      size="sm"
      onClick={onClick}
      className="relative hover:scale-105 transition-all duration-200"
    >
      <ShoppingCart className="h-4 w-4" />
      {totalItems > 0 && (
        <Badge 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-gold-gradient text-black text-xs font-semibold shadow-sm"
        >
          {totalItems}
        </Badge>
      )}
    </Button>
  );
};

export default CartButton;
