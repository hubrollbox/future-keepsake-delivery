import React from "react";

interface BarChartProps {
  data: { month: string; count: number }[];
}

const DeliveriesBarChart: React.FC<BarChartProps> = ({ data }) => {
  const maxCount = Math.max(...data.map(item => item.count), 1);
  
  return (
    <div className="w-full h-[300px] flex items-end justify-between p-4 bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      {data.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center text-misty-gray">
          Nenhum dado disponível
        </div>
      ) : (
        data.map((item) => (
          <div key={item.month} className="flex flex-col items-center justify-end flex-1 min-w-0 h-full">
            <div
              className="w-full max-w-[40px] bg-keepla-red rounded-t-lg transition-all duration-300 hover:opacity-80 relative group"
              style={{ height: `${Math.max((item.count / maxCount) * 100, 4)}%` }}
              title={`${item.count} entregas`}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-keepla-gray-dark text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {item.count} entregas
              </div>
            </div>
            <span className="text-xs text-keepla-gray mt-2 text-center font-medium">
              {item.month}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default DeliveriesBarChart;
