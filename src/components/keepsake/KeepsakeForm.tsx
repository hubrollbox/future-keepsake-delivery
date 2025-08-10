import { useZodForm } from '../../hooks/useZodForm';
import { createMessageSchema } from '../../lib/validation';

const KeepsakeForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useZodForm(createMessageSchema);

  const onSubmit = async (data) => {
    // O data já está validado pelo Zod
    try {
      // Enviar dados para o backend
      // ...
      reset();
    } catch (error) {
      console.error('Erro ao criar keepsake:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label htmlFor="title" className="block mb-2">Título</label>
        <input
          id="title"
          {...register('title')}
          className="w-full p-2 border rounded"
        />
        {errors.title && (
          <p className="text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="message_content" className="block mb-2">Mensagem</label>
        <textarea
          id="message_content"
          {...register('message_content')}
          className="w-full p-2 border rounded h-32"
        />
        {errors.message_content && (
          <p className="text-red-500 mt-1">{errors.message_content.message}</p>
        )}
      </div>

      {/* Outros campos do formulário */}
      
      <button 
        type="submit" 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Criar Keepsake
      </button>
    </form>
  );
};

export default KeepsakeForm;