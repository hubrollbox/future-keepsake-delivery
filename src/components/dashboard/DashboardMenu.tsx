

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import CartButton from "@/components/cart/CartButton";
import CartModal from "@/components/cart/CartModal";

const DashboardMenu = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      <nav className="flex flex-wrap justify-center items-center gap-4 w-full mb-8">
        <CartButton onClick={() => setIsCartOpen(true)} />
        <Button onClick={handleSignOut} variant="ghost" className="rounded-xl text-misty-gray hover:text-steel-blue">Sair</Button>
      </nav>
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default DashboardMenu;
