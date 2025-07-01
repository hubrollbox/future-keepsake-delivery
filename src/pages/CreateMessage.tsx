
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createMessageSchema, sanitizeInput, isRateLimited } from "@/lib/validation";
import { Loader2, Mail, Calendar, User, MessageSquare } from "lucide-react";

const CreateMessage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    delivery_date: '',
    recipient_name: '',
    recipient_email: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    // Sanitize input to prevent XSS
    const sanitizedValue = sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    try {
      createMessageSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const validationErrors: Record<string, string> = {};
      
      if (error.errors) {
        error.errors.forEach((err: any) => {
          validationErrors[err.path[0]] = err.message;
        });
      }
      
      setErrors(validationErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro de Autenticação",
        description: "Precisa de estar autenticado para criar uma mensagem.",
        variant: "destructive"
      });
      return;
    }

    // Rate limiting check
    if (isRateLimited(`create_message_${user.id}`, 3, 60000)) {
      toast({
        title: "Limite Excedido",
        description: "Está a criar mensagens demasiado rapidamente. Tente novamente em alguns minutos.",
        variant: "destructive"
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Ensure delivery date is in the future
      const deliveryDate = new Date(formData.delivery_date);
      const now = new Date();
      
      if (deliveryDate <= now) {
        toast({
          title: "Data Inválida",
          description: "A data de entrega deve ser no futuro.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          title: formData.title,
          content: formData.content,
          delivery_date: deliveryDate.toISOString(),
          status: 'scheduled'
        });

      if (error) throw error;

      toast({
        title: "Mensagem Criada",
        description: "A sua mensagem foi criada com sucesso e será entregue na data especificada.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating message:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar a mensagem.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-lavender-mist p-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="shadow-soft border-dusty-rose/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif text-gentle-black flex items-center justify-center gap-2">
              <MessageSquare className="h-8 w-8 text-dusty-rose" />
              Criar Nova Mensagem
            </CardTitle>
            <p className="text-soft-gray">Crie uma mensagem para ser entregue no futuro</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Título da Mensagem
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Feliz 18º Aniversário!"
                  className={errors.title ? "border-red-500" : ""}
                  maxLength={200}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Conteúdo da Mensagem
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Escreva aqui a sua mensagem..."
                  className={`min-h-32 ${errors.content ? "border-red-500" : ""}`}
                  maxLength={5000}
                />
                {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
                <p className="text-sm text-gray-500">{formData.content.length}/5000 caracteres</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery_date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data de Entrega
                </Label>
                <Input
                  id="delivery_date"
                  type="date"
                  value={formData.delivery_date}
                  onChange={(e) => handleInputChange('delivery_date', e.target.value)}
                  min={getTomorrowDate()}
                  className={errors.delivery_date ? "border-red-500" : ""}
                />
                {errors.delivery_date && <p className="text-red-500 text-sm">{errors.delivery_date}</p>}
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="default"
                  className="flex-1 bg-dusty-rose hover:bg-dusty-rose/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      A Criar...
                    </>
                  ) : (
                    'Criar Mensagem'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateMessage;
