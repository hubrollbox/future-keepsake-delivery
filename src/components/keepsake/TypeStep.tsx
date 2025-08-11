import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Package } from "lucide-react";
import { FormField, FormItem, FormControl, Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { KeepsakeFormValues } from "@/validations/keepsakeValidationSchema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TypeStepProps {
  selectedType: 'digital' | 'physical';
  onTypeSelect: (type: 'digital' | 'physical') => void;
  onNext: () => void;
  form: UseFormReturn<KeepsakeFormValues>;
}

const TypeStep = ({ selectedType, onTypeSelect, onNext, form }: TypeStepProps) => {
  const types = [
    {
      value: 'digital' as const,
      title: 'Cápsula Digital',
      description: 'Enviada por email, SMS ou plataforma digital',
      icon: Monitor,
      features: ['Entrega instantânea', 'Ecológica', 'Multimedia']
    },
    {
      value: 'physical' as const,
      title: 'Cápsula Física',
      description: 'Entrega física com produtos tangíveis',
      icon: Package,
      features: ['Produtos físicos', 'Experiência tátil', 'Colecionável']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif text-steel-blue mb-2">
          Tipo de Cápsula
        </h2>
        <p className="text-misty-gray">
          Escolha como deseja entregar sua mensagem no futuro
        </p>
      </div>

      <Form {...form}>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    onTypeSelect(value as 'digital' | 'physical');
                  }}
                  className="grid gap-4"
                >
                  {types.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <FormItem key={type.value} className="flex-1">
                        <FormControl>
                          <RadioGroupItem
                            value={type.value}
                            id={type.value}
                            className="sr-only"
                          />
                        </FormControl>
                        <Card
                          className={`cursor-pointer transition-all hover:shadow-soft ${
                            selectedType === type.value
                              ? 'border-dusty-rose bg-dusty-rose/5'
                              : 'border-sand-beige hover:border-dusty-rose/50'
                          }`}
                          onClick={() => {
                            field.onChange(type.value);
                            onTypeSelect(type.value);
                          }}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <IconComponent className="h-8 w-8 text-dusty-rose flex-shrink-0 mt-1" />
                              <div className="flex-1">
                                <h3 className="font-serif text-lg text-steel-blue mb-2">
                                  {type.title}
                                </h3>
                                <p className="text-misty-gray mb-3">
                                  {type.description}
                                </p>
                                <ul className="space-y-1">
                                  {type.features.map((feature, index) => (
                                    <li key={index} className="text-sm text-steel-blue flex items-center">
                                      <span className="w-1.5 h-1.5 bg-dusty-rose rounded-full mr-2" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </FormItem>
                    );
                  })}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </Form>

      <div className="flex justify-center pt-6">
        <Button 
          onClick={async () => {
            const isValid = await form.trigger('type');
            if (isValid) onNext();
          }}
          disabled={!selectedType || form.formState.isSubmitting}
          className="bg-dusty-rose hover:bg-dusty-rose/90 text-white px-8"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default TypeStep;