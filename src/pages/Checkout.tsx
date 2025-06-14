import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, CreditCard, MapPin, User, AlertTriangle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const [contactInfo, setContactInfo] = useState({
    email: user?.email || "",
    notes: "",
  });

  // Máscaras de entrada
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

    if (!shippingInfo.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    if (!shippingInfo.address.trim()) {
      newErrors.address = "Endereço é obrigatório";
    }
    if (!shippingInfo.city.trim()) {
      newErrors.city = "Cidade é obrigatória";
    }
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
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    let formattedValue = value;
    
    // Apply masks
    if (field === 'phone') {
      formattedValue = formatPhone(value);
    } else if (field === 'postalCode') {
      formattedValue = formatPostalCode(value);
    }

    if (section === 'shipping') {
      setShippingInfo(prev => ({ ...prev, [field]: formattedValue }));
    } else {
      setContactInfo(prev => ({ ...prev, [field]: formattedValue }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Precisa estar autenticado para finalizar a compra.",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Temporarily store order data in console until orders table is created
      const orderData = {
        user_id: user.id,
        total_amount: getTotalPrice(),
        status: 'pending' as const,
        shipping_address: shippingInfo,
        contact_info: contactInfo,
        items: items.map(item => ({
          product_id: item.product_id,
          product_title: item.product_title,
          product_price: item.product_price,
          quantity: item.quantity
        })),
      };

      console.log("Order would be created:", orderData);

      await clearCart();
      
      toast({
        title: "Pedido registado com sucesso! 🎉",
        description: "O seu pedido foi registado. Entraremos em contacto em breve.",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating order:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast({
        title: "Erro ao processar pedido",
        description: errorMessage + " Por favor, tente novamente ou contacte o suporte.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-warm-gradient">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto emotion-card">
            <CardContent className="p-8 text-center">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2 font-serif">Carrinho vazio</h2>
              <p className="text-emotional mb-6">Adicione produtos ao carrinho antes de finalizar a compra.</p>
              <Button onClick={() => navigate("/products")} className="btn-primary">
                Ver Presentes com Alma
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-gradient">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gentle-black mb-4 font-serif">Finalizar Compra</h1>
            <p className="text-emotional">Quase lá! Complete os seus dados para receber os seus presentes com alma.</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <Card className="emotion-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-gentle-black font-serif">
                    <User className="h-5 w-5 text-gold" />
                    <span>Informações de Contacto</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-gentle-black font-medium">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                      className={`mt-2 rounded-xl ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                      placeholder="seu@email.com"
                      required
                    />
                    {errors.email && (
                      <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{errors.email}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-gentle-black font-medium">Notas especiais (opcional)</Label>
                    <Textarea
                      id="notes"
                      value={contactInfo.notes}
                      onChange={(e) => handleInputChange('contact', 'notes', e.target.value)}
                      className="mt-2 rounded-xl border-gray-200"
                      placeholder="Instruções especiais para entrega..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="emotion-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-gentle-black font-serif">
                    <MapPin className="h-5 w-5 text-gold" />
                    <span>Endereço de Entrega</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-gentle-black font-medium">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={shippingInfo.name}
                      onChange={(e) => handleInputChange('shipping', 'name', e.target.value)}
                      className={`mt-2 rounded-xl ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                      placeholder="João Silva"
                      required
                    />
                    {errors.name && (
                      <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{errors.name}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-gentle-black font-medium">Endereço *</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
                      className={`mt-2 rounded-xl ${errors.address ? 'border-red-500' : 'border-gray-200'}`}
                      placeholder="Rua das Flores, 123, 2º Esq."
                      required
                    />
                    {errors.address && (
                      <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{errors.address}</span>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-gentle-black font-medium">Cidade *</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                        className={`mt-2 rounded-xl ${errors.city ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="Lisboa"
                        required
                      />
                      {errors.city && (
                        <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                          <AlertTriangle className="h-4 w-4" />
                          <span>{errors.city}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="postalCode" className="text-gentle-black font-medium">Código Postal *</Label>
                      <Input
                        id="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={(e) => handleInputChange('shipping', 'postalCode', e.target.value)}
                        className={`mt-2 rounded-xl ${errors.postalCode ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="4450-123"
                        maxLength={8}
                        required
                      />
                      {errors.postalCode && (
                        <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                          <AlertTriangle className="h-4 w-4" />
                          <span>{errors.postalCode}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gentle-black font-medium">Telefone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                      className={`mt-2 rounded-xl ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                      placeholder="912 345 678"
                      maxLength={11}
                      required
                    />
                    {errors.phone && (
                      <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{errors.phone}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="emotion-card sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-gentle-black font-serif">
                    <CreditCard className="h-5 w-5 text-gold" />
                    <span>Resumo do Pedido</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                        <div>
                          <h4 className="font-medium text-gentle-black">{item.product_title}</h4>
                          <p className="text-sm text-emotional">Quantidade: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gentle-black">€{(item.product_price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center text-xl font-bold">
                        <span className="text-gentle-black">Total:</span>
                        <span className="text-gold">€{getTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="pt-6 space-y-4">
                      <Button 
                        type="submit" 
                        className="w-full btn-primary text-lg py-6"
                        disabled={loading}
                      >
                        {loading ? "A processar..." : "Confirmar Pedido"}
                      </Button>
                      <p className="text-xs text-emotional text-center leading-relaxed">
                        Entraremos em contacto para confirmar o pagamento e coordenar a entrega. 
                        Os seus dados estão seguros connosco.
                      </p>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
