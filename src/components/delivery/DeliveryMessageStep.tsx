
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

type Props = {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  deliveryType: string;
  prevStep: () => void;
  nextStep: () => void;
};

const DeliveryMessageStep = ({ formData, handleInputChange, handleFileChange, deliveryType, prevStep, nextStep }: Props) => {
  const handleNext = () => {
    // Validação básica antes de avançar
    if (!formData.description || !formData.message) {
      return; // Não avança se campos obrigatórios estão vazios
    }
    
    // Para entregas digitais, ficheiro é opcional
    if (deliveryType === "digital" && !formData.digitalFile) {
      // Ficheiro é opcional, pode avançar
    }
    
    nextStep();
  };

  return (
    <>
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Breve descrição da entrega"
          rows={2}
          required
        />
      </div>
      <div>
        <Label htmlFor="message">Mensagem ou Instruções</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Deixe uma mensagem ou instruções especiais..."
          rows={5}
          required
        />
      </div>
      {deliveryType === "digital" && (
        <div className="mt-4">
          <Label htmlFor="digitalFile">Carregar Ficheiro Digital (opcional)</Label>
          <Input
            id="digitalFile"
            name="digitalFile"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mov,.mp3"
            aria-describedby="file-restriction"
          />
          <p id="file-restriction" className="text-xs text-gray-500 mt-1">
            Tipos permitidos: PDF, DOC, JPG, PNG, MP4, MOV, MP3. Máx: 20MB.
          </p>
          {formData.digitalFile && (
            <p className="text-sm text-gray-700 mt-1">Ficheiro selecionado: {formData.digitalFile.name}</p>
          )}
        </div>
      )}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={prevStep}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Anterior
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!formData.description || !formData.message}
        >
          Próximo
        </Button>
      </div>
    </>
  );
};

export default DeliveryMessageStep;
