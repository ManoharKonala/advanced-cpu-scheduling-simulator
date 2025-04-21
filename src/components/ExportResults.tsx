
import React from "react";
import { Button } from "@/components/ui/button";
import { SchedulerResult } from "@/lib/schedulers";
import { Download } from "lucide-react";

interface ExportResultsProps {
  results: SchedulerResult;
  algorithmName: string;
}

const ExportResults: React.FC<ExportResultsProps> = ({ results, algorithmName }) => {
  const exportAsJSON = () => {
    // Create a formatted results object
    const exportData = {
      algorithm: algorithmName,
      timestamp: new Date().toISOString(),
      results: {
        processes: results.processes.map(p => ({
          id: p.id,
          arrivalTime: p.arrivalTime,
          burstTime: p.burstTime,
          priority: p.priority,
          completionTime: p.completionTime,
          turnaroundTime: p.turnaroundTime,
          waitingTime: p.waitingTime,
          responseTime: p.responseTime
        })),
        averageMetrics: {
          waitingTime: results.averageWaitingTime,
          turnaroundTime: results.averageTurnaroundTime,
          responseTime: results.averageResponseTime,
          cpuUtilization: results.cpuUtilization,
          throughput: results.throughput
        },
        ganttChart: results.ganttChart
      }
    };
    
    // Convert to JSON and create download link
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.download = `cpu-scheduler-results-${new Date().getTime()}.json`;
    link.href = url;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
  };
  
  const exportAsCSV = () => {
    // Create headers
    const headers = [
      "Process ID",
      "Arrival Time",
      "Burst Time",
      "Priority",
      "Completion Time",
      "Turnaround Time",
      "Waiting Time",
      "Response Time"
    ];
    
    // Create process rows
    const processRows = results.processes.map(p => [
      p.id,
      p.arrivalTime,
      p.burstTime,
      p.priority || "N/A",
      p.completionTime?.toFixed(2) || "N/A",
      p.turnaroundTime?.toFixed(2) || "N/A",
      p.waitingTime?.toFixed(2) || "N/A",
      p.responseTime?.toFixed(2) || "N/A"
    ]);
    
    // Create summary row
    const summaryRows = [
      ["SUMMARY", "", "", "", "", "", "", ""],
      ["Algorithm", algorithmName, "", "", "", "", "", ""],
      ["Avg. Waiting Time", results.averageWaitingTime.toFixed(2), "", "", "", "", "", ""],
      ["Avg. Turnaround Time", results.averageTurnaroundTime.toFixed(2), "", "", "", "", "", ""],
      ["Avg. Response Time", results.averageResponseTime.toFixed(2), "", "", "", "", "", ""],
      ["CPU Utilization", `${results.cpuUtilization.toFixed(2)}%`, "", "", "", "", "", ""],
      ["Throughput", results.throughput.toFixed(4), "", "", "", "", "", ""]
    ];
    
    // Combine all rows
    const allRows = [headers, ...processRows, [""], ...summaryRows];
    
    // Convert to CSV
    const csvContent = allRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.download = `cpu-scheduler-results-${new Date().getTime()}.csv`;
    link.href = url;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={exportAsJSON}
        className="flex items-center space-x-1"
      >
        <Download size={16} />
        <span>Export as JSON</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={exportAsCSV}
        className="flex items-center space-x-1"
      >
        <Download size={16} />
        <span>Export as CSV</span>
      </Button>
    </div>
  );
};

export default ExportResults;
