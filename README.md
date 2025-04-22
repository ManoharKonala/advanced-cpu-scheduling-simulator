# ⚙️ Advanced CPU Scheduling Simulator

A fully-featured, interactive CPU Scheduling Simulator built with modern web technologies including *Vite*, **React**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**. This tool is designed for Computer Science students, educators, and professionals to simulate and visualize various CPU scheduling algorithms in real-time or step-by-step modes, along with comprehensive performance metrics.

---

## 🚀 Tech Stack

- **Frontend Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Language**: TypeScript

---

## 🎯 Key Features

- 🎛 **Algorithm Selector**  
  Supports core CPU scheduling algorithms:
  - First Come First Serve (FCFS)
  - Shortest Job First (SJF) – Preemptive & Non-Preemptive
  - Priority Scheduling – Preemptive & Non-Preemptive
  - Round Robin (with configurable time quantum)

- ➕ **Add/Delete Processes**  
  Dynamically add or remove processes with attributes like PID, Arrival Time, Burst Time, Priority, and I/O Burst Time.

- 🕒 **Context Switching Time**  
  Option to specify realistic context switch overheads.

- 🔄 **Simulation Modes**  
  - *Instant Execution*: Run the simulation immediately.  
  - *Step-by-Step Mode*: Visualize scheduling decisions frame-by-frame.  
  - *Multi-Algorithm Comparison*: Analyze performance metrics across multiple algorithms side-by-side.

- 📊 **Gantt Chart Visualization**  
  Dynamic, real-time Gantt chart to visualize process execution timeline.

- 📈 **Statistics Dashboard**  
  Displays average waiting time, turnaround time, response time, throughput, and CPU utilization.

- 📤 **Export Options**  
  Export simulation reports as PDF, CSV, or PNG.

- ♻ **Reset Simulation**  
  Clear the simulation and start over with a fresh setup.

---

## 📁 Folder Structure
- public/
- src/
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
- vite.config.ts

  
---

![image](https://github.com/user-attachments/assets/add6c531-34ca-41c1-abcf-469c9e17f31c)



## 🛠 Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/advanced-cpu-scheduling-simulator.git
   cd advanced-cpu-scheduling-simulator

## Contributors
- Saurabh
- Manohar
- Lalit Singh

## 📜 License

This project is licensed under the [MIT License](LICENSE). See the [LICENSE](LICENSE) file for details.
