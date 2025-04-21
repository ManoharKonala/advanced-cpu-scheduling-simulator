
import React from "react";
import { GanttChartItem } from "@/lib/schedulers";

interface GanttChartProps {
  data: GanttChartItem[];
  startTime?: number;
  endTime?: number;
}

const GanttChart: React.FC<GanttChartProps> = ({ 
  data, 
  startTime: customStartTime, 
  endTime: customEndTime 
}) => {
  if (!data.length) return <div className="text-center p-4">No data to display</div>;

  // Calculate time range if not provided
  const startTime = customStartTime ?? Math.min(...data.map(item => item.startTime));
  const endTime = customEndTime ?? Math.max(...data.map(item => item.endTime));
  const totalDuration = endTime - startTime;

  // Generate a color if not provided
  const getDefaultColor = (id: string) => {
    const colors = [
      "#9b87f5", "#7E69AB", "#6E59A5", "#D6BCFA", "#F2FCE2", 
      "#FEF7CD", "#FEC6A1", "#E5DEFF", "#FFDEE2", "#FDE1D3", 
      "#D3E4FD", "#F1F0FB", "#8B5CF6", "#D946EF", "#F97316", 
      "#0EA5E9"
    ];
    const hash = id.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <div className="mb-2 font-semibold text-lg">Gantt Chart</div>
      
      {/* Timeline scale */}
      <div className="flex items-center mb-2">
        <div className="w-24 flex-shrink-0 text-center">Process</div>
        <div className="flex-grow relative">
          {Array.from({ length: totalDuration + 1 }).map((_, i) => (
            <span 
              key={i} 
              className="absolute text-xs"
              style={{ 
                left: `${(i / totalDuration) * 100}%`, 
                transform: 'translateX(-50%)' 
              }}
            >
              {startTime + i}
            </span>
          ))}
        </div>
      </div>

      {/* Gantt chart bars */}
      <div className="relative mt-6">
        {data.map((item, index) => {
          const left = ((item.startTime - startTime) / totalDuration) * 100;
          const width = ((item.endTime - item.startTime) / totalDuration) * 100;
          const color = item.color || getDefaultColor(item.processId);
          
          return (
            <div key={index} className="flex items-center mb-3">
              <div className="w-24 flex-shrink-0 text-center font-medium">
                {item.processId}
              </div>
              <div className="flex-grow relative h-10">
                <div 
                  className="absolute h-full rounded-md flex items-center justify-center text-white text-sm"
                  style={{ 
                    left: `${left}%`, 
                    width: `${width}%`,
                    backgroundColor: color
                  }}
                >
                  {item.endTime - item.startTime}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GanttChart;
