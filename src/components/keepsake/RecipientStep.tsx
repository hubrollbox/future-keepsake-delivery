
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, MessageCircle, MapPin } from "lucide-react";
import { KeepsakeFormData } from "@/hooks/useKeepsakeForm";

interface RecipientStepProps {
  formData: KeepsakeFormData;
  updateFormData: (data: Partial<KeepsakeFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const RecipientStep = ({ formData, updateFormData, nextStep, prevStep }: RecipientStepProps) => {
  const deliveryChannels = [
    {
      value: 'email' as const,
      label: 'Email',
      icon: Mail,
      cost: 0,
      description: 'Entrega gratuita por email',
      placeholder: 'email@exemplo.com'
    },
    {
      value: 'sms' as const,
      label: 'SMS',
      icon: MessageCircle,
      cost: 0.20,
      description: 'Mensagem de texto',
      placeholder: '+351 912 345 678'
    },
    {
      value: 'physical' as const,
      label: 'Morada Física',
      icon: MapPin,
      cost: 2.00,
      description: 'Entrega física em Portugal',
      placeholder: 'Rua, número, código postal, cidade'
    }
  ];

  const handleChannelChange = (channel: 'email' | 'sms' | 'physical') => {
    const selectedChannel = deliveryChannels.find(c => c.value === channel);
    updateFormData({
      delivery_channel: channel,
      channel_cost: selectedChannel?.cost || 0,
      recipient_contact: ''
    });
  };

  const handleNext = () => {
    if (formData.recipient_name && formData.recipient_contact) {
      nextStep();
    }
  };

  const selectedChannel = deliveryChannels.find(c => c.value === formData.delivery_channel);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <User className="h-12 w-12 text-dusty-rose mx-auto mb-4" />
        <h2 className="text-2xl font-serif text-steel-blue mb-2">
          Destinatário
        </h2>
        <p className="text-misty-gray">
          Para quem é esta cápsula?
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="recipient_name" className="text-steel-blue font-medium">
              Nome do Destinatário *
            </Label>
            <Input
              id="recipient_name"
              type="text"
              value={formData.recipient_name}
              onChange={(e) => updateFormData({ recipient_name: e.target.value })}
              placeholder="Nome completo"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="relationship" className="text-steel-blue font-medium">
              Relação
            </Label>
            <Input
              id="relationship"
              type="text"
              value={formData.relationship}
              onChange={(e) => updateFormData({ relationship: e.target.value })}
              placeholder="Ex: filha, amigo, irmão"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label className="text-steel-blue font-medium mb-4 block">
            Canal de Entrega *
          </Label>
          <RadioGroup
            value={formData.delivery_channel}
            onValueChange={handleChannelChange}
            className="space-y-3"
          >
            {deliveryChannels.map((channel) => {
              const IconComponent = channel.icon;
              return (
                <Card
                  key={channel.value}
                  className={`cursor-pointer transition-all hover:shadow-soft ${
                    formData.delivery_channel === channel.value
                      ? 'border-dusty-rose bg-dusty-rose/5'
                      : 'border-sand-beige hover:border-dusty-rose/50'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={channel.value} id={channel.value} />
                      <IconComponent className="h-5 w-5 text-dusty-rose" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor={channel.value}
                            className="font-medium text-steel-blue cursor-pointer"
                          >
                            {channel.label}
                          </Label>
                          <span className="font-semibold text-steel-blue">
                            {channel.cost === 0 ? 'Grátis' : `${channel.cost.toFixed(2)} €`}
                          </span>
                        </div>
                        <p className="text-sm text-misty-gray mt-1">
                          {channel.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </RadioGroup>
        </div>

        {selectedChannel && (
          <div>
            <Label htmlFor="recipient_contact" className="text-steel-blue font-medium">
              {selectedChannel.label} do Destinatário *
            </Label>
            <Input
              id="recipient_contact"
              type={selectedChannel.value === 'email' ? 'email' : 'text'}
              value={formData.recipient_contact}
              onChange={(e) => updateFormData({ recipient_contact: e.target.value })}
              placeholder={selectedChannel.placeholder}
              className="mt-1"
            />
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={prevStep}>
          Voltar
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!formData.recipient_name || !formData.recipient_contact}
          className="bg-dusty-rose hover:bg-dusty-rose/90 text-white px-8"
        >
          Próximo Passo
        </Button>
      </div>
    </div>
  );
};

export default RecipientStep;
