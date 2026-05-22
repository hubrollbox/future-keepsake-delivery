import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase coloca um access_token no hash quando o utilizador clica no link de recuperação.
    // O onAuthStateChange evento PASSWORD_RECOVERY confirma a sessão de recuperação.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    // Fallback: se já há sessão activa, permite alterar
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: "Palavra-passe demasiado curta", description: "Mínimo 8 caracteres.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Palavras-passe não coincidem", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Palavra-passe actualizada", description: "Já podes entrar com a nova palavra-passe." });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <SEOHead title="Definir nova palavra-passe" description="Define a tua nova palavra-passe keepla." />
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recuperação</p>
          <h1 className="text-3xl md:text-4xl font-['Playfair_Display',Georgia,serif] text-foreground">
            Definir nova palavra-passe
          </h1>
          <p className="text-sm text-muted-foreground font-inter">
            {ready
              ? "Escolhe uma palavra-passe forte (mínimo 8 caracteres)."
              : "A validar o link de recuperação..."}
          </p>
        </div>

        <div className="space-y-3">
          <Input
            type="password"
            placeholder="Nova palavra-passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            disabled={!ready}
            required
          />
          <Input
            type="password"
            placeholder="Confirmar palavra-passe"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            disabled={!ready}
            required
          />
        </div>

        <Button type="submit" variant="brand" className="w-full" disabled={!ready || loading}>
          {loading ? "A actualizar..." : "Actualizar palavra-passe"}
        </Button>
      </form>
    </div>
  );
};

export default UpdatePassword;
