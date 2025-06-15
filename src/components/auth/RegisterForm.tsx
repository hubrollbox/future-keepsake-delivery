import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import SeloDoTempoIcon from "@/components/SeloDoTempoIcon";

const registerSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A palavra-passe deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "É obrigatório aceitar os Termos e Condições." }),
  }),
  marketingAccepted: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As palavras-passe não coincidem",
  path: ["confirmPassword"],
});

const RegisterForm = () => {
  const navigate = useNavigate();
  const { signUp, toast } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    marketingAccepted: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // refs para foco automático no erro
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));

    // Limpa erro ao digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    try {
      registerSchema.parse(formData);
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

        // Foca no primeiro erro
        if (newErrors.name) nameRef.current?.focus();
        else if (newErrors.email) emailRef.current?.focus();
        else if (newErrors.password) passwordRef.current?.focus();
        else if (newErrors.confirmPassword) confirmPasswordRef.current?.focus();
        else if (newErrors.termsAccepted) termsRef.current?.focus();
      }
      return false;
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    const { error } = await signUp(formData.email, formData.password, formData.name);
    
    setLoading(false);
    
    if (!error) {
      toast && toast({
        title: "Conta criada!",
        description: "Verifica o teu email para confirmar o registo.",
        duration: 2500
      });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <Card className="emotion-card shadow-soft border-0">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Heart className="h-6 w-6 text-dusty-rose" />
          <CardTitle className="text-2xl font-semibold text-steel-blue font-fraunces">
            Torna-te um Guardião do Tempo
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-6 md:space-y-4">
          <div>
            <Label htmlFor="name" className="text-steel-blue">Nome completo</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="O teu nome"
              className={`border-dusty-rose/30 focus:border-dusty-rose ${errors.name ? "border-red-500" : ""}`}
              required
              ref={nameRef}
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

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
              ref={emailRef}
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
              className={`border-dusty-rose/30 focus:border-dusty-rose ${errors.password ? "border-red-500" : ""}`}
              required
              ref={passwordRef}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-steel-blue">Confirmar palavra-passe</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirma a tua palavra-passe"
              className={`border-dusty-rose/30 focus:border-dusty-rose ${errors.confirmPassword ? "border-red-500" : ""}`}
              required
              ref={confirmPasswordRef}
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex items-center space-x-2 mt-1">
            <input
              id="termsAccepted"
              name="termsAccepted"
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={handleInputChange}
              ref={termsRef}
              className="h-5 w-5 rounded border border-dusty-rose/30 focus:outline-none focus:ring-2 focus:ring-dusty-rose/40 transition-all duration-200"
              required
            />
            <Label htmlFor="termsAccepted" className="text-steel-blue">
              Aceito os{" "}
              <a 
                href="/terms-conditions" 
                target="_blank"
                className="underline text-dusty-rose hover:text-earthy-burgundy"
              >
                Termos e Condições
              </a>
            </Label>
          </div>
          {errors.termsAccepted && (
            <p className="text-red-600 text-sm mt-1">{errors.termsAccepted}</p>
          )}

          <div className="flex items-center space-x-2 mt-1">
            <input
              id="marketingAccepted"
              name="marketingAccepted"
              type="checkbox"
              checked={formData.marketingAccepted}
              onChange={handleInputChange}
              className="h-5 w-5 rounded border border-dusty-rose/30 focus:outline-none focus:ring-2 focus:ring-dusty-rose/40 transition-all duration-200"
            />
            <Label htmlFor="marketingAccepted" className="text-misty-gray">
              Gostaria de receber novidades da FuturoPresente (opcional)
            </Label>
          </div>

          <Button 
            type="submit" 
            variant="brand"
            size="lg"
            className="w-full py-4 text-base md:text-lg"
            disabled={loading}
          >
            {loading ? "A criar conta..." : "Tornar-me Guardião"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-misty-gray">
            Já és um Guardião do Tempo?{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto font-semibold text-dusty-rose"
              onClick={() => navigate('/login')}
            >
              Entra aqui
            </Button>
          </p>
        </div>

        <div className="mt-6 p-4 bg-sand-beige/30 rounded-xl border border-dusty-rose/20">
          <p className="text-sm text-steel-blue text-center italic font-medium font-fraunces">
            🕰️ O teu eu do futuro vai agradecer por começares hoje esta jornada temporal
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
