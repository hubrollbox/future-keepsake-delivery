import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { TooltipHelp } from "@/components/ui/TooltipHelp";

interface FormData {
  title: string;
  recipient: string;
  recipient_email: string;
  deliveryDate: string;
  deliveryTime: string;
  delivery_method: "email" | "physical";
  location?: string;
}

type Props = {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  deliveryType: string;
  prevStep: () => void;
  nextStep: () => void;
};

const DeliveryDetailsStep = ({ formData, handleInputChange, deliveryType, prevStep, nextStep }: Props) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="title">
          Título da Entrega
          <TooltipHelp text="Dê um nome fácil de identificar para esta entrega.">
            <span className="ml-1 text-blue-500 cursor-help">?</span>
          </TooltipHelp>
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Ex: Presente de aniversário"
          required
        />
      </div>
      <div>
        <Label htmlFor="recipient">
          Destinatário
          <TooltipHelp text="Nome da pessoa que irá receber a keepsake.">
            <span className="ml-1 text-blue-500 cursor-help">?</span>
          </TooltipHelp>
        </Label>
        <Input
          id="recipient"
          name="recipient"
          value={formData.recipient}
          onChange={handleInputChange}
          placeholder="Nome do destinatário"
          required
        />
      </div>
      <div>
        <Label htmlFor="recipient_email">Email do Destinatário</Label>
        <Input
          id="recipient_email"
          name="recipient_email"
          value={formData.recipient_email}
          onChange={handleInputChange}
          placeholder="exemplo@email.com"
          type="email"
          required
        />
      </div>
      <div>
        <Label htmlFor="deliveryDate">Data de Entrega</Label>
        <Input
          id="deliveryDate"
          name="deliveryDate"
          type="date"
          value={formData.deliveryDate}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="deliveryTime">Hora de Entrega (Obrigatória)</Label>
        <Input
          id="deliveryTime"
          name="deliveryTime"
          type="time"
          value={formData.deliveryTime}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="delivery_method">Método de Entrega</Label>
        <select
          id="delivery_method"
          name="delivery_method"
          className="w-full border rounded-xl px-4 py-3"
          value={formData.delivery_method}
          onChange={handleInputChange}
          required
        >
          <option value="email">E-mail</option>
          <option value="physical">Físico</option>
        </select>
      </div>
    </div>
    {deliveryType === "physical" && (
      <div>
        <Label htmlFor="location">Local de Entrega</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Ex: Rua da Felicidade, 123"
          required
        />
      </div>
    )}
    <div className="flex justify-between mt-6">
      <Button variant="outline" onClick={prevStep}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Anterior
      </Button>
      <Button onClick={nextStep}>Próximo</Button>
    </div>
  </>
);

export default DeliveryDetailsStep;
