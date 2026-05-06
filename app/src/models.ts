export type ServiceEnvironment = "dev" | "staging" | "prod";
export type ServiceStatus = "healthy" | "degraded" | "unhealthy";

export interface ServiceRecord {
  serviceId: string;
  name: string;
  team: string;
  environment: ServiceEnvironment;
  repoUrl: string;
  healthUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  latestCheck?: HealthCheckRecord;
}

export interface HealthCheckRecord {
  status: ServiceStatus;
  message?: string;
  version?: string;
  checkedAt: string;
}
