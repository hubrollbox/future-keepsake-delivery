import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';

const CreateKeepsake: React.FC = () => {
  const [title, setTitle] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [keepsakeType, setKeepsakeType] = useState<'digital' | 'physical'>('digital');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { user, loading, profile } = useAuth();

  useEffect(() => {
    console.log('CreateKeepsake Component - loading:', loading, 'user:', user, 'profile:', profile);

    if (!loading && !user) {
      alert('Você precisa estar logado para criar uma cápsula.');
      navigate('/login');
    }
  }, [loading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!user || !profile) {
      setError('Informações do usuário não disponíveis');
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
      
      alert('Cápsula criada com sucesso!');
      navigate('/dashboard');
    } catch (err) {
      setError('Erro ao criar cápsula: ' + err.message);
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
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Novo campo para nome do destinatário */}
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

          {/* Campo para seleção do tipo de cápsula */}
          <div className="flex items-center space-x-4">
            <label className="block text-sm font-medium text-gray-700">Tipo de Cápsula:</label>
            <div className="flex items-center">
              <input
                type="radio"
                id="digital"
                name="keepsakeType"
                value="digital"
                checked={keepsakeType === 'digital'}
                onChange={() => setKeepsakeType('digital')}
                className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300"
              />
              <label htmlFor="digital" className="ml-2 block text-sm font-medium text-gray-700">Digital</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="physical"
                name="keepsakeType"
                value="physical"
                checked={keepsakeType === 'physical'}
                onChange={() => setKeepsakeType('physical')}
                className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300"
              />
              <label htmlFor="physical" className="ml-2 block text-sm font-medium text-gray-700">Física</label>
            </div>
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
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-earthy-burgundy hover:bg-steel-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-earthy-burgundy disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !user || !profile || isSubmitting}
          >
            {isSubmitting ? 'Criando...' : 'Criar Cápsula'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateKeepsake;
