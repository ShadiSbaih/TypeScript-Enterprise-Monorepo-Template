import * as React from "react";
import type { Task, TaskPriority } from "@repo/types";
import { formatDuration, getPriorityTheme } from "@repo/utils";

const INITIAL_MOBILE_TASKS: Task[] = [
  {
    id: "mob_1",
    title: "Sync Mobile Offline Cache with PostgreSQL",
    description: "Use SQLite and React Query for offline-first task operations",
    priority: "high",
    status: "in_progress",
    category: "Mobile",
    estimatedMinutes: 45,
    isAiGenerated: true,
    subtasks: [
      { id: "ms_1", taskId: "mob_1", title: "Setup SQLite table migration", completed: true, estimatedMinutes: 20, createdAt: new Date().toISOString() },
      { id: "ms_2", taskId: "mob_1", title: "Wire offline mutation queue", completed: false, estimatedMinutes: 25, createdAt: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mob_2",
    title: "Implement Push Notifications for Task Due Dates",
    description: "Expo notifications scheduled for high and urgent tasks",
    priority: "urgent",
    status: "todo",
    category: "Notifications",
    estimatedMinutes: 30,
    isAiGenerated: false,
    subtasks: [
      { id: "ms_3", taskId: "mob_2", title: "Request notification permissions", completed: true, estimatedMinutes: 10, createdAt: new Date().toISOString() },
      { id: "ms_4", taskId: "mob_2", title: "Schedule local reminder triggers", completed: false, estimatedMinutes: 20, createdAt: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const HomeScreen: React.FC = () => {
  const [tasks, setTasks] = React.useState<Task[]>(INITIAL_MOBILE_TASKS);
  const [newTitle, setNewTitle] = React.useState("");

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === "completed" ? "todo" : "completed" } : t))
    );
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    const newTask: Task = {
      id: `mob_${Date.now()}`,
      title: newTitle.trim(),
      description: "Created on Mobile client",
      priority: "medium",
      status: "todo",
      category: "Mobile",
      estimatedMinutes: 30,
      isAiGenerated: false,
      subtasks: [
        { id: `ms_${Date.now()}_1`, taskId: `mob_${Date.now()}`, title: "Initial mobile review", completed: false, estimatedMinutes: 15, createdAt: new Date().toISOString() }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks([newTask, ...tasks]);
    setNewTitle("");
  };

  const completedCount = tasks.filter((t) => t.status === "completed").length;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 16, fontFamily: "-apple-system, sans-serif", color: "#f8fafc", backgroundColor: "#0b0f19", minHeight: "100vh" }}>
      {/* Mobile Header */}
      <div style={{ marginBottom: 20, borderBottom: "1px solid #1e293b", paddingBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 11, color: "#818cf8", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              React Native / Expo Client
            </span>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: "4px 0", color: "#ffffff" }}>
              OmniTask Mobile
            </h1>
          </div>
          <span style={{ fontSize: 12, padding: "4px 8px", borderRadius: 12, backgroundColor: "#1e1b4b", color: "#a5b4fc", border: "1px solid #4338ca" }}>
            {completedCount}/{tasks.length} Done
          </span>
        </div>
      </div>

      {/* Quick Input Bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="New mobile task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ flex: 1, padding: "10px 14px", borderRadius: 8, backgroundColor: "#1e293b", border: "1px solid #334155", color: "#fff", fontSize: 14, outline: "none" }}
        />
        <button
          onClick={handleAdd}
          style={{ padding: "10px 16px", borderRadius: 8, backgroundColor: "#4f46e5", color: "#fff", fontWeight: 600, border: "none", cursor: "pointer", fontSize: 14 }}
        >
          Add
        </button>
      </div>

      {/* Task List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {tasks.map((task) => {
          const isDone = task.status === "completed";
          const priority = getPriorityTheme(task.priority);

          return (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              style={{
                backgroundColor: isDone ? "#0f172a80" : "#1e293b",
                border: "1px solid #334155",
                borderRadius: 12,
                padding: 14,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    border: isDone ? "2px solid #10b981" : "2px solid #64748b",
                    backgroundColor: isDone ? "#10b981" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 12,
                    marginTop: 2
                  }}
                >
                  {isDone ? "✓" : ""}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, textDecoration: isDone ? "line-through" : "none", color: isDone ? "#64748b" : "#f1f5f9" }}>
                      {task.title}
                    </h3>
                  </div>

                  <p style={{ margin: "4px 0 8px 0", fontSize: 12, color: "#94a3b8" }}>
                    {task.description}
                  </p>

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, backgroundColor: "#334155", color: "#e2e8f0" }}>
                      {priority.label}
                    </span>
                    <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, backgroundColor: "#1e1b4b", color: "#a5b4fc" }}>
                      {task.category}
                    </span>
                    <span style={{ fontSize: 10, color: "#64748b" }}>
                      ⏱️ {formatDuration(task.estimatedMinutes)}
                    </span>
                    {task.isAiGenerated && (
                      <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, backgroundColor: "#581c87", color: "#e9d5ff" }}>
                        ✨ AI
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
