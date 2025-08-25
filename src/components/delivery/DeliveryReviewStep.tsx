
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import { DeliveryFormData } from "./DeliveryFormStepper";

type Props = {
  formData: DeliveryFormData;
  deliveryType: string;
  prevStep: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
};

const DeliveryReviewStep = ({
  formData,
  deliveryType,
  prevStep,
  onSubmit,
  loading,
  error
}: Props) => (
  <>
    <h2 className="text-xl font-semibold mb-4">Rever Detalhes da Entrega</h2>
    <div className="space-y-2">
      <p><strong>Tipo de Entrega:</strong> {deliveryType === "digital" ? "Digital" : "Físico"}</p>
      <p><strong>Título:</strong> {formData.title}</p>
      <p><strong>Destinatário:</strong> {formData.recipient}</p>
      <p><strong>Email do destinatário:</strong> {formData.recipient_email}</p>
      <p><strong>Data de Entrega:</strong> {formData.deliveryDate}</p>
      <p><strong>Hora de Entrega:</strong> {formData.deliveryTime}</p>
      <p><strong>Método de entrega:</strong> {formData.delivery_method}</p>
      {deliveryType === "physical" && <p><strong>Local de Entrega:</strong> {formData.location}</p>}
      <p><strong>Mensagem:</strong> {formData.message}</p>
      <p><strong>Descrição:</strong> {formData.description}</p>
      {formData.digitalFile && <p><strong>Ficheiro Digital:</strong> {formData.digitalFile.name}</p>}
    </div>
    <div className="flex justify-between mt-6">
      <Button variant="outline" onClick={prevStep}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Anterior
      </Button>
      <Button onClick={onSubmit} disabled={loading}>
        {loading ? "A Enviar..." : "Confirmar e Criar Entrega"}
      </Button>
    </div>
    {error && <p className="text-red-500 mt-2">{error}</p>}
  </>
);

export default DeliveryReviewStep;
