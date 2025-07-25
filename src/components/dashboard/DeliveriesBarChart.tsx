import React from "react";
import './DeliveriesBarChart.css';

interface BarChartProps {
  data: { month: string; count: number }[];
}

const DeliveriesBarChart: React.FC<BarChartProps> = ({ data }) => {
  const maxCount = Math.max(...data.map(item => item.count), 1);
  
  return (
    <div className="bar-chart-container">
      {data.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center text-misty-gray">
          Nenhum dado disponível
        </div>
      ) : (
        data.map((item) => (
          <div key={item.month} className="flex flex-col items-center justify-end flex-1 min-w-0">
            <div
              className="bg-gradient-to-t from-earthy-burgundy to-dusty-rose rounded-t-lg transition-all duration-300 hover:opacity-80 relative group bar-chart-bar"
              style={{ 
                height: `${Math.max((item.count / maxCount) * 180, 8)}px`
              }}
              title={`${item.count} entregas`}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-steel-blue text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.count} entregas
              </div>
            </div>
            <span className="text-xs text-misty-gray mt-2 text-center font-medium">
              {item.month}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default DeliveriesBarChart;
```
