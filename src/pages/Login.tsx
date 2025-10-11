
import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { trackLogin, trackFormSubmission, trackError } from "@/lib/analytics";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A palavra-passe deve ter pelo menos 6 caracteres"),
});

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    try {
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Track form submission
    trackFormSubmission('login_form');
    
    setLoading(true);
    
    const { error } = await signIn(formData.email, formData.password);
    
    setLoading(false);
    
    if (!error) {
      // Track successful login
      trackLogin('email');
      // Navigate directly to dashboard after successful login
      navigate('/dashboard');
    } else {
      // Track login error
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? (error as { message: string }).message 
        : 'Login failed';
      trackError(errorMessage, 'login_page');
    }
  };

  return (
    <div className="min-h-screen bg-lavender-mist flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/keepla-logo-red.png" alt="keepla Logo" className="h-20 mx-auto mb-4" />
        </div>
        <Card className="emotion-card shadow-soft border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-steel-blue font-fraunces">
              Entrar como Guardião
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-steel-blue">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="teu@email.com"
                  className={`border-dusty-rose/30 focus:border-dusty-rose ${errors.email ? "border-red-500" : ""}`}
                  required
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="password" className="text-steel-blue">Palavra-passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="A tua palavra-passe"
                  autoComplete="current-password"
                  className={`border-dusty-rose/30 focus:border-dusty-rose ${errors.password ? "border-red-500" : ""}`}
                  required
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
              </div>
              <Button 
                type="submit" 
                variant="brand"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-misty-gray">
                Ainda não és um Guardião do Tempo?{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-semibold text-dusty-rose"
                  onClick={() => navigate('/register')}
                >
                  Torna-te um aqui
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="mt-8 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-steel-blue hover:text-dusty-rose"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
