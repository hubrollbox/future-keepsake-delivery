
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, MessageSquare } from "lucide-react";
import { KeepsakeFormData } from "@/hooks/useKeepsakeForm";

interface MessageStepProps {
  formData: KeepsakeFormData;
  updateFormData: (data: Partial<KeepsakeFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const MessageStep = ({ formData, updateFormData, nextStep, prevStep }: MessageStepProps) => {
  const handleNext = () => {
    if (formData.title && formData.message && formData.delivery_date) {
      nextStep();
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <MessageSquare className="h-12 w-12 text-dusty-rose mx-auto mb-4" />
        <h2 className="text-2xl font-serif text-steel-blue mb-2">
          A Tua Mensagem
        </h2>
        <p className="text-misty-gray">
          Escreve as palavras que queres partilhar no futuro
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-steel-blue font-medium">
            Título da Cápsula *
          </Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            placeholder="Ex: Para a minha filha aos 18 anos"
            className="mt-1"
            maxLength={100}
          />
          <p className="text-xs text-misty-gray mt-1">
            {formData.title.length}/100 caracteres
          </p>
        </div>

        <div>
          <Label htmlFor="message" className="text-steel-blue font-medium">
            Mensagem *
          </Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => updateFormData({ message: e.target.value })}
            placeholder="Escreve aqui a tua mensagem..."
            className="mt-1 min-h-32"
            maxLength={2000}
          />
          <p className="text-xs text-misty-gray mt-1">
            {formData.message.length}/2000 caracteres
          </p>
        </div>

        <div>
          <Label htmlFor="delivery_date" className="text-steel-blue font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Data de Entrega *
          </Label>
          <Input
            id="delivery_date"
            type="date"
            value={formData.delivery_date}
            onChange={(e) => updateFormData({ delivery_date: e.target.value })}
            min={getTomorrowDate()}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={prevStep}>
          Voltar
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!formData.title || !formData.message || !formData.delivery_date}
          className="bg-dusty-rose hover:bg-dusty-rose/90 text-white px-8"
        >
          Próximo Passo
        </Button>
      </div>
    </div>
  );
};

export default MessageStep;
