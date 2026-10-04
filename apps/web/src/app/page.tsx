"use client";

import * as React from "react";
import type { Task, TaskPriority, AITaskBreakdownResponse } from "@repo/types";
import { formatDuration, getPriorityTheme, calculateTaskProgress } from "@repo/utils";

// Pre-seeded tasks for instant interactive experience
const INITIAL_TASKS: Task[] = [
  {
    id: "task_01",
    title: "Deploy Multi-Agent AI Workflow with Gemini 2.5 Flash",
    description: "Integrate Google GenAI SDK and Vercel AI SDK into @app/ai-service worker",
    priority: "urgent",
    status: "in_progress",
    category: "AI & ML",
    estimatedMinutes: 60,
    isAiGenerated: true,
    subtasks: [
      { id: "s1", taskId: "task_01", title: "Configure Gemini API keys and client singleton", completed: true, estimatedMinutes: 10, createdAt: new Date().toISOString() },
      { id: "s2", taskId: "task_01", title: "Build structured JSON output validator with Zod", completed: true, estimatedMinutes: 25, createdAt: new Date().toISOString() },
      { id: "s3", taskId: "task_01", title: "Add streaming endpoint with backoff retries", completed: false, estimatedMinutes: 25, createdAt: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "task_02",
    title: "Design Responsive Web & Mobile Dashboard",
    description: "Craft modern dark glassmorphism UI with real-time stats and smooth task actions",
    priority: "high",
    status: "todo",
    category: "Frontend UI",
    estimatedMinutes: 45,
    isAiGenerated: false,
    subtasks: [
      { id: "s4", taskId: "task_02", title: "Build hero stats counter and KPI cards", completed: true, estimatedMinutes: 15, createdAt: new Date().toISOString() },
      { id: "s5", taskId: "task_02", title: "Implement AI task decomposition modal", completed: false, estimatedMinutes: 30, createdAt: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "task_03",
    title: "Setup Monorepo CI/CD & Turbo Remote Cache",
    description: "Configure GitHub Actions matrix for affected package builds and linting",
    priority: "medium",
    status: "completed",
    category: "DevOps & Cloud",
    estimatedMinutes: 30,
    isAiGenerated: false,
    subtasks: [
      { id: "s6", taskId: "task_03", title: "Create .github/workflows/ci.yml with pnpm cache", completed: true, estimatedMinutes: 15, createdAt: new Date().toISOString() },
      { id: "s7", taskId: "task_03", title: "Test turbo prune docker build", completed: true, estimatedMinutes: 15, createdAt: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function TaskManagerPage() {
  const [tasks, setTasks] = React.useState<Task[]>(INITIAL_TASKS);
  const [newTitle, setNewTitle] = React.useState("");
  const [newCategory, setNewCategory] = React.useState("Core Tasks");
  const [newPriority, setNewPriority] = React.useState<TaskPriority>("medium");
  const [newDuration, setNewDuration] = React.useState(45);
  const [filter, setFilter] = React.useState<"all" | "active" | "completed" | "urgent" | "ai">("all");
  const [search, setSearch] = React.useState("");
  const [expandedTasks, setExpandedTasks] = React.useState<Record<string, boolean>>({ task_01: true, task_02: true });

  // AI Breakdown Modal State
  const [isAiModalOpen, setIsAiModalOpen] = React.useState(false);
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [aiBreakdown, setAiBreakdown] = React.useState<AITaskBreakdownResponse | null>(null);

  // Statistics calculation
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const urgent = tasks.filter((t) => t.priority === "urgent" || t.priority === "high").length;
  const aiCount = tasks.filter((t) => t.isAiGenerated).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Toggle Task Completed
  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextStatus = t.status === "completed" ? "todo" : "completed";
        return {
          ...t,
          status: nextStatus,
          subtasks: t.subtasks.map((s) => ({ ...s, completed: nextStatus === "completed" }))
        };
      })
    );
  };

  // Toggle Individual Subtask
  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = t.subtasks.map((s) =>
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        );
        const allDone = updatedSubtasks.length > 0 && updatedSubtasks.every((s) => s.completed);
        return {
          ...t,
          status: allDone ? "completed" : t.status === "completed" ? "in_progress" : t.status,
          subtasks: updatedSubtasks
        };
      })
    );
  };

  // Delete Task
  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Toggle Subtasks expansion
  const toggleExpand = (taskId: string) => {
    setExpandedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  // Quick Add Simple Task
  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: newTitle.trim(),
      description: "Added via Quick Add",
      priority: newPriority,
      status: "todo",
      category: newCategory,
      estimatedMinutes: Number(newDuration) || 30,
      isAiGenerated: false,
      subtasks: [
        { id: `s_${Date.now()}_1`, taskId: `task_${Date.now()}`, title: "Initial discovery & setup", completed: false, estimatedMinutes: 15, createdAt: new Date().toISOString() },
        { id: `s_${Date.now()}_2`, taskId: `task_${Date.now()}`, title: "Execution & testing", completed: false, estimatedMinutes: 20, createdAt: new Date().toISOString() }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTitle("");
  };

  // Trigger AI Breakdown
  const handleAiBreakdown = async () => {
    const promptTitle = newTitle.trim() || "Automate daily report generation & cloud backup";
    setIsAiLoading(true);
    setIsAiModalOpen(true);

    try {
      // Attempt backend AI service call
      const res = await fetch("http://localhost:8000/api/ai/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: promptTitle })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAiBreakdown(json.data);
      } else {
        throw new Error("Fallback required");
      }
    } catch {
      // Local intelligent heuristic decomposer for standalone preview
      const lower = promptTitle.toLowerCase();
      let category = "Core Tasks";
      let priority: TaskPriority = "medium";
      let estimatedMinutes = 60;
      let subtasks = [
        { title: `Audit existing architecture for "${promptTitle}"`, estimatedMinutes: 15 },
        { title: "Implement foundational logic and API endpoints", estimatedMinutes: 30 },
        { title: "Run end-to-end regression validation and write tests", estimatedMinutes: 15 }
      ];

      if (lower.includes("auth") || lower.includes("security")) {
        category = "Security & Auth";
        priority = "high";
        estimatedMinutes = 80;
        subtasks = [
          { title: "Configure JWT secrets and auth header middleware", estimatedMinutes: 20 },
          { title: "Implement bcrypt password hashing & session token issue", estimatedMinutes: 35 },
          { title: "Add frontend auth guard & login redirect route", estimatedMinutes: 25 }
        ];
      } else if (lower.includes("ai") || lower.includes("model") || lower.includes("llm")) {
        category = "AI Engineering";
        priority = "urgent";
        estimatedMinutes = 75;
        subtasks = [
          { title: "Set up Gemini 2.5 Flash SDK inference client", estimatedMinutes: 20 },
          { title: "Construct prompt template with few-shot guidance", estimatedMinutes: 30 },
          { title: "Validate structured JSON outputs with Zod schemas", estimatedMinutes: 25 }
        ];
      }

      setAiBreakdown({
        suggestedTitle: promptTitle,
        category,
        priority,
        estimatedMinutes,
        subtasks,
        aiTip: "AI Decomposition applied: Milestone tasks structured into 20-30 min focus blocks."
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  // Add Task from AI Breakdown
  const handleApproveAiTask = () => {
    if (!aiBreakdown) return;

    const id = `task_ai_${Date.now()}`;
    const newTask: Task = {
      id,
      title: aiBreakdown.suggestedTitle,
      description: aiBreakdown.aiTip,
      priority: aiBreakdown.priority,
      status: "todo",
      category: aiBreakdown.category,
      estimatedMinutes: aiBreakdown.estimatedMinutes,
      isAiGenerated: true,
      subtasks: aiBreakdown.subtasks.map((s, idx) => ({
        id: `sub_${id}_${idx + 1}`,
        taskId: id,
        title: s.title,
        completed: false,
        estimatedMinutes: s.estimatedMinutes,
        createdAt: new Date().toISOString()
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTasks((prev) => [newTask, ...prev]);
    setExpandedTasks((prev) => ({ ...prev, [id]: true }));
    setIsAiModalOpen(false);
    setAiBreakdown(null);
    setNewTitle("");
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === "active") return t.status !== "completed";
    if (filter === "completed") return t.status === "completed";
    if (filter === "urgent") return t.priority === "urgent" || t.priority === "high";
    if (filter === "ai") return t.isAiGenerated;
    return true;
  });

  return (
    <div className="min-h-screen text-slate-100 p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
              ⚡
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              OmniTask AI
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 ml-2">
              Monorepo Enterprise
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Unified Full-Stack Task Orchestrator & Autonomous AI Decomposer
          </p>
        </div>

        {/* System Architecture Connectivity Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Server :4000
          </span>
          <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            AI Engine :8000
          </span>
          <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 text-slate-300">
            @repo/ui & @repo/database
          </span>
        </div>
      </header>

      {/* KPI Metrics Dashboard */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="glass-panel rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400">Total Work Queue</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold text-white">{total}</span>
            <span className="text-xs text-indigo-400 font-medium">Tasks</span>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-400">Completion Velocity</span>
            <span className="text-xs font-semibold text-emerald-400">{completionRate}%</span>
          </div>
          <div className="mt-3">
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            <span className="text-xs text-slate-500 mt-1 block">{completed} of {total} completed</span>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400">Urgent & High Priority</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold text-rose-400">{urgent}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Needs Attention
            </span>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4 flex flex-col justify-between border-purple-500/30">
          <span className="text-xs font-medium text-purple-300 flex items-center gap-1">
            ✨ AI-Decomposed
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold text-purple-400">{aiCount}</span>
            <span className="text-xs text-purple-300 font-medium">Auto-Planned</span>
          </div>
        </div>
      </section>

      {/* Quick Add Bar & AI Decomposition Trigger */}
      <section className="glass-panel rounded-xl p-4 sm:p-5 mb-8">
        <form onSubmit={handleQuickAdd} className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="What goal or task needs to be accomplished?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAiBreakdown}
                className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium text-sm shadow-lg shadow-purple-500/20 hover:opacity-95 transition-all flex items-center gap-2 whitespace-nowrap active:scale-95"
              >
                <span>✨</span> AI Breakdown
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
              >
                Add Task
              </button>
            </div>
          </div>

          {/* Quick Config Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs pt-1 text-slate-400">
            <span className="text-slate-500">Quick Config:</span>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-300 text-xs focus:outline-none"
            >
              <option value="Core Tasks">Core Tasks</option>
              <option value="Frontend UI">Frontend UI</option>
              <option value="AI & ML">AI & ML</option>
              <option value="DevOps & Cloud">DevOps & Cloud</option>
              <option value="Security & Auth">Security & Auth</option>
            </select>

            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
              className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-300 text-xs focus:outline-none"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>

            <div className="flex items-center gap-1">
              <span>⏱️</span>
              <input
                type="number"
                min={5}
                max={300}
                value={newDuration}
                onChange={(e) => setNewDuration(Number(e.target.value))}
                className="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-center text-slate-200 text-xs"
              />
              <span>mins</span>
            </div>
          </div>
        </form>
      </section>

      {/* Filter Tabs & Search */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900/80 border border-slate-800 text-xs overflow-x-auto">
          {(["all", "active", "completed", "urgent", "ai"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-md font-medium capitalize transition-all whitespace-nowrap ${
                filter === tab
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              {tab === "ai" ? "✨ AI Generated" : tab}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Filter by title or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-900/80 border border-slate-800 rounded-lg px-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-60"
        />
      </section>

      {/* Task Cards List */}
      <section className="space-y-3.5">
        {filteredTasks.length === 0 ? (
          <div className="glass-panel rounded-xl p-12 text-center text-slate-500">
            <span className="text-4xl block mb-2">📋</span>
            <p className="text-base font-medium text-slate-400">No tasks match your filter.</p>
            <p className="text-xs mt-1">Try switching tabs or creating a task with the AI breakdown above.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const priorityTheme = getPriorityTheme(task.priority);
            const progress = calculateTaskProgress(task.subtasks);
            const isExpanded = !!expandedTasks[task.id];
            const isCompleted = task.status === "completed";

            return (
              <div
                key={task.id}
                className={`glass-panel glass-panel-hover rounded-xl p-4 sm:p-5 transition-all ${
                  isCompleted ? "opacity-70 bg-slate-950/40" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left Checkbox & Task Header */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`mt-1 flex-shrink-0 w-5 h-5 rounded border transition-all flex items-center justify-center ${
                        isCompleted
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-slate-600 hover:border-indigo-400 bg-slate-900"
                      }`}
                      aria-label="Toggle completion"
                    >
                      {isCompleted && (
                        <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3
                          className={`text-base font-semibold tracking-tight transition-all ${
                            isCompleted ? "line-through text-slate-500" : "text-white"
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.isAiGenerated && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-medium flex items-center gap-1">
                            ✨ AI Plan
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-400 mb-2.5 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Metadata Badges */}
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className={`px-2 py-0.5 rounded border font-medium ${priorityTheme.bg} ${priorityTheme.border} ${priorityTheme.text}`}>
                          {priorityTheme.label}
                        </span>

                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {task.category}
                        </span>

                        <span className="text-slate-400 text-[11px]">
                          ⏱️ {formatDuration(task.estimatedMinutes)}
                        </span>

                        {task.subtasks.length > 0 && (
                          <button
                            onClick={() => toggleExpand(task.id)}
                            className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium ml-1"
                          >
                            {isExpanded ? "Hide Subtasks" : `Show Subtasks (${task.subtasks.filter((s) => s.completed).length}/${task.subtasks.length})`}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Delete */}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800/80 transition-all text-sm ml-2"
                    title="Delete task"
                  >
                    ✕
                  </button>
                </div>

                {/* Subtasks Checklist */}
                {task.subtasks.length > 0 && isExpanded && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 pl-8 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span>Actionable Steps</span>
                      <span>{progress}% complete</span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-slate-800 mb-3 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    {task.subtasks.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => toggleSubtask(task.id, sub.id)}
                        className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-800/40 cursor-pointer transition-colors text-xs group"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={sub.completed}
                            onChange={() => {}} // handled by parent div click
                            className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                          />
                          <span className={sub.completed ? "line-through text-slate-500" : "text-slate-300"}>
                            {sub.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 group-hover:text-slate-400">
                          {sub.estimatedMinutes}m
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* AI Breakdown Interactive Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-xl rounded-2xl p-6 border border-purple-500/40 shadow-2xl relative">
            <button
              onClick={() => setIsAiModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">✨</span>
              <h2 className="text-lg font-bold text-white">AI Autonomous Task Decomposition</h2>
            </div>

            {isAiLoading ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-purple-300 font-medium animate-pulse">
                  Gemini AI is analyzing objective, estimating milestone intervals, and structuring subtasks...
                </p>
              </div>
            ) : aiBreakdown ? (
              <div className="space-y-4">
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  <h3 className="font-semibold text-white text-base mb-1">{aiBreakdown.suggestedTitle}</h3>
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300">
                      {aiBreakdown.category}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Priority: {aiBreakdown.priority.toUpperCase()}
                    </span>
                    <span className="text-slate-400">
                      Est. Total: {formatDuration(aiBreakdown.estimatedMinutes)}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Generated Action Milestones
                  </h4>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {aiBreakdown.subtasks.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-semibold flex items-center justify-center text-[11px]">
                            {idx + 1}
                          </span>
                          <span className="text-slate-200">{step.title}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 whitespace-nowrap ml-2">
                          {step.estimatedMinutes} min
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-500/20 text-xs text-purple-300">
                  <strong>💡 AI Strategy Tip:</strong> {aiBreakdown.aiTip}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsAiModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApproveAiTask}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/20 hover:opacity-95 transition-all"
                  >
                    Add to Task Board
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
