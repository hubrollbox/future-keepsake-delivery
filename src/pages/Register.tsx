
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.name.trim()) {
      setError("O nome é obrigatório.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("As palavras-passe não coincidem.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { data: { name: formData.name } }
    });
    setLoading(false);
    if (error) {
      setError("Erro ao registar: " + error.message);
      toast({ title: "Erro ao registar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Bem-vindo, Guardião!", description: "Verifica o teu email para confirmar o registo e começar a tua jornada temporal." });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Clock className="h-8 w-8 text-amber-700" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent">
              FuturoPresente
            </h1>
          </div>
          <p className="text-gray-600">O teu tempo, entregue</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Trophy className="h-6 w-6 text-amber-700" />
              <CardTitle className="text-2xl font-semibold">Torna-te um Guardião do Tempo</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="O teu nome"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="teu@email.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Palavra-passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar palavra-passe</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800" 
                disabled={loading}
              >
                {loading ? "A criar conta..." : "Tornar-me Guardião"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já és um Guardião do Tempo?{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-semibold text-amber-700"
                  onClick={() => navigate('/login')}
                >
                  Entra aqui
                </Button>
              </p>
            </div>

            {/* Motivational message */}
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800 text-center italic font-medium">
                🕰️ O teu eu do futuro vai agradecer por começares hoje esta jornada temporal
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-amber-700 hover:text-amber-800"
          >
            ← Voltar ao início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
