import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, User, Award, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await supabase.auth.refreshSession();
    })();
  }, []);

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lavender-mist">
        <Card className="p-8 shadow-soft">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-serif text-gentle-black">Precisas de iniciar sessão</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button variant="brand" onClick={() => navigate("/login")}>Entrar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lavender-mist py-12">
      <div className="container mx-auto px-4 max-w-xl">
        <Card className="shadow-soft border-dusty-rose/20">
          <CardHeader className="flex flex-col items-center gap-2 pb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-golden-honey to-dusty-rose flex items-center justify-center shadow-soft mb-2">
              <User className="h-16 w-16 text-white" />
            </div>
            <CardTitle className="text-3xl font-serif font-semibold text-gentle-black text-center">{profile.full_name || "Guardião Temporal"}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Mail className="h-5 w-5 text-soft-gray" />
              <span className="text-soft-gray font-medium">{user.email}</span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="w-full flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-golden-honey" />
                <span className="font-medium text-gentle-black">Nível:</span>
                <span className="font-serif text-xl text-gentle-black">{profile.level || 1}</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-golden-honey" />
                <span className="font-medium text-gentle-black">Pontos:</span>
                <span className="font-serif text-xl text-gentle-black">{profile.total_points || 0}</span>
              </div>
            </div>
            <Button variant="gentle" className="rounded-xl font-medium mt-4" onClick={signOut}>
              <LogOut className="h-5 w-5 mr-2" /> Sair
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;