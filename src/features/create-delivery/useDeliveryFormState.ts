
import { useState } from "react";

export type FormDataType = {
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
};

export function useDeliveryFormState() {
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
    digitalFile: null, // Garante sempre começar como null!
  });

  return {
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
  };
}
