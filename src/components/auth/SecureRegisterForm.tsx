
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSecureForm } from '@/hooks/useSecureForm';
import { VALIDATION_PATTERNS } from '@/utils/inputValidation';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SecureRegisterForm = () => {
  const { signUp } = useAuth();
  const { toast } = useToast();

  const {
    updateField,
    getFieldValue,
    getFieldErrors,
    submitForm,
    isSubmitting
  } = useSecureForm<RegisterFormData>({
    fullName: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: VALIDATION_PATTERNS.name
    },
    email: {
      required: true,
      maxLength: 254,
      pattern: VALIDATION_PATTERNS.email
    },
    password: {
      required: true,
      minLength: 8,
      pattern: VALIDATION_PATTERNS.strongPassword
    },
    confirmPassword: {
      required: true,
      customValidator: (value) => value === getFieldValue('password')
    }
  }, {
    rateLimit: {
      maxAttempts: 3,
      windowMs: 300000 // 5 minutes
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userEmail = getFieldValue('email');
      
      await submitForm(async (formValues) => {
        if (formValues.password !== formValues.confirmPassword) {
          throw new Error('As palavras-passe não coincidem');
        }

        const { error } = await signUp(
          formValues.email!,
          formValues.password!,
          formValues.fullName!
        );

        if (error) {
          throw new Error(error.message);
        }

        toast({
          title: 'Conta criada com sucesso',
          description: 'Verifique o seu email para confirmar a conta.',
        });
      }, userEmail);
    } catch (error: any) {
      toast({
        title: 'Erro no registo',
        description: error.message,
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
        <form onSubmit={handleSubmit} className="space-y-4">
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
              Mínimo 8 caracteres, deve incluir maiúscula, minúscula, número e símbolo
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
