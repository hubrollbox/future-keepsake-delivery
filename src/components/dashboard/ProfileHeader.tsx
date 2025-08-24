
import React from "react";
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
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-golden-honey to-dusty-rose flex items-center justify-center shadow-soft">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-semibold text-gentle-black">
              A carregar...
            </h1>
            <p className="text-soft-gray">Por favor aguarde...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-golden-honey to-dusty-rose flex items-center justify-center shadow-soft">
          <Users className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-semibold text-gentle-black">
            Olá, {profile?.full_name || user?.email?.split('@')[0] || "Guardião Temporal"}
          </h1>
          <p className="text-soft-gray">{user?.email || "Email não disponível"}</p>
          {!profile && user && (
            <p className="text-sm text-amber-600">⚠️ Perfil não carregado</p>
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
