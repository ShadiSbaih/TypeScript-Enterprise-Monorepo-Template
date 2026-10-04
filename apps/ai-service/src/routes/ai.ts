import { FastifyPluginAsync } from "fastify";
import {
  InferenceRequestSchema,
  InferenceResponse,
  ApiResponse
} from "@repo/types";
import { createId } from "@repo/utils";

export const aiRoutes: FastifyPluginAsync = async (app) => {
  // Health
  app.get("/health", async () => {
    return { status: "ready", service: "ai-service" };
  });

  // Inference Generation Endpoint
  app.post<{ Body: unknown; Reply: ApiResponse<InferenceResponse> }>(
    "/generate",
    async (request, reply) => {
      const parsed = InferenceRequestSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          success: false,
          error: {
            code: "INVALID_INFERENCE_PAYLOAD",
            message: "Validation failed for inference request",
            details: parsed.error.format()
          }
        });
      }

      const { prompt, model, provider } = parsed.data;

      // Template Inference Execution Pattern
      // (Production implementations wire @google/genai or OpenAI / Vercel AI SDK here)
      const mockResult: InferenceResponse = {
        id: createId("inf"),
        content: `[${provider.toUpperCase()} / ${model}] Processed prompt: "${prompt}"`,
        model,
        provider,
        usage: {
          promptTokens: prompt.split(" ").length,
          completionTokens: 24,
          totalTokens: prompt.split(" ").length + 24
        }
      };

      return reply.send({
        success: true,
        data: mockResult
      });
    }
  );
};
