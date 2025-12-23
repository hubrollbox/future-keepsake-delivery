
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isValidFile } from "./utils";
import { validateStep } from "./validation";
import { useDeliveryFormState } from "./useDeliveryFormState";
import { useAuth } from "@/hooks/useAuth";
import { onDeliveryCreated } from "@/features/create-delivery/onDeliveryCreated";

interface DeliveryInsertData {
  title: string;
  recipient_name: string;
  recipient_email: string;
  delivery_date: string;
  delivery_time: string;
  delivery_method: "email" | "physical";
  location?: string;
  message?: string;
  digital_file_url?: string;
  user_id: string;
  description?: string;
  type: "digital" | "physical";
  payment_status: "pending" | "completed" | "failed";
}

export const useCreateDeliveryForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
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
    setCurrentStep((prevStep: number) => Math.max(prevStep - 1, 0));
  };

  const nextStep = () => {
    if (validateStep(currentStep, deliveryType, formData, toast)) {
      setCurrentStep((prevStep: number) => Math.min(prevStep + 1, 4));
    } else {
      toast({
        title: "Erro de Validação",
        description: "Por favor, preenche todos os campos obrigatórios.",
      });
    }
  };

  const validateDeliveryData = (data: DeliveryInsertData): boolean => {
    if (!data.title || !data.recipient_name || !data.recipient_email || !data.delivery_date || !data.delivery_time || !data.message) {
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
    console.log("Submit acionado. Passo atual:", currentStep);
    
    if (currentStep === 3) {
      console.log("Iniciando processo de criação da entrega...");
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

      const insertDelivery = async (dataToInsert: DeliveryInsertData) => {
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

        const dataToInsert: DeliveryInsertData = {
          user_id: user.id,
          title: formData.title,
          recipient_name: formData.recipient,
          recipient_email: formData.recipient_email,
          delivery_date: formData.deliveryDate,
          delivery_time: formData.deliveryTime,
          message: formData.message || " ",
          description: formData.description,
          delivery_method: formData.delivery_method === "email" || formData.delivery_method === "physical" ? formData.delivery_method : "email",
          type: deliveryType === "digital" || deliveryType === "physical" ? deliveryType : "digital",
          location: formData.location,
          digital_file_url: digitalFileUrl || "",
          payment_status: "pending",
        };

        console.log("Dados para inserir:", dataToInsert);

        if (!validateDeliveryData(dataToInsert)) {
          console.warn("Falha na validação final dos dados");
          setLoading(false);
          return;
        }

        await insertDelivery(dataToInsert);

        // Note: scheduled_notifications now uses keepsake_id and recipient_id
        // This insert may need to be updated based on the actual delivery/keepsake creation flow
        // For now, commenting out to avoid schema mismatch
        // await supabase.from("scheduled_notifications").insert([
        //   {
        //     user_email: user.email!,
        //     recipient_id: recipientId, // Would need recipient_id from recipients table
        //     delivery_date: formData.deliveryDate,
        //     keepsake_id: keepsakeId, // Would need keepsake_id from keepsakes table
        //     status: "pending"
        //   }
        // ]);

        onDeliveryCreated({
          id: `${Date.now()}`,
          userEmail: user.email || '',
          recipientEmail: formData.recipient_email,
          deliveryDate: formData.deliveryDate,
          message: formData.message,
        });

        toast({ title: "Sucesso", description: "Entrega criada com sucesso!" });
        setCurrentStep(4);
      } catch (err: unknown) {
        console.error("Erro no processo de submit:", err);
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
