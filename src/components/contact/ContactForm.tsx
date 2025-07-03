
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  subject: z.string().min(2, "Assunto obrigatório"),
  message: z.string().min(5, "Mensagem muito curta")
});

async function sendResendEmail({ to, subject, text }: { to: string; subject: string; text: string }) {
  const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
  const RESEND_SENDER = import.meta.env.VITE_RESEND_SENDER;
  if (!RESEND_API_KEY || !RESEND_SENDER) throw new Error("Resend API key ou sender não configurados");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: RESEND_SENDER,
      to: [to],
      subject,
      text
    })
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erro ao enviar email: ${error}`);
  }
  return true;
}

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: { [k: string]: string } = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    try {
      await sendResendEmail({
        to: "contato@keepla.pt",
        subject: formData.subject,
        text: `Nome: ${formData.name}\nEmail: ${formData.email}\nMensagem: ${formData.message}`
      });
      setSuccess("Mensagem enviada com sucesso! Entraremos em contacto brevemente.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setErrors({ global: err.message || "Erro ao enviar mensagem." });
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
              aria-required="true"
              aria-label="Nome completo"
              className="border-dusty-rose/30 focus:border-earthy-burgundy bg-white/90"
            />
            {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
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
              aria-required="true"
              aria-label="Email"
              className="border-dusty-rose/30 focus:border-earthy-burgundy bg-white/90"
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
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
              aria-required="true"
              aria-label="Assunto"
              className="border-dusty-rose/30 focus:border-earthy-burgundy bg-white/90"
            />
            {errors.subject && <span className="text-red-500 text-xs">{errors.subject}</span>}
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
              aria-required="true"
              aria-label="Mensagem"
              className="border-dusty-rose/30 focus:border-earthy-burgundy bg-white/90"
            />
            {errors.message && <span className="text-red-500 text-xs">{errors.message}</span>}
          </div>

          {errors.global && <div className="text-red-500 text-sm">{errors.global}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}

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
