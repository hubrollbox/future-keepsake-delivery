import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const DashboardMenu = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="flex flex-wrap justify-center items-center gap-4 w-full mb-8">
      <Link to="/dashboard" className="nav-link">
        <Button variant="outline" className="rounded-xl border-dusty-rose text-dusty-rose hover:bg-dusty-rose/10">Dashboard</Button>
      </Link>
      <Link to="/profile" className="nav-link">
        <Button variant="outline" className="rounded-xl border-golden-honey text-golden-honey hover:bg-golden-honey/10">Perfil</Button>
      </Link>
      <Link to="/create-message" className="nav-link">
        <Button variant="outline" className="rounded-xl border-steel-blue text-steel-blue hover:bg-steel-blue/10">Criar Mensagem</Button>
      </Link>
      <Link to="/products" className="nav-link">
        <Button variant="outline" className="rounded-xl border-brand-gradient text-brand-gradient hover:bg-brand-gradient/10">Loja</Button>
      </Link>
      <Button onClick={handleSignOut} variant="ghost" className="rounded-xl text-misty-gray hover:text-steel-blue">Sair</Button>
    </nav>
  );
};

export default DashboardMenu;