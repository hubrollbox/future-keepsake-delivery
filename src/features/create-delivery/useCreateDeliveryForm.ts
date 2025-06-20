import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isValidFile } from "./utils";
import { validateStep } from "./validation";
import { useDeliveryFormState } from "./useDeliveryFormState";
import { useAuth } from "@/hooks/useAuth"; // <-- Adiciona o hook de auth
import { onDeliveryCreated } from "@/features/create-delivery/onDeliveryCreated";

interface DeliveryData {
  title: string;
  recipient_name: string; // <-- Adicionada propriedade recipient_name
  recipient_email: string;
  deliveryDate: string;
  deliveryTime: string;
  delivery_method: "email" | "physical";
  location?: string;
  message?: string;
  digitalFileUrl?: string;
  user_id: string;
  description?: string;
  type: "digital" | "physical";
  payment_status: "pending" | "completed" | "failed"; // novo campo
}

export const useCreateDeliveryForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth(); // <-- Obtém o utilizador autenticado
  const {
    deliveryType,
    setDeliveryType,
    currentStep,
    setCurrentStep,
    loading,
    setLoading,
    error,
    setError,
    formData,
    setFormData,
  } = useDeliveryFormState();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const { valid, error } = isValidFile(file);
      if (!valid) {
        toast({ title: "Tipo de ficheiro não permitido", description: error });
        return;
      }
      setFormData({
        ...formData,
        digitalFile: file,
      });
    } else {
      setFormData({
        ...formData,
        digitalFile: null,
      });
    }
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const nextStep = () => {
    if (validateStep(currentStep, deliveryType, formData, toast)) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, 4));
    } else {
      toast({
        title: "Erro de Validação",
        description: "Por favor, preenche todos os campos obrigatórios.",
      });
    }
  };

  const validateDeliveryData = (data: DeliveryData): boolean => {
    if (!data.title || !data.recipient_name || !data.recipient_email || !data.deliveryDate || !data.deliveryTime) {
      toast({
        title: "Erro de Validação",
        description: "Campos obrigatórios estão faltando. Por favor, preencha todos os campos necessários.",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 3) {
      setLoading(true);
      setError("");

      const uploadFile = async (file: File) => {
        const { data, error } = await supabase.storage
          .from("digital-files")
          .upload(`${Date.now()}-${file.name}`, file);
        if (error) {
          throw new Error(`Erro ao fazer upload do ficheiro digital: ${error.message}`);
        }
        return data.path;
      };

      const insertDelivery = async (dataToInsert: DeliveryData) => {
        const { error } = await supabase.from("deliveries").insert([dataToInsert]);
        if (error) {
          console.error("Erro ao criar entrega (insert):", error, dataToInsert);
          throw new Error(`Erro ao criar entrega: ${error.message}`);
        }
      };

      let digitalFileUrl = null;
      try {
        if (deliveryType === "digital" && formData.digitalFile) {
          digitalFileUrl = await uploadFile(formData.digitalFile);
        }

        if (!user) {
          throw new Error("Utilizador não autenticado. Faça login para continuar.");
        }

        const dataToInsert: DeliveryData = {
          user_id: user.id,
          title: formData.title,
          recipient_name: formData.recipient,
          recipient_email: formData.recipient_email,
          deliveryDate: formData.deliveryDate,
          deliveryTime: formData.deliveryTime,
          message: formData.message,
          description: formData.description,
          delivery_method: formData.delivery_method === "email" || formData.delivery_method === "physical" ? formData.delivery_method : "email",
          type: deliveryType === "digital" || deliveryType === "physical" ? deliveryType : "digital",
          location: formData.location,
          digitalFileUrl: digitalFileUrl,
          payment_status: "pending",
        };

        if (!validateDeliveryData(dataToInsert)) {
          setLoading(false);
          return;
        }

        await insertDelivery(dataToInsert);

        await supabase.from("scheduled_notifications").insert([
          {
            user_email: user.email!,
            recipient_email: formData.recipient_email,
            delivery_date: formData.deliveryDate,
            message: formData.message,
            status: "pending"
          }
        ]);

        onDeliveryCreated({
          id: `${Date.now()}`,
          userEmail: user.email!,
          recipientEmail: formData.recipient_email,
          deliveryDate: formData.deliveryDate,
          message: formData.message,
        });

        toast({ title: "Sucesso", description: "Entrega criada com sucesso!" });
        setCurrentStep(4);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
        setError(errorMessage);
        let toastMessage = errorMessage;
        if (errorMessage.includes("new row violates row-level security policy")) {
          toastMessage = "Permissão negada: faça login novamente ou contacte o suporte.";
        } else if (errorMessage.includes("email_valido")) {
          toastMessage = "O email do destinatário é inválido.";
        } else if (errorMessage.includes("data_futura")) {
          toastMessage = "A data de entrega deve ser hoje ou no futuro.";
        }
        toast({ title: "Erro ao criar entrega", description: toastMessage });
      }
      setLoading(false);
    }
  };

  return {
    deliveryType,
    setDeliveryType,
    currentStep,
    setCurrentStep,
    loading,
    error,
    formData,
    handleInputChange,
    handleFileChange,
    nextStep,
    prevStep,
    handleSubmit,
  };
};
