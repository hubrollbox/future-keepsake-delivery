
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
    <Card className="bg-white shadow-lg border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl text-gold">Enviar Mensagem</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="O teu nome"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="teu@email.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="subject">Assunto</Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Como podemos ajudar?"
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Conta-nos mais detalhes..."
              rows={5}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gold text-black hover:bg-gold/90 font-semibold"
          >
            Enviar Mensagem
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
