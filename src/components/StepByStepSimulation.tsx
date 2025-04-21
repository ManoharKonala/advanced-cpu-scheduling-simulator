
import React, { useState, useEffect } from "react";
import { GanttChartItem, Process, SchedulerResult } from "@/lib/schedulers";
import GanttChart from "./GanttChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, StepForward, StepBack } from "lucide-react";

interface StepByStepSimulationProps {
  results: SchedulerResult;
}

const StepByStepSimulation: React.FC<StepByStepSimulationProps> = ({ results }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1); // seconds per step
  const [visibleGantt, setVisibleGantt] = useState<GanttChartItem[]>([]);
  
  const totalSteps = results.ganttChart.length;
  
  // Effect for handling animation playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentStep < totalSteps - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const nextStep = prev + 1;
          if (nextStep >= totalSteps) {
            setIsPlaying(false);
            return totalSteps - 1;
          }
          return nextStep;
        });
      }, animationSpeed * 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, totalSteps, animationSpeed]);
  
  // Update visible portion of Gantt chart based on current step
  useEffect(() => {
    if (results.ganttChart.length > 0) {
      setVisibleGantt(results.ganttChart.slice(0, currentStep + 1));
    }
  }, [currentStep, results.ganttChart]);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleStepForward = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium">
              Step {currentStep + 1} of {totalSteps}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline" 
                size="icon"
                onClick={handleStepBack}
                disabled={currentStep === 0}
              >
                <StepBack className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline" 
                size="icon"
                onClick={handlePlayPause}
              >
                {isPlaying ? 
                  <Pause className="h-4 w-4" /> : 
                  <Play className="h-4 w-4" />
                }
              </Button>
              
              <Button
                variant="outline" 
                size="icon"
                onClick={handleStepForward}
                disabled={currentStep === totalSteps - 1}
              >
                <StepForward className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 w-1/3">
              <span className="text-sm text-gray-500">Speed:</span>
              <Slider
                value={[animationSpeed]}
                min={0.2}
                max={3}
                step={0.2}
                onValueChange={(value) => setAnimationSpeed(value[0])}
              />
              <span className="text-sm w-12">{animationSpeed.toFixed(1)}s</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Current simulation state visualization */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Current State</h3>
        <GanttChart 
          data={visibleGantt} 
          startTime={results.ganttChart[0]?.startTime || 0}
          endTime={results.ganttChart[totalSteps - 1]?.endTime || 0}
        />
      </div>
      
      {/* Current step details */}
      {visibleGantt.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Current Process</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Process ID</p>
                <p className="font-medium">{visibleGantt[currentStep].processId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time Interval</p>
                <p className="font-medium">
                  {visibleGantt[currentStep].startTime} - {visibleGantt[currentStep].endTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">
                  {visibleGantt[currentStep].endTime - visibleGantt[currentStep].startTime} time units
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StepByStepSimulation;
