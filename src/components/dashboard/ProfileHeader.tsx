

import { Button } from "@/components/ui/button";
import { Users, BarChart3, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ProfileHeader = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const isAdmin = profile?.role === "admin";

  console.log('🎯 ProfileHeader render:', { user: !!user, profile: !!profile, loading });

  if (loading) {
    return (
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-md">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-semibold text-muted-foreground-dark">
              A carregar...
            </h1>
            <p className="text-muted-foreground-light">Por favor aguarde...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-muted-dark flex items-center justify-center shadow-soft">
          <Users className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-semibold text-muted-foreground-800">
            Olá, {profile?.full_name || user?.email?.split('@')[0] || "Guardião Temporal"}
          </h1>
          <p className="text-muted-foreground">{user?.email || "Email não disponível"}</p>
          {!profile && user && (
            <p className="text-sm text-primary">⚠️ Perfil não carregado</p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        {isAdmin && (
          <Button variant="brand" onClick={() => navigate("/admin")}> 
            <BarChart3 className="h-4 w-4 mr-2" />
            Admin
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
