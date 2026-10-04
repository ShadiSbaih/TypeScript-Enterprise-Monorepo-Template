import { z } from "zod";

// ==========================================
// Base API Envelope & Pagination
// ==========================================
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc")
});
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// ==========================================
// Task Domain Schemas & Types
// ==========================================
export const TaskPrioritySchema = z.enum(["low", "medium", "high", "urgent"]);
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;

export const TaskStatusSchema = z.enum(["todo", "in_progress", "completed", "archived"]);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const SubtaskSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  title: z.string().min(1),
  completed: z.boolean().default(false),
  estimatedMinutes: z.number().int().positive().default(15),
  createdAt: z.string().or(z.date())
});
export type Subtask = z.infer<typeof SubtaskSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().default(""),
  priority: TaskPrioritySchema.default("medium"),
  status: TaskStatusSchema.default("todo"),
  category: z.string().default("General"),
  dueDate: z.string().optional(),
  estimatedMinutes: z.number().int().default(30),
  isAiGenerated: z.boolean().default(false),
  subtasks: z.array(SubtaskSchema).default([]),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date())
});
export type Task = z.infer<typeof TaskSchema>;

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().default(""),
  priority: TaskPrioritySchema.optional().default("medium"),
  status: TaskStatusSchema.optional().default("todo"),
  category: z.string().optional().default("General"),
  dueDate: z.string().optional(),
  estimatedMinutes: z.number().int().optional().default(30),
  isAiGenerated: z.boolean().optional().default(false),
  subtasks: z
    .array(
      z.object({
        title: z.string().min(1),
        estimatedMinutes: z.number().int().optional().default(15)
      })
    )
    .optional()
    .default([])
});
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

export const UpdateTaskSchema = CreateTaskSchema.partial();
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  urgent: number;
  aiGenerated: number;
  completionRate: number;
}

// ==========================================
// AI-Powered Task Feature Schemas
// ==========================================
export const AITaskBreakdownRequestSchema = z.object({
  title: z.string().min(1, "Task description is required"),
  context: z.string().optional(),
  targetMinutes: z.number().optional()
});
export type AITaskBreakdownRequest = z.infer<typeof AITaskBreakdownRequestSchema>;

export const AITaskBreakdownResponseSchema = z.object({
  suggestedTitle: z.string(),
  category: z.string(),
  priority: TaskPrioritySchema,
  estimatedMinutes: z.number(),
  subtasks: z.array(
    z.object({
      title: z.string(),
      estimatedMinutes: z.number()
    })
  ),
  aiTip: z.string()
});
export type AITaskBreakdownResponse = z.infer<typeof AITaskBreakdownResponseSchema>;

// ==========================================
// User & Auth Schemas
// ==========================================
export const UserRoleSchema = z.enum(["admin", "member", "guest"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(2),
  role: UserRoleSchema.default("member"),
  avatarUrl: z.string().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date())
});
export type User = z.infer<typeof UserSchema>;
