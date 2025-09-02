import React, { useState } from "react";

const OrdersCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const deliveries = [
    { date: "2025-06-20", details: "Entrega para João Silva" },
    { date: "2025-06-25", details: "Entrega para Maria Oliveira" },
  ];

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
    const delivery = deliveries.find((d) => d.date === event.target.value);
    if (delivery) {
      alert(`Detalhes: ${delivery.details}`);
    } else {
      alert("Nenhuma entrega programada para esta data.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Calendário de Entregas</h1>
      <div className="max-w-md">
        <label htmlFor="date-picker" className="block text-sm font-medium text-gray-700 mb-2">
          Selecionar Data:
        </label>
        <input
          id="date-picker"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Entregas Marcadas:</h3>
          <ul className="space-y-1">
            {deliveries.map((delivery, index) => (
              <li key={index} className="text-sm text-blue-600">
                <span className="font-medium">{delivery.date}</span>: {delivery.details}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrdersCalendar;