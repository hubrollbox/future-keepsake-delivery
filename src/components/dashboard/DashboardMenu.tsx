
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import CartButton from "@/components/cart/CartButton";

const DashboardMenu = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="flex flex-wrap justify-center items-center gap-4 w-full mb-8">

      <CartButton onClick={() => setIsCartOpen(true)} />
      <Button onClick={handleSignOut} variant="ghost" className="rounded-xl text-misty-gray hover:text-steel-blue">Sair</Button>
    </nav>
  );
};

export default DashboardMenu;
