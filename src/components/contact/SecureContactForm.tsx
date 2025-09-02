

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSecureForm } from "@/hooks/useSecureForm";
import { secureEmailSchema, secureNameSchema, secureMessageSchema } from "@/components/auth/SecureInputValidation";
import { z } from "zod";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: secureNameSchema,
  email: secureEmailSchema,
  subject: z.string().min(1, "Assunto é obrigatório").max(200, "Assunto demasiado longo"),
  message: secureMessageSchema
});

type ContactFormData = z.infer<typeof contactSchema>;

const SecureContactForm = () => {
  const { toast } = useToast();

  const { data, errors, updateField, handleSubmit, isSubmitting, reset } = useSecureForm<ContactFormData>({
    schema: contactSchema,
    onSubmit: async (validatedData) => {
      try {
        const { error } = await supabase.functions.invoke('send-contact-email', {
          body: validatedData
        });

        if (error) throw error;

        toast({
          title: "Mensagem Enviada!",
          description: "Obrigado pelo contacto. Responderemos brevemente.",
        });

        reset();
      } catch (error) {
        console.error('Error sending contact form:', error);
        toast({
          title: "Erro",
          description: "Não foi possível enviar a mensagem. Tenta novamente.",
          variant: "destructive",
        });
      }
    },
    sanitizeFields: ['name', 'subject', 'message']
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-steel-blue font-medium">
            Nome *
          </Label>
          <Input
            id="name"
            type="text"
            value={data.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="O teu nome"
            className={cn(
              "border-sand-beige focus:border-dusty-rose",
              errors.name && "border-red-500"
            )}
            maxLength={100}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-steel-blue font-medium">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="teu@email.com"
            className={cn(
              "border-sand-beige focus:border-dusty-rose",
              errors.email && "border-red-500"
            )}
            maxLength={254}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-steel-blue font-medium">
          Assunto *
        </Label>
        <Input
          id="subject"
          type="text"
          value={data.subject || ''}
          onChange={(e) => updateField('subject', e.target.value)}
          placeholder="Assunto da mensagem"
          className={cn(
            "border-sand-beige focus:border-dusty-rose",
            errors.subject && "border-red-500"
          )}
          maxLength={200}
          disabled={isSubmitting}
        />
        {errors.subject && (
          <p className="text-sm text-red-500">{errors.subject}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-steel-blue font-medium">
          Mensagem *
        </Label>
        <Textarea
          id="message"
          value={data.message || ''}
          onChange={(e) => updateField('message', e.target.value)}
          placeholder="Escreve aqui a tua mensagem..."
          className={cn(
            "min-h-[120px] border-sand-beige focus:border-dusty-rose resize-none",
            errors.message && "border-red-500"
          )}
          maxLength={5000}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="text-sm text-red-500">{errors.message}</p>
        )}
        <p className="text-sm text-misty-gray">
          {data.message?.length || 0}/5000 caracteres
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-dusty-rose hover:bg-dusty-rose/90 text-white font-medium py-3"
        disabled={isSubmitting}
      >
        {isSubmitting ? "A enviar..." : "Enviar Mensagem"}
      </Button>
    </form>
  );
};

export default SecureContactForm;
