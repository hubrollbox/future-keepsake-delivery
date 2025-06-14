
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isValidFile } from "./utils";
import { validateStep } from "./validation";
import { useDeliveryFormState } from "./useDeliveryFormState";

export const useCreateDeliveryForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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

      const insertDelivery = async (dataToInsert: any) => {
        const { error } = await supabase.from("deliveries").insert([dataToInsert]);
        if (error) {
          // Extra error context for debugging in the future
          console.error("Erro ao criar entrega (insert):", error, dataToInsert);
          throw new Error(`Erro ao criar entrega: ${error.message}`);
        }
      };

      let digitalFileUrl = null;
      try {
        if (deliveryType === "digital" && formData.digitalFile) {
          digitalFileUrl = await uploadFile(formData.digitalFile);
        }

        // O formData usa camelCase, mas a base de dados espera snake_case (delivery_time)
        const dataToInsert = {
          title: formData.title,
          recipient: formData.recipient,
          recipient_email: formData.recipient_email,
          delivery_date: formData.deliveryDate,
          delivery_time: formData.deliveryTime, // garantir correspondência ao campo da base de dados
          message: formData.message,
          description: formData.description,
          delivery_method: formData.delivery_method || "email",
          type: deliveryType,
          location: formData.location,
          digital_file_url: digitalFileUrl,
        };

        await insertDelivery(dataToInsert);

        toast({ title: "Sucesso", description: "Entrega criada com sucesso!" });
        setCurrentStep(4);
      } catch (err: any) {
        setError(err.message);
        toast({ title: "Erro", description: err.message });
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
