
import { isValidFile, isValidFutureDate, validateEmail } from "./utils";
import { useToast } from "@/hooks/use-toast";

export type DeliveryStepValidator = (
  currentStep: number,
  deliveryType: string,
  formData: any,
  toast: ReturnType<typeof useToast>["toast"]
) => boolean;

export const validateStep: DeliveryStepValidator = (
  currentStep,
  deliveryType,
  formData,
  toast
) => {
  switch (currentStep) {
    case 0:
      return !!deliveryType;
    case 1:
      if (
        !formData.title ||
        !formData.recipient ||
        !formData.recipient_email ||
        !formData.deliveryDate ||
        !formData.deliveryTime ||
        !formData.delivery_method
      ) {
        toast({
          title: "Erro de Validação",
          description:
            "Preencha todos os campos obrigatórios do passo Detalhes: Título, Destinatário, Email, Data, Hora e Método de entrega.",
        });
        return false;
      }
      if (deliveryType === "physical" && !formData.location) {
        toast({
          title: "Erro de Validação",
          description:
            "Preencha o campo de Local de Entrega para entregas físicas.",
        });
        return false;
      }
      if (!validateEmail(formData.recipient_email)) {
        toast({
          title: "Erro de Validação",
          description: "O email do destinatário é inválido.",
        });
        return false;
      }
      if (!isValidFutureDate(formData.deliveryDate, formData.deliveryTime)) {
        toast({
          title: "Erro de Validação",
          description: "A data e hora de entrega devem ser no futuro.",
        });
        return false;
      }
      if (deliveryType === "digital" && !formData.digitalFile) {
        toast({
          title: "Erro de Validação",
          description: "Por favor, selecione um ficheiro digital para a entrega.",
        });
        return false;
      }
      if (deliveryType === "digital" && formData.digitalFile) {
        const { valid, error: errMsg } = isValidFile(formData.digitalFile);
        if (!valid) {
          toast({ title: "Tipo de ficheiro não permitido", description: errMsg });
          return false;
        }
      }
      return true;
    case 2:
      if (!formData.message || !formData.description) {
        toast({
          title: "Erro de Validação",
          description: "Por favor, preencha os campos de Mensagem e Descrição.",
        });
        return false;
      }
      return true;
    case 3:
    case 4:
      return true;
    default:
      return false;
  }
};
