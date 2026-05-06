type LogLevel = "info" | "warn" | "error";

interface LogFields {
  requestId?: string;
  route?: string;
  statusCode?: number;
  durationMs?: number;
  errorName?: string;
  message?: string;
  [key: string]: unknown;
}

export function log(level: LogLevel, event: string, fields: LogFields = {}): void {
  const record = {
    level,
    event,
    service: "platform-service-catalog",
    timestamp: new Date().toISOString(),
    ...fields
  };

  console.log(JSON.stringify(record));
}
