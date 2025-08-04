import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';
import DeliveryTypeStep from '../components/delivery/DeliveryTypeStep';
import { useToast } from '../hooks/use-toast';

export interface KeepsakeFormData {
  title: string;
  recipientName: string;
  recipient_name: string;
  recipient_contact: string;
  messageContent: string;
  message: string;
  deliveryDate: string;
  delivery_date: string;
  keepsakeType: 'digital' | 'physical' | null;
  delivery_channel: string;
  relationship: string;
  selected_products: any[];
  channel_cost: number;
  total_cost: number;
}

const CreateKeepsake: React.FC = () => {
  const [title, setTitle] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [keepsakeType, setKeepsakeType] = useState<'digital' | 'physical' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const navigate = useNavigate();
  const { user, loading, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    console.log('CreateKeepsake Component - loading:', loading, 'user:', user, 'profile:', profile);

    if (!loading && !user) {
      alert('Você precisa estar logado para criar uma cápsula.');
      navigate('/login');
    }
  }, [loading, user, navigate]);

  const handleNextStep = () => {
    if (currentStep === 1 && !keepsakeType) {
      toast({
        title: 'Tipo de presente não selecionado.',
        description: 'Por favor, selecione um tipo de presente para continuar.',
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!user || !profile) {
      setError('Informações do usuário não disponíveis');
      setIsSubmitting(false);
      return;
    }

    if (!keepsakeType) {
      toast({
        title: 'Erro de validação',
        description: 'Por favor, selecione o tipo de cápsula.',
        variant: 'destructive',
        duration: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('keepsakes')
        .insert({
          user_id: user.id,
          title,
          recipient_name: recipientName,
          message: messageContent,
          delivery_date: new Date(deliveryDate).toISOString(),
          type: keepsakeType,
        });

      if (error) throw error;
      
      toast({
        title: 'Cápsula criada com sucesso!',
        variant: 'default',
        duration: 3000,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError('Erro ao criar cápsula: ' + err.message);
      toast({
        title: 'Erro ao criar cápsula',
        description: err.message,
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-lavender-mist flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 font-serif">Criar Nova Cápsula do Tempo</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {currentStep === 1 && (
          <DeliveryTypeStep
            deliveryType={keepsakeType}
            setDeliveryType={setKeepsakeType}
            onNext={handleNextStep}
          />
        )}

        {currentStep === 2 && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700">
                Nome do Destinatário
              </label>
              <input
                type="text"
                id="recipientName"
                className="input-field"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
              <input
                type="text"
                id="title"
                className="input-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="messageContent" className="block text-sm font-medium text-gray-700">Conteúdo da Mensagem</label>
              <textarea
                id="messageContent"
                rows={5}
                className="input-field"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700">Data de Entrega</label>
              <input
                type="date"
                id="deliveryDate"
                className="input-field"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Anterior
              </button>
              <button
                type="submit"
                className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-earthy-burgundy hover:bg-steel-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-earthy-burgundy disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !user || !profile || isSubmitting}
              >
                {isSubmitting ? 'Criando...' : 'Criar Cápsula'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateKeepsake;
