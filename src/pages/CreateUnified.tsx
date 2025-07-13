import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ProgressStepper from '@/components/ProgressStepper';
import { useCreateDeliveryForm } from '@/features/create-delivery/useCreateDeliveryForm';
import DeliveryFormStepper from '@/components/delivery/DeliveryFormStepper';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface CreateUnifiedProps {
  type: 'keepsake' | 'message' | 'delivery';
}

const DeliveryForm: React.FC = () => {
  const steps = [
    'Tipo de Entrega',
    'Detalhes da Entrega',
    'Informações do Destinatário',
    'Revisão e Pagamento',
    'Confirmação',
  ];

  const { currentStep, nextStep, prevStep, handleSubmit, loading, error, formData, handleInputChange, handleFileChange, deliveryType, setDeliveryType } = useCreateDeliveryForm();

  return (
    <div>
      <ProgressStepper currentStep={currentStep} steps={steps} />
      <div className="mt-8">
        <DeliveryFormStepper
          step={currentStep}
          formData={formData}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          deliveryType={deliveryType}
          setDeliveryType={setDeliveryType}
        />
      </div>
      <div className="mt-8 flex justify-between">
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <Button
            onClick={prevStep}
            variant="brand-outline"
          >
            Voltar
          </Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button
            onClick={currentStep === steps.length - 2 ? handleSubmit : nextStep}
            variant="brand"
            disabled={loading}
          >
            {loading ? 'Processando...' : (currentStep === steps.length - 2 ? 'Finalizar' : 'Próximo')}
          </Button>
        )}
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

interface KeepsakeFormProps {
  user: any; // Replace 'any' with actual user type if available
}

const KeepsakeForm: React.FC<KeepsakeFormProps> = ({ user }) => {
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    messageContent: '',
    recipientName: '',
    recipientEmail: '',
    productSelection: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    if (currentStep === 0 && (!formData.title || !formData.messageContent)) {
      toast({ title: 'Erro', description: 'Por favor, insira o título e o conteúdo da mensagem.' });
      return;
    }
    if (currentStep === 1 && (!formData.recipientName || !formData.recipientEmail)) {
      toast({ title: 'Erro', description: 'Por favor, insira o nome e email do destinatário.' });
      return;
    }
    if (currentStep === 2 && !formData.productSelection) {
      toast({ title: 'Erro', description: 'Por favor, selecione um produto.' });
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('keepsakes').insert(
        {
          user_id: user.id,
          title: formData.title,
          description: formData.messageContent,
        }
      );

      if (error) throw error;

      toast({ title: 'Sucesso', description: 'Cápsula criada com sucesso!' });
      setCurrentStep(3); // Move to success step (assuming 4 steps total: 0,1,2,3)
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Detalhes da Cápsula</h2>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <label htmlFor="messageContent" className="block text-sm font-medium text-gray-700 mt-4">Conteúdo da Mensagem</label>
            <Textarea
              id="messageContent"
              name="messageContent"
              value={formData.messageContent}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>
        );
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Destinatário</h2>
            <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700">Nome do Destinatário</label>
            <Input
              type="text"
              id="recipientName"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              required
            />
            <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 mt-4">Email do Destinatário</label>
            <Input
              type="email"
              id="recipientEmail"
              name="recipientEmail"
              value={formData.recipientEmail}
              onChange={handleChange}
              required
            />
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Produtos</h2>
            <label htmlFor="productSelection" className="block text-sm font-medium text-gray-700">Selecione um Produto</label>
            <select
              id="productSelection"
              name="productSelection"
              value={formData.productSelection}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="">Selecione...</option>
              <option value="product1">Produto 1</option>
              <option value="product2">Produto 2</option>
            </select>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Revisão</h2>
            <p><strong>Título:</strong> {formData.title}</p>
            <p><strong>Conteúdo da Mensagem:</strong> {formData.messageContent}</p>
            <p><strong>Destinatário:</strong> {formData.recipientName} ({formData.recipientEmail})</p>
            <p><strong>Produto Selecionado:</strong> {formData.productSelection}</p>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Sucesso!</h2>
            <p>Sua cápsula foi criada com sucesso.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {renderStepContent()}
      <div className="mt-8 flex justify-between">
        {currentStep > 0 && currentStep < 4 && (
          <Button
            onClick={handleBack}
            variant="brand-outline"
          >
            Voltar
          </Button>
        )}
        {currentStep < 3 && (
          <Button
            onClick={handleNext}
            variant="brand"
          >
            Próximo
          </Button>
        )}
        {currentStep === 3 && (
          <Button
            onClick={handleSubmit}
            variant="brand"
            disabled={loading}
          >
            {loading ? 'Finalizando...' : 'Finalizar Criação'}
          </Button>
        )}
      </div>
    </div>
  );
};

interface MessageFormProps {
  user: any; // Replace 'any' with actual user type if available
}

const MessageForm: React.FC<MessageFormProps> = ({ user }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    delivery_date: '',
    recipient_name: '',
    recipient_email: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.message || !formData.delivery_date || !formData.recipient_name || !formData.recipient_email) {
      toast({ title: 'Erro', description: 'Por favor, preencha todos os campos.' });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from('messages').insert(
        {
          title: formData.title,
          message: formData.message,
          delivery_date: formData.delivery_date,
          recipient_name: formData.recipient_name,
          recipient_email: formData.recipient_email,
          user_id: user.id,
        }
      );

      if (error) throw error;

      toast({ title: 'Sucesso', description: 'Mensagem criada com sucesso!' });
      // Optionally clear form or redirect
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
        <Input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Conteúdo</label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          required
        />
      </div>
      <div>
        <label htmlFor="delivery_date" className="block text-sm font-medium text-gray-700">Data de Entrega</label>
        <Input
          type="date"
          id="delivery_date"
          name="delivery_date"
          value={formData.delivery_date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="recipient_name" className="block text-sm font-medium text-gray-700">Nome do Destinatário</label>
        <Input
          type="text"
          id="recipient_name"
          name="recipient_name"
          value={formData.recipient_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="recipient_email" className="block text-sm font-medium text-gray-700">Email do Destinatário</label>
        <Input
          type="email"
          id="recipient_email"
          name="recipient_email"
          value={formData.recipient_email}
          onChange={handleChange}
          required
        />
      </div>
      <Button
        type="submit"
        variant="brand"
        disabled={loading}
      >
        {loading ? 'Criando...' : 'Criar Mensagem'}
      </Button>
    </form>
  );
};

const CreateUnified: React.FC<CreateUnifiedProps> = ({ type }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const renderForm = () => {
    switch (type) {
      case 'message':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Criar Mensagem</h2>
            <MessageForm user={user} />
          </div>
        );
      case 'keepsake':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Criar Cápsula do Tempo</h2>
            <KeepsakeForm user={user} />
          </div>
        );
      case 'delivery':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Criar Entrega</h2>
            <DeliveryForm />
          </div>
        );
      default:
        return <p>Tipo de criação desconhecido.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-lavender-mist">
      <Navigation />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-full sm:max-w-2xl lg:max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Criar Novo Item</h1>
          {renderForm()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateUnified;