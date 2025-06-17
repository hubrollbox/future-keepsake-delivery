import { useState } from "react";
import { Link } from "react-router-dom";

const OrdersList = () => {
  const [filter, setFilter] = useState("");
  const orders = [
    { id: 1, client: "João Silva", status: "Pendente", date: "2025-06-20" },
    { id: 2, client: "Maria Oliveira", status: "Entregue", date: "2025-06-15" },
    { id: 3, client: "Carlos Santos", status: "Pendente", date: "2025-06-25" },
  ];

  const filteredOrders = orders.filter(
    (order) =>
      order.client.toLowerCase().includes(filter.toLowerCase()) ||
      order.status.toLowerCase().includes(filter.toLowerCase()) ||
      order.date.includes(filter)
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestão de Pedidos</h1>
      <input
        type="text"
        placeholder="Filtrar por cliente, status ou data..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Cliente</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Data</th>
            <th className="border border-gray-300 px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{order.id}</td>
              <td className="border border-gray-300 px-4 py-2">{order.client}</td>
              <td className="border border-gray-300 px-4 py-2">{order.status}</td>
              <td className="border border-gray-300 px-4 py-2">{order.date}</td>
              <td className="border border-gray-300 px-4 py-2">
                <Link to={`/admin/orders/${order.id}`} className="text-blue-600 underline">
                  Ver Detalhes
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersList;
