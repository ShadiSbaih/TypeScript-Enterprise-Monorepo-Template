import { FastifyPluginAsync } from "fastify";
import { CreateUserSchema, ApiResponse, User } from "@repo/types";
import { db } from "@repo/database";

export const userRoutes: FastifyPluginAsync = async (app) => {
  // List Users
  app.get<{ Reply: ApiResponse<User[]> }>("/", async (request, reply) => {
    try {
      const users = await db.user.findMany({
        take: 50,
        orderBy: { createdAt: "desc" }
      });
      return { success: true, data: users as unknown as User[] };
    } catch {
      return reply.status(500).send({
        success: false,
        error: { code: "DB_ERROR", message: "Failed to fetch users" }
      });
    }
  });

  // Create User
  app.post<{ Body: unknown; Reply: ApiResponse<User> }>("/", async (request, reply) => {
    const parseResult = CreateUserSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid user payload",
          details: parseResult.error.format()
        }
      });
    }

    try {
      const newUser = await db.user.create({
        data: {
          email: parseResult.data.email,
          name: parseResult.data.name,
          role: parseResult.data.role.toUpperCase() as "ADMIN" | "MEMBER" | "GUEST"
        }
      });
      return reply.status(201).send({
        success: true,
        data: newUser as unknown as User
      });
    } catch {
      return reply.status(500).send({
        success: false,
        error: { code: "CREATE_USER_ERROR", message: "Could not create user" }
      });
    }
  });
};
