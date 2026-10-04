import { z } from "zod";

// Base Pagination Schema
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc")
});
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

// Generic API Envelope
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

// User Domain Schema
export const UserRoleSchema = z.enum(["admin", "member", "guest"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2),
  role: UserRoleSchema.default("member"),
  avatarUrl: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});
export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = UserSchema.pick({
  email: true,
  name: true,
  role: true
});
export type CreateUserInput = z.infer<typeof CreateUserSchema>;

// Auth Schemas
export const LoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
export type LoginInput = z.infer<typeof LoginInputSchema>;

export interface AuthSession {
  token: string;
  expiresAt: string;
  user: User;
}

// AI Service Domain Schemas
export const AIProviderSchema = z.enum(["google", "openai", "anthropic", "local"]);
export type AIProvider = z.infer<typeof AIProviderSchema>;

export const InferenceRequestSchema = z.object({
  prompt: z.string().min(1),
  provider: AIProviderSchema.default("google"),
  model: z.string().default("gemini-2.5-flash"),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().int().positive().default(1024),
  systemInstruction: z.string().optional()
});
export type InferenceRequest = z.infer<typeof InferenceRequestSchema>;

export const InferenceResponseSchema = z.object({
  id: z.string(),
  content: z.string(),
  model: z.string(),
  provider: AIProviderSchema,
  usage: z.object({
    promptTokens: z.number(),
    completionTokens: z.number(),
    totalTokens: z.number()
  })
});
export type InferenceResponse = z.infer<typeof InferenceResponseSchema>;
