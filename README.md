# ⚙ Advanced CPU Scheduling Simulator

An advanced, interactive, and full-featured CPU Scheduling Simulator built using *Vite, **React, **TypeScript, **TailwindCSS, and **shadcn/ui*. Designed for Computer Science students, educators, and professionals, this tool provides both real-time and step-by-step simulation of core CPU scheduling algorithms, with rich visualizations and performance statistics.

---

## 🚀 Tech Stack

- *Frontend Framework*: [React](https://react.dev/)
- *Build Tool*: [Vite](https://vitejs.dev/)
- *Styling*: [Tailwind CSS](https://tailwindcss.com/)
- *UI Components*: [shadcn/ui](https://ui.shadcn.com/)
- *Language*: TypeScript

---

## 🎯 Features

- 🎛 *Algorithm Selector*  
  Choose from First Come First Serve (FCFS), Shortest Job First (SJF) (Preemptive & Non-Preemptive), Priority Scheduling (Preemptive & Non-Preemptive), and Round Robin.

- ➕ *Add/Delete Processes*  
  Dynamically add or remove processes with attributes like PID, Arrival Time, Burst Time, Priority, and I/O Burst Time.

- 🕒 *Context Switching Time*  
  Option to specify realistic context switch overheads.

- 🔄 *Simulation Modes*  
  - *Instant Execution*: Run the simulation immediately.
  - *Step-by-Step Mode*: Visualize scheduling decisions frame-by-frame.
  - *Multi-Algorithm Comparison*: Analyze performance metrics across multiple algorithms side-by-side.

- 📊 *Gantt Chart Visualization*  
  Dynamic, real-time Gantt chart to visualize process execution timeline.

- 📈 *Statistics Dashboard*  
  Displays average waiting time, turnaround time, response time, throughput, and CPU utilization.

- 📤 *Export Options*  
  Export simulation reports as PDF, CSV, or PNG.

- ♻ *Reset Simulation*  
  Clear the simulation and start over with a fresh setup.

---

## 📁 Folder Structure
- public/
 - index.html
- src/
  - Fix: Handle undefined processId in StepByStepSimulation
-.gitignore
- README.md
- bun.lockb
- components.json
- .eslintrc.config.js
- index.html
- package-lock.json
- package.json
- postcss.config.js
- tailwind.config.ts
- tsconfig.app.json
- tsconfig.json
- tsconfig.node.json
- vite.config.ts

## 🤝 Contributors

- Saurabh
- Manohar
- Lalit Singh

---

## 📜 License

This project is licensed under the [MIT License](LICENSE). See the [LICENSE](LICENSE) file for details.

---

## 📝 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/advanced-cpu-scheduling-simulator.git
   cd advanced-cpu-scheduling-simulator
