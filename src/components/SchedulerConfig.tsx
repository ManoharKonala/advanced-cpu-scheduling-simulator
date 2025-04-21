
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Process } from "@/lib/schedulers";

export type SimulationMode = "instant" | "stepByStep" | "comparison";
export type SchedulerAlgorithm = "FCFS" | "SJF" | "Priority" | "RR";

interface SchedulerConfigProps {
  algorithm: SchedulerAlgorithm;
  setAlgorithm: React.Dispatch<React.SetStateAction<SchedulerAlgorithm>>;
  isPreemptive: boolean;
  setIsPreemptive: React.Dispatch<React.SetStateAction<boolean>>;
  contextSwitchTime: number;
  setContextSwitchTime: React.Dispatch<React.SetStateAction<number>>;
  timeQuantum: number;
  setTimeQuantum: React.Dispatch<React.SetStateAction<number>>;
  simulationMode: SimulationMode;
  setSimulationMode: React.Dispatch<React.SetStateAction<SimulationMode>>;
  processes: Process[];
  runSimulation: () => void;
  resetSimulation: () => void;
}

const SchedulerConfig: React.FC<SchedulerConfigProps> = ({
  algorithm,
  setAlgorithm,
  isPreemptive,
  setIsPreemptive,
  contextSwitchTime,
  setContextSwitchTime,
  timeQuantum,
  setTimeQuantum,
  simulationMode,
  setSimulationMode,
  processes,
  runSimulation,
  resetSimulation
}) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Scheduler Configuration</h2>
      
      <div className="space-y-4">
        {/* Algorithm Selection */}
        <div>
          <Label className="mb-2 block">Scheduling Algorithm</Label>
          <Tabs 
            defaultValue={algorithm} 
            className="w-full"
            onValueChange={(value) => setAlgorithm(value as SchedulerAlgorithm)}
          >
            <TabsList className="grid grid-cols-4 mb-2">
              <TabsTrigger value="FCFS">FCFS</TabsTrigger>
              <TabsTrigger value="SJF">SJF</TabsTrigger>
              <TabsTrigger value="Priority">Priority</TabsTrigger>
              <TabsTrigger value="RR">Round Robin</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Preemptive mode (for SJF and Priority) */}
        {(algorithm === "SJF" || algorithm === "Priority") && (
          <div className="flex items-center space-x-2">
            <Switch 
              id="preemptive" 
              checked={isPreemptive}
              onCheckedChange={setIsPreemptive}
            />
            <Label htmlFor="preemptive">Preemptive Mode</Label>
          </div>
        )}
        
        {/* Time Quantum (for Round Robin) */}
        {algorithm === "RR" && (
          <div>
            <Label htmlFor="timeQuantum">Time Quantum</Label>
            <Input
              id="timeQuantum"
              type="number"
              min="1"
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}
        
        {/* Context Switch Time */}
        <div>
          <Label htmlFor="contextSwitchTime">Context Switch Time</Label>
          <Input
            id="contextSwitchTime"
            type="number"
            min="0"
            value={contextSwitchTime}
            onChange={(e) => setContextSwitchTime(Number(e.target.value))}
            className="w-full"
          />
        </div>
        
        {/* Simulation Mode */}
        <div>
          <Label className="mb-2 block">Simulation Mode</Label>
          <Tabs 
            defaultValue={simulationMode} 
            className="w-full"
            onValueChange={(value) => setSimulationMode(value as SimulationMode)}
          >
            <TabsList className="grid grid-cols-3 mb-2">
              <TabsTrigger value="instant">Instant</TabsTrigger>
              <TabsTrigger value="stepByStep">Step-by-Step</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button 
            onClick={runSimulation} 
            className="flex-1"
            disabled={processes.length === 0}
          >
            Run Simulation
          </Button>
          <Button 
            onClick={resetSimulation} 
            variant="outline" 
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SchedulerConfig;
