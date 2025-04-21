
import React, { useState } from "react";
import { Process } from "@/lib/schedulers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import SampleDataLoader from "./SampleDataLoader";

interface ProcessFormProps {
  processes: Process[];
  setProcesses: React.Dispatch<React.SetStateAction<Process[]>>;
}

const ProcessForm: React.FC<ProcessFormProps> = ({ processes, setProcesses }) => {
  const [newProcess, setNewProcess] = useState<Omit<Process, "id">>({
    arrivalTime: 0,
    burstTime: 1,
    priority: 1,
    color: generateRandomColor(),
  });

  // Generate a new random color
  function generateRandomColor() {
    const colors = [
      "#9b87f5", "#7E69AB", "#6E59A5", "#D6BCFA", "#F2FCE2", 
      "#FEF7CD", "#FEC6A1", "#E5DEFF", "#FFDEE2", "#FDE1D3", 
      "#D3E4FD", "#F1F0FB", "#8B5CF6", "#D946EF", "#F97316", 
      "#0EA5E9"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProcess({
      ...newProcess,
      [name]: name === "color" ? value : Number(value),
    });
  };

  const addProcess = () => {
    // Validate input
    if (newProcess.burstTime <= 0) {
      alert("Burst time must be greater than 0");
      return;
    }

    if (newProcess.arrivalTime < 0) {
      alert("Arrival time cannot be negative");
      return;
    }

    // Create new process with a unique ID
    const id = `P${processes.length + 1}`;
    const processToAdd: Process = {
      id,
      ...newProcess,
    };

    setProcesses([...processes, processToAdd]);
    
    // Reset form with a new color
    setNewProcess({
      arrivalTime: 0,
      burstTime: 1,
      priority: 1,
      color: generateRandomColor(),
    });
  };

  const removeProcess = (id: string) => {
    setProcesses(processes.filter(process => process.id !== id));
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Process Management</h2>
        <SampleDataLoader setProcesses={setProcesses} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="arrivalTime">Arrival Time</Label>
          <Input
            id="arrivalTime"
            name="arrivalTime"
            type="number"
            min="0"
            value={newProcess.arrivalTime}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <Label htmlFor="burstTime">Burst Time</Label>
          <Input
            id="burstTime"
            name="burstTime"
            type="number"
            min="1"
            value={newProcess.burstTime}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Input
            id="priority"
            name="priority"
            type="number"
            min="1"
            value={newProcess.priority}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <Label htmlFor="color">Color</Label>
          <div className="flex">
            <Input
              id="color"
              name="color"
              type="color"
              value={newProcess.color}
              onChange={handleInputChange}
              className="w-12 p-1 mr-2"
            />
            <Button onClick={addProcess} className="flex-grow">Add Process</Button>
          </div>
        </div>
      </div>
      
      {/* Process List */}
      <div className="mt-6">
        <h3 className="font-medium mb-2">Process List</h3>
        
        {processes.length === 0 ? (
          <p className="text-gray-500 text-sm">No processes added yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="py-2 px-3 border-b">Process ID</th>
                  <th className="py-2 px-3 border-b">Arrival Time</th>
                  <th className="py-2 px-3 border-b">Burst Time</th>
                  <th className="py-2 px-3 border-b">Priority</th>
                  <th className="py-2 px-3 border-b">Color</th>
                  <th className="py-2 px-3 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {processes.map((process) => (
                  <tr key={process.id} className="border-b">
                    <td className="py-2 px-3">{process.id}</td>
                    <td className="py-2 px-3">{process.arrivalTime}</td>
                    <td className="py-2 px-3">{process.burstTime}</td>
                    <td className="py-2 px-3">{process.priority || "-"}</td>
                    <td className="py-2 px-3">
                      <div 
                        className="w-6 h-6 rounded-full" 
                        style={{ backgroundColor: process.color }}
                      ></div>
                    </td>
                    <td className="py-2 px-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-800 p-1"
                        onClick={() => removeProcess(process.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessForm;
