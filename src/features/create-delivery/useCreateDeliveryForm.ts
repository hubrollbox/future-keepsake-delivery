
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isValidFile, isValidFutureDate, validateEmail } from "./utils";

type FormDataType = {
  title: string;
  recipient: string;
  recipient_email: string;
  deliveryDate: string;
  deliveryTime: string;
  location: string;
  message: string;
  description: string;
  delivery_method: string;
  digitalFile: File | null;
}

export const useCreateDeliveryForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deliveryType, setDeliveryType] = useState("digital");
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    recipient: "",
    recipient_email: "",
    deliveryDate: "",
    deliveryTime: "",
    location: "",
    message: "",
    description: "",
    delivery_method: "email",
    digitalFile: null,
  });

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
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        return !!deliveryType;
      case 1:
        // Atualizar lógica para não obrigar campos que não aparecem conforme o tipo de entrega
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

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const nextStep = () => {
    if (validateStep()) {
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
          throw new Error(`Erro ao criar entrega: ${error.message}`);
        }
      };

      let digitalFileUrl = null;
      try {
        if (deliveryType === "digital" && formData.digitalFile) {
          digitalFileUrl = await uploadFile(formData.digitalFile);
        }

        const dataToInsert = {
          title: formData.title,
          recipient: formData.recipient,
          recipient_email: formData.recipient_email,
          delivery_date: formData.deliveryDate,
          delivery_time: formData.deliveryTime,
          message: formData.message,
          description: formData.description,
          delivery_method: formData.delivery_method,
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
