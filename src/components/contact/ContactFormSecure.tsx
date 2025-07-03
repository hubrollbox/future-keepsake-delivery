
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactFormSecure = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<number>(0);
  const { toast } = useToast();

  // Rate limiting - 1 submission per minute
  const RATE_LIMIT_MS = 60000;

  const validateInput = (data: ContactFormData): string[] => {
    const errors: string[] = [];
    
    // Name validation
    if (!data.name.trim()) {
      errors.push('Nome é obrigatório');
    } else if (data.name.length > 100) {
      errors.push('Nome não pode exceder 100 caracteres');
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(data.name.trim())) {
      errors.push('Nome deve conter apenas letras e espaços');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      errors.push('Email é obrigatório');
    } else if (!emailRegex.test(data.email)) {
      errors.push('Email deve ter um formato válido');
    } else if (data.email.length > 254) {
      errors.push('Email não pode exceder 254 caracteres');
    }

    // Subject validation
    if (!data.subject.trim()) {
      errors.push('Assunto é obrigatório');
    } else if (data.subject.length > 200) {
      errors.push('Assunto não pode exceder 200 caracteres');
    }

    // Message validation
    if (!data.message.trim()) {
      errors.push('Mensagem é obrigatória');
    } else if (data.message.length < 10) {
      errors.push('Mensagem deve ter pelo menos 10 caracteres');
    } else if (data.message.length > 2000) {
      errors.push('Mensagem não pode exceder 2000 caracteres');
    }

    return errors;
  };

  const sanitizeInput = (input: string): string => {
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    const now = Date.now();
    if (now - lastSubmission < RATE_LIMIT_MS) {
      toast({
        title: 'Limite de envios',
        description: 'Por favor, aguarde um minuto antes de enviar outra mensagem.',
        variant: 'destructive'
      });
      return;
    }

    // Validate input
    const errors = validateInput(formData);
    if (errors.length > 0) {
      toast({
        title: 'Erro de validação',
        description: errors.join(', '),
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert into notifications table for admin review
      const { error } = await supabase
        .from('notifications')
        .insert([
          {
            type: 'contact_form',
            title: `Nova mensagem de contacto: ${formData.subject}`,
            message: `Nome: ${formData.name}\nEmail: ${formData.email}\nAssunto: ${formData.subject}\nMensagem: ${formData.message}`,
            user_id: null, // This will be handled by admin
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast({
        title: 'Mensagem enviada',
        description: 'A sua mensagem foi enviada com sucesso. Entraremos em contacto em breve.',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setLastSubmission(now);

    } catch (error: any) {
      console.error('Error sending contact form:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a mensagem. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-serif text-steel-blue text-center">
          Entre em Contacto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-steel-blue mb-2">
              Nome *
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              maxLength={100}
              required
              className="w-full"
              placeholder="O seu nome"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-steel-blue mb-2">
              Email *
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              maxLength={254}
              required
              className="w-full"
              placeholder="seuemail@exemplo.com"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-steel-blue mb-2">
              Assunto *
            </label>
            <Input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              maxLength={200}
              required
              className="w-full"
              placeholder="Assunto da sua mensagem"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-steel-blue mb-2">
              Mensagem *
            </label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              maxLength={2000}
              required
              className="w-full min-h-[120px]"
              placeholder="A sua mensagem..."
            />
            <p className="text-xs text-misty-gray mt-1">
              {formData.message.length}/2000 caracteres
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-dusty-rose hover:bg-dusty-rose/90 text-white"
          >
            {isSubmitting ? 'A enviar...' : 'Enviar Mensagem'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactFormSecure;
