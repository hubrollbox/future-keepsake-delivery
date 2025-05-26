
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar registo com Supabase
    console.log("Registration attempt:", formData);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Clock className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              FuturoPresente
            </h1>
          </div>
          <p className="text-gray-600">Começa a criar memórias para o futuro</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">Registar</CardTitle>
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

              <Button type="submit" className="w-full">
                Criar Conta
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já tens conta?{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-semibold"
                  onClick={() => navigate('/login')}
                >
                  Entra aqui
                </Button>
              </p>
            </div>

            {/* Motivational message */}
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-700 text-center italic">
                💜 O teu eu do futuro vai agradecer por começares hoje
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
          >
            ← Voltar ao início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
