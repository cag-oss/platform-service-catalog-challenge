import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(2).max(80).regex(/^[a-zA-Z0-9][a-zA-Z0-9-_]*$/),
  team: z.string().min(2).max(80),
  environment: z.enum(["dev", "staging", "prod"]),
  repoUrl: z.string().url(),
  healthUrl: z.string().url().optional(),
  tags: z.array(z.string().min(1).max(32)).max(10).default([])
});

export const createHealthCheckSchema = z.object({
  status: z.enum(["healthy", "degraded", "unhealthy"]),
  message: z.string().max(500).optional(),
  version: z.string().max(80).optional()
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type CreateHealthCheckInput = z.infer<typeof createHealthCheckSchema>;

export function parseJsonBody(body: string | null): unknown {
  if (!body) {
    return {};
  }

  try {
    return JSON.parse(body) as unknown;
  } catch {
    throw new ValidationError("Request body must be valid JSON");
  }
}

export class ValidationError extends Error {
  public readonly statusCode = 400;

  public constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
