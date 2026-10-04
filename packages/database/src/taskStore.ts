import type { Task, CreateTaskInput, UpdateTaskInput, TaskStats } from "@repo/types";

// In-memory persistent task store for local development & fallback
class InMemoryTaskStore {
  private tasks: Map<string, Task> = new Map();

  constructor() {
    this.seedDefaultTasks();
  }

  private seedDefaultTasks() {
    const defaultTasks: Task[] = [
      {
        id: "task_01",
        title: "Deploy Multi-Agent AI Workflow",
        description: "Integrate Gemini 2.5 Flash and Vercel AI SDK into the worker service",
        priority: "urgent",
        status: "in_progress",
        category: "AI & ML",
        estimatedMinutes: 60,
        isAiGenerated: true,
        subtasks: [
          { id: "sub_1", taskId: "task_01", title: "Set up Gemini API environment variables", completed: true, estimatedMinutes: 10, createdAt: new Date().toISOString() },
          { id: "sub_2", taskId: "task_01", title: "Implement task decomposition chain", completed: true, estimatedMinutes: 25, createdAt: new Date().toISOString() },
          { id: "sub_3", taskId: "task_01", title: "Write end-to-end integration tests", completed: false, estimatedMinutes: 25, createdAt: new Date().toISOString() }
        ],
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "task_02",
        title: "Design Responsive Web & Mobile Dashboard",
        description: "Craft modern glassmorphism UI with real-time stats and smooth task actions",
        priority: "high",
        status: "todo",
        category: "Frontend",
        estimatedMinutes: 45,
        isAiGenerated: false,
        subtasks: [
          { id: "sub_4", taskId: "task_02", title: "Build hero stats counter card", completed: true, estimatedMinutes: 15, createdAt: new Date().toISOString() },
          { id: "sub_5", taskId: "task_02", title: "Implement AI decomposition modal", completed: false, estimatedMinutes: 30, createdAt: new Date().toISOString() }
        ],
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "task_03",
        title: "Setup Monorepo CI/CD & Turbo Remote Cache",
        description: "Configure GitHub Actions matrix for affected builds and linting",
        priority: "medium",
        status: "completed",
        category: "DevOps",
        estimatedMinutes: 30,
        isAiGenerated: false,
        subtasks: [
          { id: "sub_6", taskId: "task_03", title: "Create .github/workflows/ci.yml", completed: true, estimatedMinutes: 15, createdAt: new Date().toISOString() },
          { id: "sub_7", taskId: "task_03", title: "Test turbo prune docker build", completed: true, estimatedMinutes: 15, createdAt: new Date().toISOString() }
        ],
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    for (const t of defaultTasks) {
      this.tasks.set(t.id, t);
    }
  }

  async getAllTasks(filter?: { status?: string; priority?: string; category?: string }): Promise<Task[]> {
    let list = Array.from(this.tasks.values());

    if (filter?.status && filter.status !== "all") {
      list = list.filter((t) => t.status === filter.status);
    }
    if (filter?.priority && filter.priority !== "all") {
      list = list.filter((t) => t.priority === filter.priority);
    }
    if (filter?.category && filter.category !== "all") {
      list = list.filter((t) => t.category.toLowerCase() === filter.category?.toLowerCase());
    }

    // Sort by status (active first) then creation date
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getTaskById(id: string): Promise<Task | null> {
    return this.tasks.get(id) || null;
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    const id = `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const subtasks = (input.subtasks || []).map((s, idx) => ({
      id: `sub_${id}_${idx + 1}`,
      taskId: id,
      title: s.title,
      completed: false,
      estimatedMinutes: s.estimatedMinutes || 15,
      createdAt: now
    }));

    const task: Task = {
      id,
      title: input.title,
      description: input.description || "",
      priority: input.priority || "medium",
      status: input.status || "todo",
      category: input.category || "General",
      dueDate: input.dueDate,
      estimatedMinutes: input.estimatedMinutes || 30,
      isAiGenerated: !!input.isAiGenerated,
      subtasks,
      createdAt: now,
      updatedAt: now
    };

    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, input: UpdateTaskInput): Promise<Task | null> {
    const existing = this.tasks.get(id);
    if (!existing) return null;

    const updated: Task = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString()
    };

    this.tasks.set(id, updated);
    return updated;
  }

  async toggleTaskStatus(id: string): Promise<Task | null> {
    const task = this.tasks.get(id);
    if (!task) return null;

    const nextStatus = task.status === "completed" ? "todo" : "completed";
    task.status = nextStatus;
    task.updatedAt = new Date().toISOString();

    // If marked completed, mark all subtasks completed
    if (nextStatus === "completed") {
      task.subtasks.forEach((s) => (s.completed = true));
    }

    this.tasks.set(id, task);
    return task;
  }

  async toggleSubtask(taskId: string, subtaskId: string): Promise<Task | null> {
    const task = this.tasks.get(taskId);
    if (!task) return null;

    const sub = task.subtasks.find((s) => s.id === subtaskId);
    if (!sub) return null;

    sub.completed = !sub.completed;

    // If all subtasks are completed, mark task completed
    const allDone = task.subtasks.length > 0 && task.subtasks.every((s) => s.completed);
    if (allDone) {
      task.status = "completed";
    } else if (task.status === "completed") {
      task.status = "in_progress";
    }

    task.updatedAt = new Date().toISOString();
    this.tasks.set(taskId, task);
    return task;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getStats(): Promise<TaskStats> {
    const all = Array.from(this.tasks.values());
    const total = all.length;
    const completed = all.filter((t) => t.status === "completed").length;
    const inProgress = all.filter((t) => t.status === "in_progress").length;
    const urgent = all.filter((t) => t.priority === "urgent" || t.priority === "high").length;
    const aiGenerated = all.filter((t) => t.isAiGenerated).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      urgent,
      aiGenerated,
      completionRate
    };
  }
}

export const taskStore = new InMemoryTaskStore();
