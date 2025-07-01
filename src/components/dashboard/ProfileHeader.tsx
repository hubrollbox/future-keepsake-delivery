
import React from "react";
import { Button } from "@/components/ui/button";
import { Users, Settings, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ProfileHeader = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-golden-honey to-dusty-rose flex items-center justify-center shadow-soft">
          <Users className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-semibold text-gentle-black">
            Olá, {profile?.full_name || "Guardião Temporal"}
          </h1>
          <p className="text-soft-gray">{user?.email}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate("/profile")}>
          <Settings className="h-4 w-4 mr-2" />
          Perfil
        </Button>
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
