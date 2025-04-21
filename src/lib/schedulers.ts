
// CPU Scheduling Algorithms Implementation

export type Process = {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
  ioBurstTime?: number;
  color?: string;
  remainingTime?: number;
  startTime?: number;
  completionTime?: number;
  waitingTime?: number;
  turnaroundTime?: number;
  responseTime?: number;
};

export type GanttChartItem = {
  processId: string;
  startTime: number;
  endTime: number;
  color?: string;
};

export type SchedulerResult = {
  ganttChart: GanttChartItem[];
  processes: Process[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
  cpuUtilization: number;
  throughput: number;
};

// First-Come-First-Serve (FCFS) Algorithm
export function fcfs(
  processes: Process[],
  contextSwitchTime = 0
): SchedulerResult {
  // Sort processes by arrival time
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const result: SchedulerResult = {
    ganttChart: [],
    processes: [],
    averageWaitingTime: 0,
    averageTurnaroundTime: 0,
    averageResponseTime: 0,
    cpuUtilization: 0,
    throughput: 0,
  };

  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let totalBurstTime = 0;

  sortedProcesses.forEach((process, index) => {
    const processWithMetrics = { ...process };
    
    // If current time is less than arrival time, update current time
    if (currentTime < process.arrivalTime) {
      currentTime = process.arrivalTime;
    }

    // Calculate start time, completion time, waiting time, and turnaround time
    processWithMetrics.startTime = currentTime;
    processWithMetrics.responseTime = currentTime - process.arrivalTime;
    processWithMetrics.completionTime = currentTime + process.burstTime;
    processWithMetrics.waitingTime = currentTime - process.arrivalTime;
    processWithMetrics.turnaroundTime = processWithMetrics.completionTime - process.arrivalTime;

    // Add to gantt chart
    result.ganttChart.push({
      processId: process.id,
      startTime: currentTime,
      endTime: processWithMetrics.completionTime,
      color: process.color,
    });

    // Update current time
    currentTime = processWithMetrics.completionTime;
    
    // Add context switch time if not the last process
    if (index < sortedProcesses.length - 1) {
      currentTime += contextSwitchTime;
    }

    // Update totals
    totalWaitingTime += processWithMetrics.waitingTime;
    totalTurnaroundTime += processWithMetrics.turnaroundTime;
    totalResponseTime += processWithMetrics.responseTime;
    totalBurstTime += process.burstTime;

    result.processes.push(processWithMetrics);
  });

  // Calculate averages
  result.averageWaitingTime = totalWaitingTime / sortedProcesses.length;
  result.averageTurnaroundTime = totalTurnaroundTime / sortedProcesses.length;
  result.averageResponseTime = totalResponseTime / sortedProcesses.length;
  
  const totalExecutionTime = currentTime;
  result.cpuUtilization = (totalBurstTime / totalExecutionTime) * 100;
  result.throughput = sortedProcesses.length / totalExecutionTime;

  return result;
}

// Shortest Job First (SJF) Non-Preemptive Algorithm
export function sjfNonPreemptive(
  processes: Process[],
  contextSwitchTime = 0
): SchedulerResult {
  const processesWithRemaining = processes.map(process => ({
    ...process,
    remainingTime: process.burstTime
  }));
  
  const result: SchedulerResult = {
    ganttChart: [],
    processes: [],
    averageWaitingTime: 0,
    averageTurnaroundTime: 0,
    averageResponseTime: 0,
    cpuUtilization: 0,
    throughput: 0,
  };

  let currentTime = 0;
  let completed = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let totalBurstTime = 0;
  
  const processesWithMetrics = processes.map(p => ({ 
    ...p, 
    startTime: undefined,
    completionTime: undefined,
    waitingTime: undefined,
    turnaroundTime: undefined,
    responseTime: undefined,
    remainingTime: p.burstTime
  }));

  while (completed < processes.length) {
    let selectedProcess: Process | null = null;
    let shortestBurst = Number.MAX_VALUE;

    // Find process with shortest burst time that has arrived
    for (const process of processesWithRemaining) {
      if (
        process.arrivalTime <= currentTime && 
        process.remainingTime! > 0 && 
        process.remainingTime! < shortestBurst
      ) {
        shortestBurst = process.remainingTime!;
        selectedProcess = process;
      }
    }

    // If no process is found, increment time
    if (!selectedProcess) {
      currentTime++;
      continue;
    }

    // Get the process from processesWithMetrics
    const selectedIndex = processesWithMetrics.findIndex(p => p.id === selectedProcess!.id);
    const processWithMetrics = processesWithMetrics[selectedIndex];

    // Set start time if not set
    if (processWithMetrics.startTime === undefined) {
      processWithMetrics.startTime = currentTime;
      processWithMetrics.responseTime = currentTime - processWithMetrics.arrivalTime;
    }

    // Execute the process
    result.ganttChart.push({
      processId: selectedProcess.id,
      startTime: currentTime,
      endTime: currentTime + selectedProcess.remainingTime!,
      color: selectedProcess.color,
    });

    // Update times
    currentTime += selectedProcess.remainingTime!;
    processWithMetrics.completionTime = currentTime;
    processWithMetrics.turnaroundTime = processWithMetrics.completionTime - processWithMetrics.arrivalTime;
    processWithMetrics.waitingTime = processWithMetrics.turnaroundTime - processWithMetrics.burstTime;
    
    // Add context switch time
    if (completed < processes.length - 1) {
      currentTime += contextSwitchTime;
    }

    // Update totals
    totalWaitingTime += processWithMetrics.waitingTime;
    totalTurnaroundTime += processWithMetrics.turnaroundTime;
    totalResponseTime += processWithMetrics.responseTime;
    totalBurstTime += processWithMetrics.burstTime;

    // Mark as completed
    processesWithRemaining.find(p => p.id === selectedProcess!.id)!.remainingTime = 0;
    completed++;
  }

  // Update result with completed processes
  result.processes = processesWithMetrics;
  
  // Calculate averages
  result.averageWaitingTime = totalWaitingTime / processes.length;
  result.averageTurnaroundTime = totalTurnaroundTime / processes.length;
  result.averageResponseTime = totalResponseTime / processes.length;
  
  const totalExecutionTime = currentTime;
  result.cpuUtilization = (totalBurstTime / totalExecutionTime) * 100;
  result.throughput = processes.length / totalExecutionTime;

  return result;
}

// Shortest Job First (SJF) Preemptive Algorithm (Shortest Remaining Time First)
export function sjfPreemptive(
  processes: Process[],
  contextSwitchTime = 0
): SchedulerResult {
  const processesWithRemaining = processes.map(process => ({
    ...process,
    remainingTime: process.burstTime
  }));
  
  const result: SchedulerResult = {
    ganttChart: [],
    processes: [],
    averageWaitingTime: 0,
    averageTurnaroundTime: 0,
    averageResponseTime: 0,
    cpuUtilization: 0,
    throughput: 0,
  };

  let currentTime = 0;
  let completedProcesses = 0;
  let prevProcess: Process | null = null;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let totalBurstTime = 0;
  
  const processesWithMetrics = processes.map(p => ({ 
    ...p, 
    startTime: undefined,
    completionTime: undefined,
    waitingTime: undefined,
    turnaroundTime: undefined,
    responseTime: undefined,
    remainingTime: p.burstTime
  }));

  // Find the minimum arrival time
  const minArrivalTime = Math.min(...processes.map(p => p.arrivalTime));
  currentTime = minArrivalTime;

  while (completedProcesses < processes.length) {
    let selectedProcess: Process | null = null;
    let shortestRemaining = Number.MAX_VALUE;

    // Find the process with the shortest remaining time that has arrived
    for (const process of processesWithRemaining) {
      if (
        process.arrivalTime <= currentTime && 
        process.remainingTime! > 0 && 
        process.remainingTime! < shortestRemaining
      ) {
        shortestRemaining = process.remainingTime!;
        selectedProcess = process;
      }
    }

    // If no process is found, increment time
    if (!selectedProcess) {
      currentTime++;
      continue;
    }

    // Get the process from processesWithMetrics
    const selectedIndex = processesWithMetrics.findIndex(p => p.id === selectedProcess!.id);
    const processWithMetrics = processesWithMetrics[selectedIndex];

    // Check for context switch
    if (prevProcess && prevProcess.id !== selectedProcess.id) {
      currentTime += contextSwitchTime;
    }

    // Set start time if not set
    if (processWithMetrics.startTime === undefined) {
      processWithMetrics.startTime = currentTime;
      processWithMetrics.responseTime = currentTime - processWithMetrics.arrivalTime;
    }

    // Determine the run time
    let runUntil = currentTime + 1;
    
    // Find the next arrival or completion
    const nextArrival = processesWithRemaining
      .filter(p => p.arrivalTime > currentTime && p.remainingTime! > 0)
      .reduce((min, p) => Math.min(min, p.arrivalTime), Number.MAX_VALUE);
    
    const completionTime = currentTime + selectedProcess.remainingTime!;
    
    if (nextArrival < completionTime && nextArrival !== Number.MAX_VALUE) {
      runUntil = nextArrival;
    } else {
      runUntil = completionTime;
    }

    // Execute the process until next event
    result.ganttChart.push({
      processId: selectedProcess.id,
      startTime: currentTime,
      endTime: runUntil,
      color: selectedProcess.color,
    });

    // Update remaining time
    const executed = runUntil - currentTime;
    selectedProcess.remainingTime! -= executed;
    processWithMetrics.remainingTime! -= executed;

    // Check if process is completed
    if (selectedProcess.remainingTime === 0) {
      completedProcesses++;
      processWithMetrics.completionTime = runUntil;
      processWithMetrics.turnaroundTime = processWithMetrics.completionTime - processWithMetrics.arrivalTime;
      processWithMetrics.waitingTime = processWithMetrics.turnaroundTime - processWithMetrics.burstTime;
      
      // Update totals
      totalWaitingTime += processWithMetrics.waitingTime;
      totalTurnaroundTime += processWithMetrics.turnaroundTime;
      totalResponseTime += processWithMetrics.responseTime!;
      totalBurstTime += processWithMetrics.burstTime;
    }

    prevProcess = selectedProcess;
    currentTime = runUntil;
  }

  // Update result with completed processes
  result.processes = processesWithMetrics;
  
  // Calculate averages
  result.averageWaitingTime = totalWaitingTime / processes.length;
  result.averageTurnaroundTime = totalTurnaroundTime / processes.length;
  result.averageResponseTime = totalResponseTime / processes.length;
  
  const totalExecutionTime = Math.max(...result.processes.map(p => p.completionTime!)) - 
                            Math.min(...result.processes.map(p => p.arrivalTime));
  result.cpuUtilization = (totalBurstTime / totalExecutionTime) * 100;
  result.throughput = processes.length / totalExecutionTime;

  return result;
}

// Priority Scheduling Non-Preemptive Algorithm
export function priorityNonPreemptive(
  processes: Process[],
  contextSwitchTime = 0
): SchedulerResult {
  const processesWithRemaining = processes.map(process => ({
    ...process,
    remainingTime: process.burstTime,
    priority: process.priority ?? Number.MAX_VALUE
  }));
  
  const result: SchedulerResult = {
    ganttChart: [],
    processes: [],
    averageWaitingTime: 0,
    averageTurnaroundTime: 0,
    averageResponseTime: 0,
    cpuUtilization: 0,
    throughput: 0,
  };

  let currentTime = 0;
  let completed = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let totalBurstTime = 0;
  
  const processesWithMetrics = processes.map(p => ({ 
    ...p, 
    startTime: undefined,
    completionTime: undefined,
    waitingTime: undefined,
    turnaroundTime: undefined,
    responseTime: undefined,
    remainingTime: p.burstTime,
    priority: p.priority ?? Number.MAX_VALUE
  }));

  while (completed < processes.length) {
    let selectedProcess: Process | null = null;
    let highestPriority = Number.MAX_VALUE;

    // Find process with highest priority that has arrived
    for (const process of processesWithRemaining) {
      // Lower value = higher priority
      if (
        process.arrivalTime <= currentTime && 
        process.remainingTime! > 0 && 
        process.priority! < highestPriority
      ) {
        highestPriority = process.priority!;
        selectedProcess = process;
      }
    }

    // If no process is found, increment time
    if (!selectedProcess) {
      currentTime++;
      continue;
    }

    // Get the process from processesWithMetrics
    const selectedIndex = processesWithMetrics.findIndex(p => p.id === selectedProcess!.id);
    const processWithMetrics = processesWithMetrics[selectedIndex];

    // Execute the process
    processWithMetrics.startTime = currentTime;
    processWithMetrics.responseTime = currentTime - processWithMetrics.arrivalTime;
    
    result.ganttChart.push({
      processId: selectedProcess.id,
      startTime: currentTime,
      endTime: currentTime + selectedProcess.burstTime,
      color: selectedProcess.color,
    });

    // Update times
    currentTime += selectedProcess.burstTime;
    processWithMetrics.completionTime = currentTime;
    processWithMetrics.turnaroundTime = processWithMetrics.completionTime - processWithMetrics.arrivalTime;
    processWithMetrics.waitingTime = processWithMetrics.turnaroundTime - processWithMetrics.burstTime;
    
    // Add context switch time
    if (completed < processes.length - 1) {
      currentTime += contextSwitchTime;
    }

    // Update totals
    totalWaitingTime += processWithMetrics.waitingTime;
    totalTurnaroundTime += processWithMetrics.turnaroundTime;
    totalResponseTime += processWithMetrics.responseTime;
    totalBurstTime += processWithMetrics.burstTime;

    // Mark as completed
    processesWithRemaining.find(p => p.id === selectedProcess!.id)!.remainingTime = 0;
    completed++;
  }

  // Update result with completed processes
  result.processes = processesWithMetrics;
  
  // Calculate averages
  result.averageWaitingTime = totalWaitingTime / processes.length;
  result.averageTurnaroundTime = totalTurnaroundTime / processes.length;
  result.averageResponseTime = totalResponseTime / processes.length;
  
  const totalExecutionTime = currentTime;
  result.cpuUtilization = (totalBurstTime / totalExecutionTime) * 100;
  result.throughput = processes.length / totalExecutionTime;

  return result;
}

// Priority Scheduling Preemptive Algorithm
export function priorityPreemptive(
  processes: Process[],
  contextSwitchTime = 0
): SchedulerResult {
  const processesWithRemaining = processes.map(process => ({
    ...process,
    remainingTime: process.burstTime,
    priority: process.priority ?? Number.MAX_VALUE
  }));
  
  const result: SchedulerResult = {
    ganttChart: [],
    processes: [],
    averageWaitingTime: 0,
    averageTurnaroundTime: 0,
    averageResponseTime: 0,
    cpuUtilization: 0,
    throughput: 0,
  };

  let currentTime = 0;
  let completedProcesses = 0;
  let prevProcess: Process | null = null;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let totalBurstTime = 0;
  
  const processesWithMetrics = processes.map(p => ({ 
    ...p, 
    startTime: undefined,
    completionTime: undefined,
    waitingTime: undefined,
    turnaroundTime: undefined,
    responseTime: undefined,
    remainingTime: p.burstTime,
    priority: p.priority ?? Number.MAX_VALUE
  }));

  // Find the minimum arrival time
  const minArrivalTime = Math.min(...processes.map(p => p.arrivalTime));
  currentTime = minArrivalTime;

  while (completedProcesses < processes.length) {
    let selectedProcess: Process | null = null;
    let highestPriority = Number.MAX_VALUE;

    // Find the process with the highest priority that has arrived
    for (const process of processesWithRemaining) {
      if (
        process.arrivalTime <= currentTime && 
        process.remainingTime! > 0 && 
        process.priority! < highestPriority
      ) {
        highestPriority = process.priority!;
        selectedProcess = process;
      }
    }

    // If no process is found, increment time
    if (!selectedProcess) {
      currentTime++;
      continue;
    }

    // Get the process from processesWithMetrics
    const selectedIndex = processesWithMetrics.findIndex(p => p.id === selectedProcess!.id);
    const processWithMetrics = processesWithMetrics[selectedIndex];

    // Check for context switch
    if (prevProcess && prevProcess.id !== selectedProcess.id) {
      currentTime += contextSwitchTime;
    }

    // Set start time if not set
    if (processWithMetrics.startTime === undefined) {
      processWithMetrics.startTime = currentTime;
      processWithMetrics.responseTime = currentTime - processWithMetrics.arrivalTime;
    }

    // Determine the run time
    let runUntil = currentTime + 1;
    
    // Find the next arrival or completion
    const nextArrival = processesWithRemaining
      .filter(p => p.arrivalTime > currentTime && p.remainingTime! > 0)
      .reduce((min, p) => Math.min(min, p.arrivalTime), Number.MAX_VALUE);
    
    const completionTime = currentTime + selectedProcess.remainingTime!;
    
    if (nextArrival < completionTime && nextArrival !== Number.MAX_VALUE) {
      runUntil = nextArrival;
    } else {
      runUntil = completionTime;
    }

    // Execute the process until next event
    result.ganttChart.push({
      processId: selectedProcess.id,
      startTime: currentTime,
      endTime: runUntil,
      color: selectedProcess.color,
    });

    // Update remaining time
    const executed = runUntil - currentTime;
    selectedProcess.remainingTime! -= executed;
    processWithMetrics.remainingTime! -= executed;

    // Check if process is completed
    if (selectedProcess.remainingTime === 0) {
      completedProcesses++;
      processWithMetrics.completionTime = runUntil;
      processWithMetrics.turnaroundTime = processWithMetrics.completionTime - processWithMetrics.arrivalTime;
      processWithMetrics.waitingTime = processWithMetrics.turnaroundTime - processWithMetrics.burstTime;
      
      // Update totals
      totalWaitingTime += processWithMetrics.waitingTime;
      totalTurnaroundTime += processWithMetrics.turnaroundTime;
      totalResponseTime += processWithMetrics.responseTime!;
      totalBurstTime += processWithMetrics.burstTime;
    }

    prevProcess = selectedProcess;
    currentTime = runUntil;
  }

  // Update result with completed processes
  result.processes = processesWithMetrics;
  
  // Calculate averages
  result.averageWaitingTime = totalWaitingTime / processes.length;
  result.averageTurnaroundTime = totalTurnaroundTime / processes.length;
  result.averageResponseTime = totalResponseTime / processes.length;
  
  const totalExecutionTime = Math.max(...result.processes.map(p => p.completionTime!)) - 
                            Math.min(...result.processes.map(p => p.arrivalTime));
  result.cpuUtilization = (totalBurstTime / totalExecutionTime) * 100;
  result.throughput = processes.length / totalExecutionTime;

  return result;
}

// Round Robin (RR) Algorithm
export function roundRobin(
  processes: Process[],
  timeQuantum: number,
  contextSwitchTime = 0
): SchedulerResult {
  const processesWithRemaining = processes.map(process => ({
    ...process,
    remainingTime: process.burstTime
  }));
  
  const result: SchedulerResult = {
    ganttChart: [],
    processes: [],
    averageWaitingTime: 0,
    averageTurnaroundTime: 0,
    averageResponseTime: 0,
    cpuUtilization: 0,
    throughput: 0,
  };

  let currentTime = 0;
  let completedProcesses = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let totalBurstTime = 0;
  
  // Create a ready queue
  let readyQueue: Process[] = [];
  
  const processesWithMetrics = processes.map(p => ({ 
    ...p, 
    startTime: undefined,
    completionTime: undefined,
    waitingTime: undefined,
    turnaroundTime: undefined,
    responseTime: undefined,
    remainingTime: p.burstTime
  }));

  // Sort processes by arrival time
  const sortedProcesses = [...processesWithRemaining].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  // Find the minimum arrival time
  currentTime = sortedProcesses[0].arrivalTime;

  // Initialize the ready queue with processes that arrive at the start
  readyQueue = sortedProcesses.filter(p => p.arrivalTime <= currentTime);
  
  let prevProcess: Process | null = null;

  while (completedProcesses < processes.length) {
    // If ready queue is empty, move to the next arrival time
    if (readyQueue.length === 0) {
      const nextArrival = sortedProcesses.find(p => p.arrivalTime > currentTime && p.remainingTime! > 0);
      if (!nextArrival) break; // All processes have been processed
      
      currentTime = nextArrival.arrivalTime;
      readyQueue = sortedProcesses.filter(p => 
        p.arrivalTime <= currentTime && p.remainingTime! > 0
      );
    }

    // Get the next process from the queue
    const currentProcess = readyQueue.shift()!;
    
    // Get the process from processesWithMetrics
    const processIndex = processesWithMetrics.findIndex(p => p.id === currentProcess.id);
    const processWithMetrics = processesWithMetrics[processIndex];

    // Check for context switch
    if (prevProcess && prevProcess.id !== currentProcess.id) {
      currentTime += contextSwitchTime;
    }

    // Set start time if not set
    if (processWithMetrics.startTime === undefined) {
      processWithMetrics.startTime = currentTime;
      processWithMetrics.responseTime = currentTime - processWithMetrics.arrivalTime;
    }

    // Determine execution time for this quantum
    const executionTime = Math.min(timeQuantum, currentProcess.remainingTime!);

    // Execute the process
    result.ganttChart.push({
      processId: currentProcess.id,
      startTime: currentTime,
      endTime: currentTime + executionTime,
      color: currentProcess.color,
    });

    // Update current time and remaining time
    currentTime += executionTime;
    currentProcess.remainingTime! -= executionTime;
    processWithMetrics.remainingTime! -= executionTime;

    // Add new arrivals to ready queue
    const newArrivals = sortedProcesses.filter(p => 
      p.arrivalTime > currentTime - executionTime && 
      p.arrivalTime <= currentTime &&
      p.remainingTime! > 0
    );
    readyQueue.push(...newArrivals);

    // Check if process is completed
    if (currentProcess.remainingTime === 0) {
      completedProcesses++;
      processWithMetrics.completionTime = currentTime;
      processWithMetrics.turnaroundTime = processWithMetrics.completionTime - processWithMetrics.arrivalTime;
      processWithMetrics.waitingTime = processWithMetrics.turnaroundTime - processWithMetrics.burstTime;
      
      // Update totals
      totalWaitingTime += processWithMetrics.waitingTime;
      totalTurnaroundTime += processWithMetrics.turnaroundTime;
      totalResponseTime += processWithMetrics.responseTime!;
      totalBurstTime += processWithMetrics.burstTime;
    } else {
      // If not completed, add back to ready queue
      readyQueue.push(currentProcess);
    }

    prevProcess = currentProcess;
  }

  // Update result with completed processes
  result.processes = processesWithMetrics;
  
  // Calculate averages
  result.averageWaitingTime = totalWaitingTime / processes.length;
  result.averageTurnaroundTime = totalTurnaroundTime / processes.length;
  result.averageResponseTime = totalResponseTime / processes.length;
  
  const totalExecutionTime = Math.max(...result.processes.map(p => p.completionTime!)) - 
                            Math.min(...result.processes.map(p => p.arrivalTime));
  result.cpuUtilization = (totalBurstTime / totalExecutionTime) * 100;
  result.throughput = processes.length / totalExecutionTime;

  return result;
}

// Run an algorithm based on user configuration
export function runScheduler(
  algorithm: string,
  processes: Process[],
  isPreemptive: boolean = false,
  contextSwitchTime: number = 0,
  timeQuantum: number = 1
): SchedulerResult {
  switch (algorithm) {
    case 'FCFS':
      return fcfs(processes, contextSwitchTime);
    case 'SJF':
      return isPreemptive 
        ? sjfPreemptive(processes, contextSwitchTime)
        : sjfNonPreemptive(processes, contextSwitchTime);
    case 'Priority':
      return isPreemptive 
        ? priorityPreemptive(processes, contextSwitchTime)
        : priorityNonPreemptive(processes, contextSwitchTime);
    case 'RR':
      return roundRobin(processes, timeQuantum, contextSwitchTime);
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }
}

// Compare multiple algorithms for the same process set
export function compareAlgorithms(
  processes: Process[],
  contextSwitchTime: number = 0,
  timeQuantum: number = 1
): Record<string, SchedulerResult> {
  return {
    FCFS: fcfs(processes, contextSwitchTime),
    'SJF (Non-Preemptive)': sjfNonPreemptive(processes, contextSwitchTime),
    'SJF (Preemptive)': sjfPreemptive(processes, contextSwitchTime),
    'Priority (Non-Preemptive)': priorityNonPreemptive(processes, contextSwitchTime),
    'Priority (Preemptive)': priorityPreemptive(processes, contextSwitchTime),
    'Round Robin': roundRobin(processes, timeQuantum, contextSwitchTime)
  };
}
