
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Mensagem enviada com sucesso! Entraremos em contacto brevemente.");
    setFormData({ name: "", email: "", subject: "", message: "" });
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
          </div>

          <Button 
            type="submit" 
            className="w-full bg-earthy-burgundy text-white hover:bg-earthy-burgundy/90 font-semibold py-3 rounded-xl transition-all duration-200"
          >
            Enviar Mensagem
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
