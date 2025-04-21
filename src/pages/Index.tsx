
import React, { useState } from "react";
import { Process, SchedulerResult, runScheduler, compareAlgorithms } from "@/lib/schedulers";
import ProcessForm from "@/components/ProcessForm";
import SchedulerConfig, { SimulationMode, SchedulerAlgorithm } from "@/components/SchedulerConfig";
import ResultsDisplay from "@/components/ResultsDisplay";
import StepByStepSimulation from "@/components/StepByStepSimulation";
import WelcomeGuide from "@/components/WelcomeGuide";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  // Process state
  const [processes, setProcesses] = useState<Process[]>([]);
  
  // Scheduler configuration state
  const [algorithm, setAlgorithm] = useState<SchedulerAlgorithm>("FCFS");
  const [isPreemptive, setIsPreemptive] = useState(false);
  const [contextSwitchTime, setContextSwitchTime] = useState(0);
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [simulationMode, setSimulationMode] = useState<SimulationMode>("instant");
  
  // Results state
  const [results, setResults] = useState<SchedulerResult | null>(null);
  const [compareResults, setCompareResults] = useState<Record<string, SchedulerResult> | null>(null);
  const [isSimulationRun, setIsSimulationRun] = useState(false);
  
  const runSimulation = () => {
    if (processes.length === 0) return;
    
    if (simulationMode === "comparison") {
      const compResults = compareAlgorithms(processes, contextSwitchTime, timeQuantum);
      setCompareResults(compResults);
      setResults(null);
    } else {
      const simulationResults = runScheduler(
        algorithm, 
        processes, 
        isPreemptive, 
        contextSwitchTime, 
        timeQuantum
      );
      setResults(simulationResults);
      setCompareResults(null);
    }
    
    setIsSimulationRun(true);
  };
  
  const resetSimulation = () => {
    setResults(null);
    setCompareResults(null);
    setIsSimulationRun(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <WelcomeGuide />
      <header className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">CPU Scheduling Simulator</h1>
          <p className="mt-2 opacity-90">
            Interactive visualization of CPU scheduling algorithms
          </p>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Left column: Process Management */}
          <div className="md:col-span-2">
            <ProcessForm processes={processes} setProcesses={setProcesses} />
          </div>
          
          {/* Right column: Scheduler Configuration */}
          <div>
            <SchedulerConfig
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              isPreemptive={isPreemptive}
              setIsPreemptive={setIsPreemptive}
              contextSwitchTime={contextSwitchTime}
              setContextSwitchTime={setContextSwitchTime}
              timeQuantum={timeQuantum}
              setTimeQuantum={setTimeQuantum}
              simulationMode={simulationMode}
              setSimulationMode={setSimulationMode}
              processes={processes}
              runSimulation={runSimulation}
              resetSimulation={resetSimulation}
            />
          </div>
        </div>
        
        {/* Results Section */}
        {isSimulationRun && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <h2 className="text-xl font-bold mb-4">Simulation Results</h2>
            
            {simulationMode === "stepByStep" && results ? (
              <StepByStepSimulation results={results} />
            ) : (
              <ResultsDisplay 
                results={results} 
                compareResults={compareResults ?? undefined} 
              />
            )}
          </div>
        )}
      </main>
      
      <footer className="bg-gray-100 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>CPU Scheduling Simulator | Advanced Visualization Tool</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
