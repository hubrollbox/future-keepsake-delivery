
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import RegisterInputField from "./RegisterInputField";
import RegisterCheckboxField from "./RegisterCheckboxField";
import RegisterMotivation from "./RegisterMotivation";

const registerSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(9, "O telemóvel deve ter pelo menos 9 dígitos").regex(/^\d+$/, "O telemóvel deve conter apenas números"),
  password: z.string().min(6, "A palavra-passe deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "É obrigatório aceitar os Termos e Condições." }),
  }),
  marketingAccepted: z.boolean().optional(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "As palavras-passe não coincidem",
  path: ["confirmPassword"],
});

const RegisterForm = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
  const phoneRef = useRef<HTMLInputElement>(null);

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
        else if (newErrors.phone) phoneRef.current?.focus();
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
          <RegisterInputField
            id="name"
            name="name"
            label="Nome completo"
            placeholder="O teu nome"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            required
            inputRef={nameRef}
          />
          <RegisterInputField
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="teu@email.com"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            required
            inputRef={emailRef}
          />
          <RegisterInputField
            id="phone"
            name="phone"
            type="tel"
            label="Telemóvel"
            placeholder="O teu número de telemóvel"
            value={formData.phone}
            onChange={handleInputChange}
            error={errors.phone}
            required
            inputRef={phoneRef}
          />
          <RegisterInputField
            id="password"
            name="password"
            type="password"
            label="Palavra-passe"
            placeholder="A tua palavra-passe"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            required
            inputRef={passwordRef}
          />
          <RegisterInputField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirmar palavra-passe"
            placeholder="Confirma a tua palavra-passe"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            required
            inputRef={confirmPasswordRef}
          />

          <RegisterCheckboxField
            id="termsAccepted"
            name="termsAccepted"
            label={
              <>
                Aceito os{" "}
                <a
                  href="/terms-conditions"
                  target="_blank"
                  className="underline text-dusty-rose hover:text-earthy-burgundy"
                >
                  Termos e Condições
                </a>
              </>
            }
            checked={formData.termsAccepted}
            onChange={handleInputChange}
            error={errors.termsAccepted}
            required
            inputRef={termsRef}
          />

          <RegisterCheckboxField
            id="marketingAccepted"
            name="marketingAccepted"
            label={
              <span className="text-misty-gray">
                Gostaria de receber novidades da keepla (opcional)
              </span>
            }
            checked={formData.marketingAccepted}
            onChange={handleInputChange}
          />

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

        <RegisterMotivation />
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
