
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive"
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      toast({
        title: "Erro",
        description: "Email válido é obrigatório",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.subject.trim()) {
      toast({
        title: "Erro",
        description: "Assunto é obrigatório",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.message.trim() || formData.message.length < 10) {
      toast({
        title: "Erro",
        description: "Mensagem deve ter pelo menos 10 caracteres",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim()
        }
      });

      if (error) throw error;

      toast({
        title: "Mensagem enviada!",
        description: "Obrigado pelo seu contacto. Entraremos em contacto em breve.",
      });

      // Reset form
      setFormData({ name: "", email: "", subject: "", message: "" });

    } catch (error: any) {
      console.error('Error sending contact form:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="emotion-card border-dusty-rose/20">
      <CardHeader>
        <CardTitle className="text-section-title-sm text-steel-blue font-fraunces">
          Enviar Mensagem
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-steel-blue font-medium">Nome completo</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="O teu nome"
              required
              maxLength={100}
              className="border-dusty-rose/30 focus:border-earthy-burgundy bg-white/90"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-steel-blue font-medium">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="teu@email.com"
              required
              maxLength={254}
              className="border-dusty-rose/30 focus:border-earthy-burgundy bg-white/90"
            />
          </div>

          <div>
            <Label htmlFor="subject" className="text-steel-blue font-medium">Assunto</Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Como podemos ajudar?"
              required
              maxLength={200}
              className="border-dusty-rose/30 focus:border-earthy-burgundy bg-white/90"
            />
          </div>

          <div>
            <Label htmlFor="message" className="text-steel-blue font-medium">Mensagem</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Conta-nos mais detalhes..."
              rows={5}
              required
              maxLength={2000}
              className="border-dusty-rose/30 focus:border-earthy-burgundy bg-white/90 resize-none"
            />
            <p className="text-xs text-misty-gray mt-1">
              {formData.message.length}/2000 caracteres
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-earthy-burgundy text-white hover:bg-earthy-burgundy/90 font-semibold py-3 rounded-xl transition-all duration-200"
            disabled={loading}
          >
            {loading ? "A enviar..." : "Enviar Mensagem"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
