const SummaryCards = () => {
  const data = [
    { title: "Pedidos Agendados", value: 120 },
    { title: "Cápsulas Entregues", value: 45 },
    { title: "Clientes Ativos", value: 30 },
    { title: "Receita Total", value: "€12,000" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((item, index) => (
        <div key={index} className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700">{item.title}</h3>
          <p className="text-2xl font-bold text-blue-600">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
