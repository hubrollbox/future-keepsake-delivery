import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, User, Plus, AlertCircle, Mail } from "lucide-react";

interface Recipient {
  id: string;
  name: string;
  email: string;
  relationship?: string;
}

interface RecipientInputProps {
  recipients: Recipient[];
  onRecipientsChange: (recipients: Recipient[]) => void;
  maxRecipients?: number;
  placeholder?: string;
}

const RecipientInput: React.FC<RecipientInputProps> = ({
  recipients,
  onRecipientsChange,
  maxRecipients = 10,
  placeholder = "Digite o email do destinatário...",
}) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const addRecipient = () => {
    const trimmedEmail = email.trim();
    const trimmedName = (name || trimmedEmail.split("@")[0]).trim();

    const newErrors: string[] = [];
    if (!trimmedEmail) newErrors.push("Email é obrigatório");
    if (trimmedEmail && !isValidEmail(trimmedEmail)) newErrors.push("Email inválido");
    if (recipients.some((r) => r.email.toLowerCase() === trimmedEmail.toLowerCase()))
      newErrors.push("Este email já foi adicionado");
    if (recipients.length >= maxRecipients)
      newErrors.push(`Máximo de ${maxRecipients} destinatários permitido`);

    setErrors(newErrors);
    if (newErrors.length > 0) return;

    const newRecipient: Recipient = {
      id: crypto?.randomUUID?.() || Date.now().toString(),
      name: trimmedName,
      email: trimmedEmail,
    };

    onRecipientsChange([...recipients, newRecipient]);
    setEmail("");
    setName("");

    // Focus de volta no input de email
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const removeRecipient = (id: string) => {
    onRecipientsChange(recipients.filter((r) => r.id !== id));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addRecipient();
    }
  };

  useEffect(() => {
    // Foca o input ao montar
    inputRef.current?.focus();
  }, []);

  return (
    <div className="space-y-4">
      {/* Lista de Destinatários */}
      {recipients.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-steel-blue">Destinatários ({recipients.length})</h4>
          <div className="flex flex-wrap gap-2">
            {recipients.map((recipient) => (
              <Badge
                key={recipient.id}
                variant="secondary"
                className="px-3 py-1 bg-gradient-to-r from-dusty-rose/10 to-earthy-burgundy/10 border border-dusty-rose/20 text-steel-blue"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-dusty-rose/20">
                    <User className="w-3 h-3 text-dusty-rose" />
                  </span>
                  <span className="font-medium">{recipient.name}</span>
                  <span className="text-misty-gray text-xs">{`<${recipient.email}>`}</span>
                  <button
                    type="button"
                    onClick={() => removeRecipient(recipient.id)}
                    className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded hover:bg-dusty-rose/20 focus:outline-none"
                    aria-label={`Remover ${recipient.email}`}
                    title="Remover"
                  >
                    <X className="w-3 h-3 text-steel-blue" />
                  </button>
                </span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Formulário de Adição */}
      <div className="space-y-2">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex items-center gap-2">
            <User className="w-4 h-4 text-dusty-rose" />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome (opcional)"
              onKeyDown={onKeyDown}
            />
          </div>
          <div className="flex-[2] flex items-center gap-2">
            <Mail className="w-4 h-4 text-dusty-rose" />
            <Input
              ref={inputRef}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              inputMode="email"
              onKeyDown={onKeyDown}
            />
          </div>
          <Button type="button" onClick={addRecipient} className="bg-dusty-rose hover:bg-dusty-rose/90 inline-flex items-center gap-1">
            <Plus className="w-4 h-4" /> Adicionar
          </Button>
        </div>

        {errors.length > 0 && (
          <div className="text-sm text-earthy-burgundy flex flex-col gap-1">
            {errors.map((err, i) => (
              <div key={i} className="inline-flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                <span>{err}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientInput;
