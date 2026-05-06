# AI-Assisted Development Workflow

This project was built with Codex as an AI development collaborator. I used the agent to scaffold the TypeScript Lambda service, Terraform modules, CI workflows, documentation, and validation checks, then reviewed and tightened the generated implementation before committing it.

## What Worked Well

- Fast scaffolding for repetitive project structure across app, infrastructure, CI, and documentation.
- Useful first drafts of validation schemas, route handling, Terraform modules, and README demo commands.
- Quick feedback loops while running tests, linting, Lambda packaging, Terraform formatting, validation, and module tests.

## Where I Course-Corrected The AI

- Tightened IAM policies so Lambda permissions are scoped to the specific DynamoDB table and log group.
- Changed the Lambda build to bundle dependencies into a deployable artifact instead of assuming `node_modules` would be present.
- Added Terraform module tests and provider version constraints after the first infrastructure pass.
- Kept the architecture intentionally small to avoid overbuilding the take-home.

## How I Would Improve The Workflow

- Add a CI job that posts Terraform plan summaries on pull requests.
- Add a small integration smoke test that runs against a deployed dev API after Terraform apply.
- Add branch protection so infrastructure deploys require passing checks and human review.
