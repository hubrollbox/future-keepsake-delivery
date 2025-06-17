import Calendar from "react-calendar";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";

const OrdersCalendar = () => {
  const [date, setDate] = useState(new Date());
  const deliveries = [
    { date: "2025-06-20", details: "Entrega para João Silva" },
    { date: "2025-06-25", details: "Entrega para Maria Oliveira" },
  ];

  const handleDateClick = (value) => {
    const delivery = deliveries.find((d) => d.date === value.toISOString().split("T")[0]);
    if (delivery) {
      alert(`Detalhes: ${delivery.details}`);
    } else {
      alert("Nenhuma entrega programada para esta data.");
    }
  };

  const handleDateChange = (value: Date | [Date, Date]) => {
    if (Array.isArray(value)) {
      setDate(value[0]); // Use a primeira data do intervalo
    } else {
      setDate(value);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Calendário de Entregas</h1>
      <Calendar
        onChange={handleDateChange}
        value={date}
        onClickDay={handleDateClick}
        tileContent={({ date, view }) => {
          if (deliveries.some((d) => d.date === date.toISOString().split("T")[0])) {
            return <span className="text-blue-600">•</span>;
          }
        }}
      />
    </div>
  );
};

export default OrdersCalendar;
