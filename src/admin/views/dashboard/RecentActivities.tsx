const RecentActivities = () => {
  const activities = [
    "Pedido #2312 agendado para 2030",
    "Pagamento pendente para Pedido #2313",
    "Novo cliente registrado: João Silva",
    "Pedido #2314 entregue com sucesso",
  ];

  return (
    <div className="bg-white shadow rounded-lg p-4 mt-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Atividades Recentes</h3>
      <ul className="space-y-2">
        {activities.map((activity, index) => (
          <li key={index} className="text-gray-600">- {activity}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;
