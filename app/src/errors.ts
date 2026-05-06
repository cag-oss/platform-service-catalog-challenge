import type { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { ZodError } from "zod";
import { ValidationError } from "./validation.js";

export class NotFoundError extends Error {
  public readonly statusCode = 404;

  public constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export function errorResponse(error: unknown): APIGatewayProxyStructuredResultV2 {
  if (error instanceof ZodError) {
    return jsonResponse(400, {
      error: "ValidationError",
      message: "Request failed validation",
      details: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  if (error instanceof ValidationError || error instanceof NotFoundError) {
    return jsonResponse(error.statusCode, {
      error: error.name,
      message: error.message
    });
  }

  return jsonResponse(500, {
    error: "InternalServerError",
    message: "Unexpected service error"
  });
}

export function jsonResponse(
  statusCode: number,
  body: Record<string, unknown>
): APIGatewayProxyStructuredResultV2 {
  return {
    statusCode,
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  };
}
