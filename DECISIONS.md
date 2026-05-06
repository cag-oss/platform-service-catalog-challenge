# Design Decisions

## Lambda, API Gateway, and DynamoDB

I chose Lambda + API Gateway + DynamoDB because the service is lightweight, request-driven, and well suited to unpredictable internal platform usage. This keeps operational overhead low while still allowing strong IAM boundaries, repeatable Terraform deployment, structured logging, and a simple demo experience. ECS Fargate would be a good alternative if the service needed long-running workers, persistent network connections, custom sidecars, or heavier runtime dependencies.

## Manual Terraform Apply Workflow

The deployment workflow is intentionally manual through GitHub Actions `workflow_dispatch`. For a take-home project, that balances automation with operational control: every deploy uses the same pipeline, but infrastructure changes still require an explicit human action. In a larger platform, I would likely evolve this into environment promotion with protected branches, plan review comments on pull requests, and separate AWS roles per environment.
