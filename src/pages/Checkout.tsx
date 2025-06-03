
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, CreditCard, MapPin, User } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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

  const handleInputChange = (section: 'shipping' | 'contact', field: string, value: string) => {
    if (section === 'shipping') {
      setShippingInfo(prev => ({ ...prev, [field]: value }));
    } else {
      setContactInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const orderData = {
        user_id: user.id,
        total_amount: getTotalPrice(),
        status: 'pending',
        shipping_address: shippingInfo,
        contact_info: contactInfo,
        items: JSON.stringify(cartItems),
      };

      const { data, error } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;

      await clearCart();
      
      toast({
        title: "Pedido criado com sucesso!",
        description: `O seu pedido #${data.id.slice(0, 8)} foi registado. Entraremos em contacto em breve.`,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar o pedido. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Carrinho vazio</h2>
              <p className="text-gray-600 mb-4">Adicione produtos ao carrinho antes de finalizar a compra.</p>
              <Button onClick={() => navigate("/products")}>
                Ver Produtos
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-amber-900 mb-8 text-center">Finalizar Compra</h1>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Informações de Contacto</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notas (opcional)</Label>
                    <Textarea
                      id="notes"
                      value={contactInfo.notes}
                      onChange={(e) => handleInputChange('contact', 'notes', e.target.value)}
                      placeholder="Instruções especiais para entrega..."
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Endereço de Entrega</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={shippingInfo.name}
                      onChange={(e) => handleInputChange('shipping', 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Código Postal</Label>
                      <Input
                        id="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={(e) => handleInputChange('shipping', 'postalCode', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Resumo do Pedido</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <h4 className="font-medium">{item.product_title}</h4>
                          <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                        </div>
                        <p className="font-medium">€{(item.product_price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-gold">€{getTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full bg-gold-gradient text-black hover:opacity-90"
                        disabled={loading}
                      >
                        {loading ? "A processar..." : "Confirmar Pedido"}
                      </Button>
                      <p className="text-xs text-gray-600 mt-2 text-center">
                        Entraremos em contacto para confirmar o pagamento e entrega.
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
