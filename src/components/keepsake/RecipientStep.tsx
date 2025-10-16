

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail } from "lucide-react";
import { KeepsakeFormData } from "@/hooks/useKeepsakeForm";
import { UseFormReturn } from "react-hook-form";
import { KeepsakeFormValues } from "@/validations/keepsakeValidationSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface RecipientStepProps {
  formData: KeepsakeFormData;
  updateFormData: (data: Partial<KeepsakeFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  form: UseFormReturn<KeepsakeFormValues>;
}

const RecipientStep = ({ formData, updateFormData, form }: RecipientStepProps) => {
  const EMAIL_PLACEHOLDER = 'email@exemplo.com';

  // Fluxo simplificado: canal fixo email, sem necessidade de alterar canal

  

  // Canal fixo: email

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <User className="h-12 w-12 text-keepla-red mx-auto mb-4" />
        <h2 className="text-2xl font-serif text-steel-blue mb-2">
          Destinatário
        </h2>
        <p className="text-misty-gray">
          Para quem é esta cápsula?
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="recipient_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-steel-blue font-medium">
                  Nome do Destinatário *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome completo"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      updateFormData({ recipient_name: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="relationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-steel-blue font-medium">
                  Relação
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: filha, amigo, irmão"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      updateFormData({ relationship: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Fluxo simplificado: canal de entrega fixo (Email) */}
        <div className="rounded-lg border border-sand-beige p-4 bg-lavender-mist/30">
          <div className="flex items-center gap-2 text-steel-blue">
            <Mail className="h-5 w-5 text-keepla-red" />
            <span className="font-medium">Entrega por Email (Grátis)</span>
          </div>
          <p className="text-sm text-misty-gray mt-1">Usamos email para entregar a tua memória no futuro.</p>
        </div>

        <div>
            <Label htmlFor="recipient_contact" className="text-steel-blue font-medium">
              Email do Destinatário *
            </Label>
            <Input
              id="recipient_contact"
              type="email"
              value={formData.recipient_contact}
              onChange={(e) => updateFormData({ recipient_contact: e.target.value })}
              placeholder={EMAIL_PLACEHOLDER}
              className="mt-1"
              required
              
            />
          </div>

        {false && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="street" className="text-steel-blue font-medium">Morada *</Label>
              <Input
                id="street"
                type="text"
                value={formData.street || ''}
                onChange={(e) => updateFormData({ street: e.target.value })}
                placeholder="Rua e número"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="postal_code" className="text-steel-blue font-medium">Código Postal *</Label>
              <Input
                id="postal_code"
                type="text"
                value={formData.postal_code || ''}
                onChange={(e) => updateFormData({ postal_code: e.target.value })}
                placeholder="0000-000"
                className="mt-1"
                required
                pattern="^\\d{4}-\\d{3}$"
              />
            </div>
            <div>
              <Label htmlFor="city" className="text-steel-blue font-medium">Cidade *</Label>
              <Input
                id="city"
                type="text"
                value={formData.city || ''}
                onChange={(e) => updateFormData({ city: e.target.value })}
                placeholder="Cidade"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="state" className="text-steel-blue font-medium">Distrito</Label>
              <Input
                id="state"
                type="text"
                value={formData.state || ''}
                onChange={(e) => updateFormData({ state: e.target.value })}
                placeholder="Distrito"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="country" className="text-steel-blue font-medium">País</Label>
              <Input
                id="country"
                type="text"
                value={formData.country || 'Portugal'}
                onChange={(e) => updateFormData({ country: e.target.value })}
                placeholder="Portugal"
                className="mt-1"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navegação controlada pela barra inferior de CreateKeepsake */}
    </div>
  );
};

export default RecipientStep;
