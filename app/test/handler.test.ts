import type { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/dynamodb.js", () => ({
  createService: vi.fn(async (record: unknown) => record),
  listServices: vi.fn(async () => []),
  getService: vi.fn(async () => undefined),
  updateServiceHealth: vi.fn(async () => undefined),
}));

const { handler } = await import("../src/handler.js");

describe("handler", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns health status", async () => {
    const response = await handler(apiEvent("GET", "/health"), context());

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body ?? "{}")).toEqual({ status: "ok" });
  });

  it("returns 404 for unknown routes", async () => {
    const response = await handler(apiEvent("GET", "/missing"), context());

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body ?? "{}")).toMatchObject({
      error: "NotFoundError",
    });
  });

  it("returns 400 for invalid JSON request bodies", async () => {
    const response = await handler(
      apiEvent("POST", "/services", "{"),
      context(),
    );

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body ?? "{}")).toMatchObject({
      error: "ValidationError",
      message: "Request body must be valid JSON",
    });
  });
});

function apiEvent(
  method: string,
  rawPath: string,
  body?: string,
): APIGatewayProxyEventV2 {
  return {
    version: "2.0",
    routeKey: "$default",
    rawPath,
    rawQueryString: "",
    headers: {},
    requestContext: {
      accountId: "123456789012",
      apiId: "api-id",
      domainName: "example.execute-api.us-east-1.amazonaws.com",
      domainPrefix: "example",
      http: {
        method,
        path: rawPath,
        protocol: "HTTP/1.1",
        sourceIp: "127.0.0.1",
        userAgent: "vitest",
      },
      requestId: "request-id",
      routeKey: "$default",
      stage: "$default",
      time: "07/May/2026:10:00:00 +0000",
      timeEpoch: 1778148000000,
    },
    body,
    isBase64Encoded: false,
  };
}

function context(): Context {
  return {
    awsRequestId: "test-request-id",
  } as unknown as Context;
}
