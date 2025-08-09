import { useParams } from "react-router-dom";

const OrderDetails = () => {
  const { id } = useParams();
  const order = {
    id,
    client: "João Silva",
    status: "Pendente",
    date: "2025-06-20",
    recipient: "Maria Silva",
    content: "Cápsula do Tempo - Fotos e Cartas",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Detalhes do Pedido #{order.id}</h1>
      <div className="bg-white shadow rounded-lg p-4">
        <p><strong>Cliente:</strong> {order.client}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Data de Entrega:</strong> {order.date}</p>
        <p><strong>Destinatário:</strong> {order.recipient}</p>
        <p><strong>Conteúdo:</strong> {order.content}</p>
      </div>
      <button
        onClick={() => alert("Entrega marcada como concluída!")}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Marcar como Entregue
      </button>
    </div>
  );
};

export default OrderDetails;
