import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
  Context
} from "aws-lambda";
import { randomUUID } from "node:crypto";
import {
  createService,
  getService,
  listServices,
  updateServiceHealth
} from "./dynamodb.js";
import { errorResponse, jsonResponse, NotFoundError } from "./errors.js";
import { log } from "./logging.js";
import type { HealthCheckRecord, ServiceRecord } from "./models.js";
import {
  createHealthCheckSchema,
  createServiceSchema,
  parseJsonBody
} from "./validation.js";

export async function handler(
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyStructuredResultV2> {
  const startedAt = Date.now();
  const route = `${event.requestContext.http.method} ${event.rawPath}`;

  try {
    const response = await routeRequest(event);
    log("info", "request_completed", {
      requestId: context.awsRequestId,
      route,
      statusCode: response.statusCode,
      durationMs: Date.now() - startedAt
    });
    return response;
  } catch (error) {
    const response = errorResponse(error);
    log("error", "request_failed", {
      requestId: context.awsRequestId,
      route,
      statusCode: response.statusCode,
      durationMs: Date.now() - startedAt,
      errorName: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : "Unknown error"
    });
    return response;
  }
}

async function routeRequest(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> {
  const method = event.requestContext.http.method;
  const path = event.rawPath;

  if (method === "GET" && path === "/health") {
    return jsonResponse(200, { status: "ok" });
  }

  if (method === "POST" && path === "/services") {
    const input = createServiceSchema.parse(parseJsonBody(event.body ?? null));
    const now = new Date().toISOString();
    const service: ServiceRecord = {
      serviceId: `svc_${randomUUID()}`,
      ...input,
      createdAt: now,
      updatedAt: now
    };

    return jsonResponse(201, { service: await createService(service) });
  }

  if (method === "GET" && path === "/services") {
    return jsonResponse(200, { services: await listServices() });
  }

  const serviceMatch = path.match(/^\/services\/([^/]+)$/);
  if (method === "GET" && serviceMatch) {
    const service = await getRequiredService(serviceMatch[1]);
    return jsonResponse(200, { service });
  }

  const healthMatch = path.match(/^\/services\/([^/]+)\/checks$/);
  if (method === "POST" && healthMatch) {
    await getRequiredService(healthMatch[1]);
    const input = createHealthCheckSchema.parse(parseJsonBody(event.body ?? null));
    const now = new Date().toISOString();
    const latestCheck: HealthCheckRecord = {
      ...input,
      checkedAt: now
    };
    const service = await updateServiceHealth(healthMatch[1], latestCheck, now);
    return jsonResponse(200, { service });
  }

  throw new NotFoundError(`No route for ${method} ${path}`);
}

async function getRequiredService(serviceId: string): Promise<ServiceRecord> {
  const service = await getService(serviceId);
  if (!service) {
    throw new NotFoundError(`Service ${serviceId} was not found`);
  }
  return service;
}
