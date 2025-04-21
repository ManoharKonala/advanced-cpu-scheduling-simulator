
import React from "react";
import { Process } from "@/lib/schedulers";
import { sampleDatasets } from "@/lib/sampleData";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SampleDataLoaderProps {
  setProcesses: React.Dispatch<React.SetStateAction<Process[]>>;
}

const SampleDataLoader: React.FC<SampleDataLoaderProps> = ({ setProcesses }) => {
  const loadSampleData = (index: number) => {
    if (index >= 0 && index < sampleDatasets.length) {
      setProcesses([...sampleDatasets[index].processes]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Load Sample Data
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {sampleDatasets.map((dataset, index) => (
          <DropdownMenuItem 
            key={index}
            onClick={() => loadSampleData(index)}
          >
            {dataset.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SampleDataLoader;
