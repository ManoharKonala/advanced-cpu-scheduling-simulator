
import { Process } from "./schedulers";

export const sampleDatasets: { name: string; processes: Process[] }[] = [
  {
    name: "Basic Process Set",
    processes: [
      { id: "P1", arrivalTime: 0, burstTime: 8, priority: 3, color: "#9b87f5" },
      { id: "P2", arrivalTime: 1, burstTime: 4, priority: 1, color: "#7E69AB" },
      { id: "P3", arrivalTime: 2, burstTime: 9, priority: 4, color: "#6E59A5" },
      { id: "P4", arrivalTime: 3, burstTime: 5, priority: 2, color: "#D6BCFA" }
    ]
  },
  {
    name: "Staggered Arrivals",
    processes: [
      { id: "P1", arrivalTime: 0, burstTime: 6, priority: 2, color: "#9b87f5" },
      { id: "P2", arrivalTime: 3, burstTime: 2, priority: 1, color: "#7E69AB" },
      { id: "P3", arrivalTime: 5, burstTime: 8, priority: 3, color: "#6E59A5" },
      { id: "P4", arrivalTime: 7, burstTime: 3, priority: 2, color: "#D6BCFA" },
      { id: "P5", arrivalTime: 10, burstTime: 4, priority: 1, color: "#F2FCE2" }
    ]
  },
  {
    name: "Same Arrival Time",
    processes: [
      { id: "P1", arrivalTime: 0, burstTime: 10, priority: 3, color: "#9b87f5" },
      { id: "P2", arrivalTime: 0, burstTime: 5, priority: 1, color: "#7E69AB" },
      { id: "P3", arrivalTime: 0, burstTime: 8, priority: 4, color: "#6E59A5" },
      { id: "P4", arrivalTime: 0, burstTime: 3, priority: 2, color: "#D6BCFA" }
    ]
  },
  {
    name: "Priority Test",
    processes: [
      { id: "P1", arrivalTime: 0, burstTime: 7, priority: 2, color: "#9b87f5" },
      { id: "P2", arrivalTime: 2, burstTime: 4, priority: 1, color: "#7E69AB" },
      { id: "P3", arrivalTime: 4, burstTime: 1, priority: 3, color: "#6E59A5" },
      { id: "P4", arrivalTime: 5, burstTime: 4, priority: 1, color: "#D6BCFA" }
    ]
  },
  {
    name: "Round Robin Test",
    processes: [
      { id: "P1", arrivalTime: 0, burstTime: 10, priority: 1, color: "#9b87f5" },
      { id: "P2", arrivalTime: 0, burstTime: 8, priority: 1, color: "#7E69AB" },
      { id: "P3", arrivalTime: 0, burstTime: 5, priority: 1, color: "#6E59A5" },
      { id: "P4", arrivalTime: 10, burstTime: 9, priority: 1, color: "#D6BCFA" },
      { id: "P5", arrivalTime: 12, burstTime: 4, priority: 1, color: "#F2FCE2" }
    ]
  }
];
