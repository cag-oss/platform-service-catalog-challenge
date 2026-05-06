import { describe, expect, it } from "vitest";
import { createHealthCheckSchema, createServiceSchema, parseJsonBody } from "../src/validation.js";

describe("createServiceSchema", () => {
  it("accepts a valid service registration", () => {
    const result = createServiceSchema.parse({
      name: "payments-api",
      team: "checkout",
      environment: "prod",
      repoUrl: "https://github.com/example/payments-api",
      healthUrl: "https://payments.example.com/health",
      tags: ["node", "tier-1"]
    });

    expect(result.name).toBe("payments-api");
  });

  it("rejects invalid urls", () => {
    expect(() =>
      createServiceSchema.parse({
        name: "payments-api",
        team: "checkout",
        environment: "prod",
        repoUrl: "not-a-url"
      })
    ).toThrow();
  });
});

describe("createHealthCheckSchema", () => {
  it("allows known service states", () => {
    expect(createHealthCheckSchema.parse({ status: "degraded" }).status).toBe("degraded");
  });

  it("rejects unknown service states", () => {
    expect(() => createHealthCheckSchema.parse({ status: "warming-up" })).toThrow();
  });
});

describe("parseJsonBody", () => {
  it("returns an empty object for missing bodies", () => {
    expect(parseJsonBody(null)).toEqual({});
  });

  it("throws on invalid json", () => {
    expect(() => parseJsonBody("{")).toThrow("valid JSON");
  });
});
