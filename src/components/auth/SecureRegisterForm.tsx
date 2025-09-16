
import type React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSecureForm } from '@/hooks/useSecureForm';
import { secureEmailSchema, securePasswordSchema, secureNameSchema } from '@/components/auth/SecureInputValidation';
import { trackSignUp, trackFormSubmission, trackError } from '@/lib/analytics';
import { z } from 'zod';

const registerSchema = z.object({
  fullName: secureNameSchema,
  email: secureEmailSchema,
  password: securePasswordSchema,
  confirmPassword: z.string().min(1, "Confirmação de palavra-passe é obrigatória")
}).refine((data) => data.password === data.confirmPassword, {
  message: "As palavras-passe não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const SecureRegisterForm = () => {
  const { signUp } = useAuth();
  const { toast } = useToast();

  const {
    updateField,
    getFieldValue,
    getFieldErrors,
    handleSubmit,
    isSubmitting
  } = useSecureForm<RegisterFormData>({
    schema: registerSchema,
    onSubmit: async (validatedData) => {
      // Track form submission
      trackFormSubmission('register_form');
      
      const { error } = await signUp(
        validatedData.email,
        validatedData.password,
        validatedData.fullName
      );

      if (error) {
        const msg = typeof error === 'object' && error && 'message' in error ? String((error as any).message) : 'Erro no registo';
        // Track registration error
        trackError(msg, 'register_form');
        throw new Error(msg);
      }

      // Track successful registration
      trackSignUp('email');
      
      toast({
        title: 'Conta criada com sucesso',
        description: 'Verifique o seu email para confirmar a conta.',
      });
    },
    sanitizeFields: ['fullName']
  });

  const onSubmit = async (e: React.FormEvent) => {
    try {
      await handleSubmit(e);
    } catch (error: unknown) {
      toast({
        title: 'Erro no registo',
        description: error instanceof Error ? error.message : 'Ocorreu um erro. Tenta novamente.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-serif text-steel-blue text-center">
          Criar Conta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Nome completo"
              value={getFieldValue('fullName')}
              onChange={(e) => updateField('fullName', e.target.value)}
              maxLength={100}
              required
            />
            {getFieldErrors('fullName').map((error, index) => (
              <p key={index} className="text-sm text-red-600 mt-1">{error}</p>
            ))}
          </div>

          <div>
            <Input
              type="email"
              placeholder="Email"
              value={getFieldValue('email')}
              onChange={(e) => updateField('email', e.target.value)}
              maxLength={254}
              required
            />
            {getFieldErrors('email').map((error, index) => (
              <p key={index} className="text-sm text-red-600 mt-1">{error}</p>
            ))}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Palavra-passe"
              value={getFieldValue('password')}
              onChange={(e) => updateField('password', e.target.value)}
              required
            />
            {getFieldErrors('password').map((error, index) => (
              <p key={index} className="text-sm text-red-600 mt-1">{error}</p>
            ))}
            <p className="text-xs text-misty-gray mt-1">
              Mínimo 8 caracteres, deve incluir maiúscula, minúscula, número
            </p>
          </div>

          <div>
            <Input
              type="password"
              placeholder="Confirmar palavra-passe"
              value={getFieldValue('confirmPassword')}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              required
            />
            {getFieldErrors('confirmPassword').map((error, index) => (
              <p key={index} className="text-sm text-red-600 mt-1">{error}</p>
            ))}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-dusty-rose hover:bg-dusty-rose/90"
          >
            {isSubmitting ? 'A criar conta...' : 'Criar Conta'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SecureRegisterForm;
