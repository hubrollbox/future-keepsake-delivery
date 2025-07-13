import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const CreateKeepsake: React.FC = () => {
  const [title, setTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('Você precisa estar logado para criar uma cápsula.');
      navigate('/login');
      return;
    }

    const { data, error } = await supabase
      .from('keepsakes')
      .insert([
        {
          user_id: user.id,
          title,
          message_content: messageContent,
          delivery_date: deliveryDate,
        },
      ]);

    if (error) {
      console.error('Erro ao criar cápsula:', error);
      alert('Erro ao criar cápsula: ' + error.message);
    } else {
      alert('Cápsula criada com sucesso!');
      navigate('/dashboard'); // Ou para onde você quiser redirecionar após a criação
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Criar Nova Cápsula do Tempo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            id="title"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Criar Cápsula
        </button>
      </form>
    </div>
  );
};

export default CreateKeepsake;