import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import type { HealthCheckRecord, ServiceRecord } from "./models.js";

const tableName = process.env.SERVICES_TABLE_NAME;

if (!tableName) {
  throw new Error("SERVICES_TABLE_NAME environment variable is required");
}

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function createService(
  record: ServiceRecord,
): Promise<ServiceRecord> {
  await client.send(
    new PutCommand({
      TableName: tableName,
      Item: record,
      ConditionExpression: "attribute_not_exists(serviceId)",
    }),
  );

  return record;
}

export async function listServices(): Promise<ServiceRecord[]> {
  const response = await client.send(
    new ScanCommand({
      TableName: tableName,
      Limit: 100,
    }),
  );

  return (response.Items ?? []) as ServiceRecord[];
}

export async function getService(
  serviceId: string,
): Promise<ServiceRecord | undefined> {
  const response = await client.send(
    new GetCommand({
      TableName: tableName,
      Key: { serviceId },
    }),
  );

  return response.Item as ServiceRecord | undefined;
}

export async function updateServiceHealth(
  serviceId: string,
  latestCheck: HealthCheckRecord,
  updatedAt: string,
): Promise<ServiceRecord | undefined> {
  const response = await client.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { serviceId },
      UpdateExpression:
        "SET latestCheck = :latestCheck, updatedAt = :updatedAt",
      ConditionExpression: "attribute_exists(serviceId)",
      ExpressionAttributeValues: {
        ":latestCheck": latestCheck,
        ":updatedAt": updatedAt,
      },
      ReturnValues: "ALL_NEW",
    }),
  );

  return response.Attributes as ServiceRecord | undefined;
}
