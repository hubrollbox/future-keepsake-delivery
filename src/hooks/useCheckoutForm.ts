import { useState } from "react";

export function useCheckoutForm(userEmail: string) {
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [contactInfo, setContactInfo] = useState({
    email: userEmail || "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 9) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    return numbers.slice(0, 9).replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  const formatPostalCode = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 7) {
      return numbers.replace(/(\d{4})(\d{3})/, '$1-$2');
    }
    return numbers.slice(0, 7).replace(/(\d{4})(\d{3})/, '$1-$2');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!shippingInfo.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!shippingInfo.address.trim()) newErrors.address = "Endereço é obrigatório";
    if (!shippingInfo.city.trim()) newErrors.city = "Cidade é obrigatória";
    if (!shippingInfo.postalCode.trim()) {
      newErrors.postalCode = "Código postal é obrigatório";
    } else if (!/^\d{4}-\d{3}$/.test(shippingInfo.postalCode)) {
      newErrors.postalCode = "Formato inválido (ex: 4450-123)";
    }
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    } else if (!/^\d{3} \d{3} \d{3}$/.test(shippingInfo.phone)) {
      newErrors.phone = "Formato inválido (ex: 912 345 678)";
    }
    if (!contactInfo.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      newErrors.email = "Email inválido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (section: 'shipping' | 'contact', field: string, value: string) => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    let formattedValue = value;
    if (field === 'phone') formattedValue = formatPhone(value);
    else if (field === 'postalCode') formattedValue = formatPostalCode(value);
    if (section === 'shipping') setShippingInfo(prev => ({ ...prev, [field]: formattedValue }));
    else setContactInfo(prev => ({ ...prev, [field]: formattedValue }));
  };

  return {
    shippingInfo,
    setShippingInfo,
    contactInfo,
    setContactInfo,
    errors,
    setErrors,
    formatPhone,
    formatPostalCode,
    validateForm,
    handleInputChange,
  };
}