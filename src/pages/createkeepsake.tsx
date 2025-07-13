import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Importar o hook useAuth
import { supabase } from '../integrations/supabase/client';

const CreateKeepsake: React.FC = () => {
  const [title, setTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const navigate = useNavigate();
  const { user, loading } = useAuth(); // Usar o hook useAuth

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Você precisa estar logado para criar uma cápsula.');
      navigate('/login');
      return;
    }

    const { data, error } = await supabase
      .from('keepsakes')
      .insert(
        {
          user_id: user.id,
          title,
          message: messageContent,
          delivery_date: deliveryDate,
        }
      );

    if (error) {
      console.error('Erro ao criar cápsula:', error);
      alert('Erro ao criar cápsula: ' + error.message);
    } else {
      alert('Cápsula criada com sucesso!');
      navigate('/dashboard'); // Ou para onde você quiser redirecionar após a criação
    }
  };

  return (
    <div className="min-h-screen bg-warm-gradient flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 font-serif">Criar Nova Cápsula do Tempo</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
            className="btn-primary w-full"
          >
            Criar Cápsula
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateKeepsake;