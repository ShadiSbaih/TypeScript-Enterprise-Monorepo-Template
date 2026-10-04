import { FastifyPluginAsync } from "fastify";
import { CreateTaskSchema, UpdateTaskSchema, ApiResponse, Task, TaskStats } from "@repo/types";
import { taskStore } from "@repo/database";

export const taskRoutes: FastifyPluginAsync = async (app) => {
  // 1. Get task statistics
  app.get<{ Reply: ApiResponse<TaskStats> }>("/stats", async () => {
    const stats = await taskStore.getStats();
    return { success: true, data: stats };
  });

  // 2. List all tasks (with optional filter)
  app.get<{
    Querystring: { status?: string; priority?: string; category?: string };
    Reply: ApiResponse<Task[]>;
  }>("/", async (request) => {
    const { status, priority, category } = request.query;
    const tasks = await taskStore.getAllTasks({ status, priority, category });
    return { success: true, data: tasks };
  });

  // 3. Get single task
  app.get<{ Params: { id: string }; Reply: ApiResponse<Task> }>("/:id", async (request, reply) => {
    const task = await taskStore.getTaskById(request.params.id);
    if (!task) {
      return reply.status(404).send({
        success: false,
        error: { code: "NOT_FOUND", message: "Task not found" }
      });
    }
    return { success: true, data: task };
  });

  // 4. Create task
  app.post<{ Body: unknown; Reply: ApiResponse<Task> }>("/", async (request, reply) => {
    const parsed = CreateTaskSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid task payload",
          details: parsed.error.format()
        }
      });
    }

    const created = await taskStore.createTask(parsed.data);
    return reply.status(201).send({ success: true, data: created });
  });

  // 5. Update task
  app.patch<{ Params: { id: string }; Body: unknown; Reply: ApiResponse<Task> }>(
    "/:id",
    async (request, reply) => {
      const parsed = UpdateTaskSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Invalid update payload" }
        });
      }

      const updated = await taskStore.updateTask(request.params.id, parsed.data);
      if (!updated) {
        return reply.status(404).send({
          success: false,
          error: { code: "NOT_FOUND", message: "Task not found" }
        });
      }

      return { success: true, data: updated };
    }
  );

  // 6. Toggle task status (todo <-> completed)
  app.patch<{ Params: { id: string }; Reply: ApiResponse<Task> }>(
    "/:id/toggle",
    async (request, reply) => {
      const updated = await taskStore.toggleTaskStatus(request.params.id);
      if (!updated) {
        return reply.status(404).send({
          success: false,
          error: { code: "NOT_FOUND", message: "Task not found" }
        });
      }
      return { success: true, data: updated };
    }
  );

  // 7. Toggle subtask status
  app.patch<{
    Params: { id: string; subtaskId: string };
    Reply: ApiResponse<Task>;
  }>("/:id/subtasks/:subtaskId/toggle", async (request, reply) => {
    const updated = await taskStore.toggleSubtask(request.params.id, request.params.subtaskId);
    if (!updated) {
      return reply.status(404).send({
        success: false,
        error: { code: "NOT_FOUND", message: "Task or subtask not found" }
      });
    }
    return { success: true, data: updated };
  });

  // 8. Delete task
  app.delete<{ Params: { id: string }; Reply: ApiResponse<{ id: string }> }>(
    "/:id",
    async (request, reply) => {
      const deleted = await taskStore.deleteTask(request.params.id);
      if (!deleted) {
        return reply.status(404).send({
          success: false,
          error: { code: "NOT_FOUND", message: "Task not found" }
        });
      }
      return { success: true, data: { id: request.params.id } };
    }
  );
};
