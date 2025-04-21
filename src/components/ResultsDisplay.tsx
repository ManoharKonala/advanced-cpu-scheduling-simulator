
import React, { useRef } from "react";
import { Process, SchedulerResult, GanttChartItem } from "@/lib/schedulers";
import GanttChart from "./GanttChart";
import ExportResults from "./ExportResults";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ResultsDisplayProps {
  results: SchedulerResult | null;
  compareResults?: Record<string, SchedulerResult>;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, compareResults }) => {
  if (!results && !compareResults) {
    return (
      <div className="text-center p-8 text-gray-500">
        Configure the scheduler and run a simulation to see results
      </div>
    );
  }

  if (compareResults) {
    return <ComparisonResults results={compareResults} />;
  }

  return <SingleResult results={results!} />;
};

const SingleResult: React.FC<{ results: SchedulerResult }> = ({ results }) => {
  return (
    <div className="space-y-6">
      {/* Gantt Chart */}
      <GanttChart data={results.ganttChart} />
      
      {/* Process Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Process Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Process ID</TableHead>
                <TableHead>Arrival Time</TableHead>
                <TableHead>Burst Time</TableHead>
                <TableHead>Completion Time</TableHead>
                <TableHead>Turnaround Time</TableHead>
                <TableHead>Waiting Time</TableHead>
                <TableHead>Response Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.processes.map((process) => (
                <TableRow key={process.id}>
                  <TableCell>{process.id}</TableCell>
                  <TableCell>{process.arrivalTime}</TableCell>
                  <TableCell>{process.burstTime}</TableCell>
                  <TableCell>{process.completionTime?.toFixed(2)}</TableCell>
                  <TableCell>{process.turnaroundTime?.toFixed(2)}</TableCell>
                  <TableCell>{process.waitingTime?.toFixed(2)}</TableCell>
                  <TableCell>{process.responseTime?.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Average Waiting Time" 
          value={results.averageWaitingTime.toFixed(2)} 
        />
        <MetricCard 
          title="Average Turnaround Time" 
          value={results.averageTurnaroundTime.toFixed(2)} 
        />
        <MetricCard 
          title="CPU Utilization" 
          value={`${results.cpuUtilization.toFixed(2)}%`} 
        />
        <MetricCard 
          title="Throughput" 
          value={`${results.throughput.toFixed(4)} process/unit time`} 
        />
      </div>
    </div>
  );
};

const ComparisonResults: React.FC<{ 
  results: Record<string, SchedulerResult> 
}> = ({ results }) => {
  const resultsRef = useRef<HTMLDivElement>(null);
  const algorithmNames = Object.keys(results);
  
  // Find overall min and max times for consistent Gantt chart scaling
  let minStartTime = Number.MAX_VALUE;
  let maxEndTime = 0;
  
  Object.values(results).forEach(result => {
    result.ganttChart.forEach(item => {
      minStartTime = Math.min(minStartTime, item.startTime);
      maxEndTime = Math.max(maxEndTime, item.endTime);
    });
  });

  return (
    <div className="space-y-6" ref={resultsRef}>
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold">Algorithm Comparison</h2>
        <ExportResults results={Object.values(results)[0]} algorithmName="Algorithm Comparison" />
      </div>
      
      {/* Summary Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Algorithm</TableHead>
                <TableHead>Avg. Waiting Time</TableHead>
                <TableHead>Avg. Turnaround Time</TableHead>
                <TableHead>Avg. Response Time</TableHead>
                <TableHead>CPU Utilization</TableHead>
                <TableHead>Throughput</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {algorithmNames.map((name) => (
                <TableRow key={name}>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell>{results[name].averageWaitingTime.toFixed(2)}</TableCell>
                  <TableCell>{results[name].averageTurnaroundTime.toFixed(2)}</TableCell>
                  <TableCell>{results[name].averageResponseTime.toFixed(2)}</TableCell>
                  <TableCell>{results[name].cpuUtilization.toFixed(2)}%</TableCell>
                  <TableCell>{results[name].throughput.toFixed(4)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Gantt Charts for Each Algorithm */}
      {algorithmNames.map((name) => (
        <div key={name} className="mb-8">
          <h3 className="text-lg font-semibold mb-2">{name}</h3>
          <GanttChart 
            data={results[name].ganttChart} 
            startTime={minStartTime}
            endTime={maxEndTime}
          />
        </div>
      ))}
    </div>
  );
};

const MetricCard: React.FC<{ title: string; value: string }> = ({ title, value }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
