
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const WelcomeGuide = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Show guide only on first visit
    const hasSeenGuide = localStorage.getItem("cpu-scheduler-seen-guide");
    if (!hasSeenGuide) {
      setOpen(true);
      localStorage.setItem("cpu-scheduler-seen-guide", "true");
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Welcome to CPU Scheduling Simulator</DialogTitle>
          <DialogDescription>
            This tool helps you visualize and understand how different CPU scheduling algorithms work.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="font-medium">Getting Started</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Add processes with their arrival time, burst time, and priority</li>
              <li>Select a scheduling algorithm (FCFS, SJF, Priority, Round Robin)</li>
              <li>Configure algorithm options (preemptive mode, time quantum, etc.)</li>
              <li>Click "Run Simulation" to see the results</li>
            </ol>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Simulation Modes</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><span className="font-medium">Instant:</span> See all results immediately</li>
              <li><span className="font-medium">Step-by-Step:</span> Watch the scheduling unfold over time</li>
              <li><span className="font-medium">Comparison:</span> Compare all algorithms side by side</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Pro Tip</h3>
            <p className="text-sm">Use the "Load Sample Data" button to quickly test different algorithms with pre-configured process sets.</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Get Started</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeGuide;
