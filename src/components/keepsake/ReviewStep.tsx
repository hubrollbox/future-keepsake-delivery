

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Mail, Gift } from "lucide-react";
import { KeepsakeFormData } from "@/hooks/useKeepsakeForm";
import { BASE_PRICE_EUR } from "@/lib/simplePricing";

interface ReviewStepProps {
  formData: KeepsakeFormData;
  onBack: () => void;
  onSubmit: () => Promise<void> | void;
  loading: boolean;
}

const ReviewStep = ({ formData }: ReviewStepProps) => {
  const getChannelIcon = () => Mail;

  const getChannelLabel = () => 'Email';

  const ChannelIcon = getChannelIcon();
  

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Gift className="h-12 w-12 text-dusty-rose mx-auto mb-4" />
        <h2 className="text-2xl font-serif text-steel-blue mb-2">
          Revisão Final
        </h2>
        <p className="text-misty-gray">
          Confirma os detalhes da tua cápsula antes de selar
        </p>
      </div>

      <div className="space-y-4">
        {/* Mensagem */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-dusty-rose" />
              Mensagem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-steel-blue">Título:</span>
                <p className="text-misty-gray">{formData.title}</p>
              </div>
              <div>
                <span className="font-medium text-steel-blue">Conteúdo:</span>
                <p className="text-misty-gray text-sm bg-lavender-mist/50 p-3 rounded-lg mt-1">
                  {formData.message}
                </p>
              </div>
              <div>
                <span className="font-medium text-steel-blue">Data de Entrega:</span>
                <p className="text-misty-gray">
                  {new Date(formData.delivery_date).toLocaleDateString('pt-PT', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Destinatário */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-dusty-rose" />
              Destinatário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-steel-blue">{formData.recipient_name}</p>
                {formData.relationship && (
                  <p className="text-sm text-misty-gray">{formData.relationship}</p>
                )}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <ChannelIcon className="h-4 w-4 text-dusty-rose" />
                  <span className="text-sm text-steel-blue">{getChannelLabel()}</span>
                </div>
                <p className="text-sm text-misty-gray">{formData.recipient_contact}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Produtos Selecionados */}
        {formData.selected_products.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Gift className="h-5 w-5 text-dusty-rose" />
                Extras Selecionados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {formData.selected_products.map((product) => (
                  <div key={product.id} className="flex justify-between items-center">
                    <span className="text-steel-blue">{product.name}</span>
                    <Badge variant="outline">{product.price.toFixed(2)} €</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resumo de Custos */}
        <Card className="bg-sand-beige/30 border-dusty-rose/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-steel-blue">Resumo de Custos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Mensagem digital (preço base):</span>
                <span>{BASE_PRICE_EUR.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Canal de entrega ({getChannelLabel()}):</span>
                <span>{formData.channel_cost === 0 ? 'Grátis' : `${formData.channel_cost.toFixed(2)} €`}</span>
              </div>
              {formData.selected_products.map((product) => (
                <div key={product.id} className="flex justify-between">
                  <span>{product.name}:</span>
                  <span>{product.price.toFixed(2)} €</span>
                </div>
              ))}
              <div className="border-t border-dusty-rose/20 pt-2 mt-2 flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span className="text-dusty-rose">{formData.total_cost.toFixed(2)} €</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navegação controlada pela barra inferior de CreateKeepsake */}
    </div>
  );
};

export default ReviewStep;
