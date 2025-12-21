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
import { generatePaymentLink } from "@/lib/paymentLink";
import { calculatePricing, validatePricingConfiguration } from "@/lib/adminPricingData";

const Checkout = () => {
  const { items, getTotalPrice, clearCart, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  // Simple form state management
  const [shippingInfo, setShippingInfo] = useState({ name: '', address: '', city: '', postalCode: '', phone: '' });
  const [contactInfo, setContactInfo] = useState({ email: user?.email || '', notes: '' });
  const [errors] = useState<Record<string, string>>({});
  
  const validateForm = () => true;
  const handleInputChange = (section: string, field: string, value: string) => {
    if (section === 'shipping') {
      setShippingInfo(prev => ({ ...prev, [field]: value }));
    } else if (section === 'contact') {
      setContactInfo(prev => ({ ...prev, [field]: value }));
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

    // Bloquear submissão se o carrinho estiver vazio
    if (items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de confirmar o pedido.",
        variant: "destructive",
      });
      navigate("/products");
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
      // Calcular preços com margens automáticas
      const pricingCalculations = items.map(item => {
        const calculation = calculatePricing(item.product_id || 'default');
        
        return {
          ...item,
          calculatedPrice: (calculation as any).finalPrice || item.product_price,
          margin: (calculation as any).margin || 0,
          cost: (calculation as any).cost || 0,
          discount: (calculation as any).discount || 0
        };
      });

      // Validar configuração de preços
      const isValidPricing = (items[0]?.product_id && validatePricingConfiguration) || true;
      if (!isValidPricing) {
        throw new Error('Configuração de preços inválida');
      }

      const totalCalculatedPrice = pricingCalculations.reduce(
        (sum, item) => sum + (item.calculatedPrice || 0), 
        0
      );
      const totalMargin = pricingCalculations.reduce(
        (sum, item) => sum + ((item as any).margin || 0), 
        0
      );
      const totalCost = pricingCalculations.reduce(
        (sum, item) => sum + ((item as any).cost || 0), 
        0
      );

      // Temporarily store order data in console until orders table is created
      const orderData = {
        user_id: user.id,
        total_amount: totalCalculatedPrice,
        total_cost: totalCost,
        total_margin: totalMargin,
        status: 'pending' as const,
        shipping_address: shippingInfo,
        contact_info: contactInfo,
        items: pricingCalculations.map(item => ({
          product_id: item.product_id,
          product_title: item.product_title,
          product_price: item.calculatedPrice,
          original_price: item.product_price,
          quantity: item.quantity,
          margin: item.margin,
          cost: (item as any).cost,
          discount: (item as any).discount,
          planId: (item as any).planId,
          serviceIds: (item as any).serviceIds
        })),
      };

      console.log('Order Data with Pricing Calculations:', orderData);

      // Gerar link de pagamento com preço calculado
      const paymentLink = await generatePaymentLink({
        amount: totalCalculatedPrice,
        description: `Pagamento de encomenda para ${user.email}`,
        deliveryId: `${user.id}-${Date.now()}`
      });

      try {
        await clearCart();
      } catch (cartError) {
        console.error("Erro ao limpar o carrinho:", cartError);
        toast({
          title: "Erro ao limpar o carrinho",
          description: cartError instanceof Error ? cartError.message : "Erro desconhecido ao limpar o carrinho.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      toast({
        title: "Pedido registado com sucesso! 🎉",
        description: (
          <span>
            O seu pedido foi registado.<br />
            <a href={paymentLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Clique aqui para pagar</a>.
          </span>
        ),
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
  // Mostrar estado de carregamento do carrinho
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-keepla-white">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto emotion-card">
            <CardContent className="p-8 text-center">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Exibir mensagem quando carrinho estiver vazio (após carregar)
  if (!cartLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-keepla-white">
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
    <div className="min-h-screen bg-keepla-white">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-keepla-gray-dark mb-4 font-serif">Finalizar Compra</h1>
            <p className="text-emotional">Quase lá! Complete os seus dados para receber os seus presentes com alma.</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <Card className="emotion-card">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-gentle-black font-serif">
                    <User className="h-5 w-5 text-keepla-red" />
                    <span>Informações de Contacto</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-keepla-gray-dark font-medium">Email *</Label>
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
                    <Label htmlFor="notes" className="text-keepla-gray-dark font-medium">Notas especiais (opcional)</Label>
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
                    <MapPin className="h-5 w-5 text-keepla-red" />
                    <span>Endereço de Entrega</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-keepla-gray-dark font-medium">Nome Completo *</Label>
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
                    <Label htmlFor="address" className="text-keepla-gray-dark font-medium">Endereço *</Label>
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
                      <Label htmlFor="city" className="text-keepla-gray-dark font-medium">Cidade *</Label>
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
                      <Label htmlFor="postalCode" className="text-keepla-gray-dark font-medium">Código Postal *</Label>
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
                    <Label htmlFor="phone" className="text-keepla-gray-dark font-medium">Telefone *</Label>
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
                    <CreditCard className="h-5 w-5 text-keepla-red" />
                    <span>Resumo do Pedido</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {items.map((item) => {
                      // Calcular preço automático para cada item
                      const calculation = calculatePricing(item.product_id || 'default');
                      
                      const hasDiscount = ((calculation as any).discount || 0) > 0;
                      const originalPrice = item.product_price * item.quantity;
                      const calculatedPrice = (calculation as any).finalPrice || item.product_price;
                      
                      return (
                        <div key={item.id} className="py-3 border-b border-gray-100 last:border-0">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-keepla-gray-dark">{item.product_title}</h4>
                              <p className="text-sm text-emotional">Quantidade: {item.quantity}</p>
                              {(item as any).planId && (
                                <p className="text-xs text-gray-500 mt-1">Plano: {(item as any).planId}</p>
                              )}
                              {hasDiscount && (
                                <p className="text-xs text-green-600 mt-1">
                                  Desconto aplicado: €{((calculation as any).discount || 0).toFixed(2)}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              {hasDiscount && (
                                <p className="text-sm text-gray-400 line-through">
                                  €{originalPrice.toFixed(2)}
                                </p>
                              )}
                              <p className="font-semibold text-keepla-gray-dark">
                                €{calculatedPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    <div className="pt-4 border-t border-gray-200">
                      {(() => {
                        const totalCalculated = items.reduce((sum, item) => {
                          const calculation = calculatePricing(item.product_id || 'default');
                          return sum + ((calculation as any).finalPrice || item.product_price);
                        }, 0);
                        
                        const totalOriginal = getTotalPrice();
                        const totalSavings = totalOriginal - totalCalculated;
                        
                        return (
                          <div className="space-y-2">
                            {totalSavings > 0 && (
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="text-gray-400 line-through">€{totalOriginal.toFixed(2)}</span>
                              </div>
                            )}
                            {totalSavings > 0 && (
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-green-600">Poupança:</span>
                                <span className="text-green-600">-€{totalSavings.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center text-xl font-bold">
                              <span className="text-keepla-gray-dark">Total:</span>
                              <span className="text-keepla-red">€{totalCalculated.toFixed(2)}</span>
                            </div>
                          </div>
                        );
                      })()}
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
