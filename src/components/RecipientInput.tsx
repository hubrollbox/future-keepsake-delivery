import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Mail, 
  User, 
  Plus, 
  Check,
  AlertCircle,
  Heart
} from 'lucide-react';

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
  placeholder = "Digite o email do destinatário..."
}) => {
  const [inputValue, setInputValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [isAddingRecipient, setIsAddingRecipient] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [focusedChip, setFocusedChip] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Validação de email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Adicionar destinatário
  const addRecipient = () => {
    const email = inputValue.trim();
    const name = nameValue.trim() || email.split('@')[0];
    
    // Validações
    const newErrors: string[] = [];
    
    if (!email) {
      newErrors.push('Email é obrigatório');
    } else if (!isValidEmail(email)) {
      newErrors.push('Email inválido');
    } else if (recipients.some(r => r.email === email)) {
      newErrors.push('Este email já foi adicionado');
    }
    
    if (recipients.length >= maxRecipients) {
      newErrors.push(`Máximo de ${maxRecipients} destinatários permitido`);
    }

    setErrors(newErrors);

    if (newErrors.length === 0) {
      const newRecipient: Recipient = {
        id: Date.now().toString(),
        name,
        email,
        relationship: 'friend' // Valor padrão
      };

      onRecipientsChange([...recipients, newRecipient]);
      setInputValue('');
      setNameValue('');
      setIsAddingRecipient(false);
      
      // Animação de sucesso
      setTimeout(() => {
        setFocusedChip(newRecipient.id);
        setTimeout(() => setFocusedChip(null), 1000);
      }, 100);
    }
  };

  // Remover destinatário
  const removeRecipient = (id: string) => {
    onRecipientsChange(recipients.filter(r => r.id !== id));
  };

  // Lidar com teclas
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRecipient();
    } else if (e.key === 'Escape') {
      setIsAddingRecipient(false);
      setInputValue('');
      setNameValue('');
      setErrors([]);
    }
  };

  // Focar no input quando começar a adicionar
  useEffect(() => {
    if (isAddingRecipient && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingRecipient]);

  return (
    <div className="space-y-4">
      
      {/* Lista de Destinatários */}
      {recipients.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-steel-blue flex items-center">
            <Heart className="w-4 h-4 mr-2 text-dusty-rose" />
            Destinatários ({recipients.length})
          </h4>
          
          <div className="flex flex-wrap gap-2">
            {recipients.map((recipient) => (
              <Badge
                key={recipient.id}
                variant="secondary"
                className={`
                  recipient-chip px-3 py-2 bg-gradient-to-r from-dusty-rose/10 to-earthy-burgundy/10 
                  border border-dusty-rose/20 text-steel-blue transition-all duration-200 
                  hover:scale-105 hover:shadow-md hover:border-dusty-rose/40
                  ${focusedChip === recipient.id ? 'animate-pulse-gentle scale-105 border-dusty-rose' : ''}
                `}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-dusty-rose/20 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-dusty-rose" />
                  </div>