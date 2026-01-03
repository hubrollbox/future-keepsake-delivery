import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schema de validação com Zod
const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "O nome não pode exceder 100 caracteres")
    .trim(),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Por favor, insira um email válido")
    .max(254, "O email não pode exceder 254 caracteres")
    .trim(),
  subject: z
    .string()
    .min(1, "Assunto é obrigatório")
    .max(200, "O assunto não pode exceder 200 caracteres")
    .trim(),
  message: z
    .string()
    .min(10, "A mensagem deve ter pelo menos 10 caracteres")
    .max(2000, "A mensagem não pode exceder 2000 caracteres")
    .trim(),
  // Campo honeypot para proteção contra spam (deve permanecer vazio)
  honeypot: z.string().max(0, "Erro na validação do formulário").optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      honeypot: "",
    },
  });

  const messageValue = watch("message");

  const onSubmit = async (data: ContactFormData) => {
    // Se o honeypot foi preenchido, não processamos o envio
    if (data.honeypot) {
      console.warn("Bot detection: honeypot field filled");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
        },
      });

      if (error) {
        // Tentativa de extrair uma mensagem de erro mais específica
        let errorMessage = "Não foi possível enviar a mensagem. Tente novamente.";

        if (error.message?.includes("Failed to fetch")) {
          errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
        } else if (error.message?.includes("timeout")) {
          errorMessage = "A operação demorou muito tempo. Tente novamente.";
        } else if (error.message) {
          errorMessage = `Erro: ${error.message}`;
        }

        throw new Error(errorMessage);
      }

      toast({
        title: "Mensagem enviada!",
        description: "Obrigado pelo seu contacto. Entraremos em contacto em breve.",
      });

      // Reset do formulário APENAS em caso de sucesso
      reset();

    } catch (error: unknown) {
      console.error("Error sending contact form:", error);

      const errorMessage = error instanceof Error 
        ? error.message 
        : "Não foi possível enviar a mensagem. Tente novamente.";

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white border border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-keepla-black font-inter font-bold">
          Enviar Mensagem
        </CardTitle>
        <p className="text-muted-foreground font-inter text-sm">
          Preenche o formulário e entraremos em contacto em breve.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Campo Honeypot (proteção contra spam - escondido visualmente) */}
          <div className="sr-only" aria-hidden="true">
            <Label htmlFor="honeypot">Não preencha este campo</Label>
            <Input
              id="honeypot"
              {...register("honeypot")}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <Label htmlFor="name" className="text-keepla-black font-inter font-medium">
              Nome completo *
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="O teu nome"
              className="border-border focus:border-keepla-red bg-white mt-2"
              aria-required="true"
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-keepla-black font-inter font-medium">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="teu@email.com"
              className="border-border focus:border-keepla-red bg-white mt-2"
              aria-required="true"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="subject" className="text-keepla-black font-inter font-medium">
              Assunto *
            </Label>
            <Input
              id="subject"
              {...register("subject")}
              placeholder="Como podemos ajudar?"
              className="border-border focus:border-keepla-red bg-white mt-2"
              aria-required="true"
              aria-invalid={errors.subject ? "true" : "false"}
              aria-describedby={errors.subject ? "subject-error" : undefined}
            />
            {errors.subject && (
              <p id="subject-error" className="text-red-500 text-sm mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="message" className="text-keepla-black font-inter font-medium">
              Mensagem *
            </Label>
            <Textarea
              id="message"
              {...register("message")}
              placeholder="Conta-nos mais detalhes..."
              rows={5}
              className="border-border focus:border-keepla-red bg-white resize-none mt-2"
              aria-required="true"
              aria-invalid={errors.message ? "true" : "false"}
              aria-describedby={errors.message ? "message-error message-counter" : "message-counter"}
            />
            <div className="flex justify-between items-center mt-1">
              <p id="message-counter" className="text-xs text-muted-foreground">
                {messageValue?.length || 0}/2000 caracteres
              </p>
              {errors.message && (
                <p id="message-error" className="text-red-500 text-sm">
                  {errors.message.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-keepla-red text-white hover:bg-keepla-red/90 font-inter font-semibold py-6 text-lg transition-all duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? "A enviar..." : "Enviar Mensagem"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;