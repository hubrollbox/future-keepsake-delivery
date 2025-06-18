import React from "react";
// Se instalar chart.js/react-chartjs-2, troque para os imports reais
// import { Bar } from 'react-chartjs-2';

interface BarChartProps {
  data: { month: string; count: number }[];
}

// Placeholder visual para gráfico de barras
const DeliveriesBarChart: React.FC<BarChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64 flex items-end gap-2 bg-white rounded-xl p-4 border border-dusty-rose/20 shadow-soft">
      {data.map((item) => (
        <div key={item.month} className="flex flex-col items-center justify-end flex-1">
          <div
            className="bg-golden-honey rounded-t-xl"
            style={{ height: `${item.count * 10 || 4}px`, minHeight: 4, width: 24 }}
            title={`${item.count} entregas`}
          />
          <span className="text-xs text-soft-gray mt-1">{item.month}</span>
        </div>
      ))}
    </div>
  );
};

export default DeliveriesBarChart;
