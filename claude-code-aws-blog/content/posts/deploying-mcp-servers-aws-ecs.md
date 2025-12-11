---
title: "Deploying MCP Servers on AWS ECS"
date: "2025-10-23"
author: "AWS Workshop Team"
excerpt: "Learn how to deploy Model Context Protocol (MCP) servers on AWS ECS for scalable, production-ready Claude Code integrations"
category: "Infrastructure"
tags: ["AWS", "ECS", "MCP", "Deployment", "Docker", "Fargate"]
published: true
---

# Deploying MCP Servers on AWS ECS

Model Context Protocol (MCP) servers extend Claude Code's capabilities by providing specialized tools and integrations. While local MCP servers work great for development, production deployments benefit from AWS ECS's scalability and reliability.

## What is MCP?

MCP (Model Context Protocol) is an open protocol that lets Claude Code connect to external tools and data sources. Popular MCP servers include:

- **Playwright**: Browser automation and testing
- **Filesystem**: Secure file operations
- **GitHub**: Repository management
- **Database**: Query execution and schema introspection
- **Custom**: Your own business logic

## Why Deploy on AWS ECS?

### Local vs Cloud MCP Servers

| Aspect | Local MCP | ECS-Hosted MCP |
|--------|-----------|----------------|
| Availability | Requires running machine | 24/7 availability |
| Scaling | Single instance | Auto-scaling |
| Security | Network dependent | VPC isolated |
| Cost | Free (your hardware) | Pay-per-use |
| Maintenance | Manual updates | Automated deployments |

### ECS vs Lambda vs EC2

**Use ECS (Fargate) when:**
- MCP server needs to maintain state
- Long-running connections required
- Container-based deployment preferred
- Auto-scaling needed

**Use Lambda when:**
- Stateless, short-lived requests
- Event-driven architecture
- Minimal infrastructure management

**Use EC2 when:**
- Full control over environment needed
- Very specific hardware requirements
- Cost optimization at scale

## Architecture Overview

```
┌─────────────┐
│ Claude Code │
└──────┬──────┘
       │ HTTPS/WSS
       ▼
┌─────────────────┐
│ Application LB  │
└──────┬──────────┘
       │
       ▼
┌─────────────────────────────┐
│   ECS Fargate Cluster       │
│  ┌──────────────────────┐   │
│  │  MCP Server Task     │   │
│  │  - Container: MCP    │   │
│  │  - Port: 3000        │   │
│  │  - Memory: 512MB     │   │
│  └──────────────────────┘   │
└─────────────────────────────┘
       │
       ▼
┌─────────────────┐
│   AWS Services  │
│ (S3, RDS, etc.) │
└─────────────────┘
```

## Prerequisites

- AWS CLI configured
- Docker installed locally
- ECR repository created
- ECS cluster (we'll create this)

## Step 1: Dockerize Your MCP Server

Create a Dockerfile for your MCP server:

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose MCP port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start MCP server
CMD ["node", "server.js"]
```

**Example MCP server** (`server.js`):

```javascript
const express = require('express');
const { MCPServer } = require('@modelcontextprotocol/sdk');

const app = express();
const mcp = new MCPServer({
  name: 'aws-tools-mcp',
  version: '1.0.0'
});

// Register tools
mcp.addTool({
  name: 'list_s3_buckets',
  description: 'List all S3 buckets',
  parameters: {},
  handler: async () => {
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3();
    const buckets = await s3.listBuckets().promise();
    return buckets.Buckets.map(b => b.Name);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// MCP endpoint
app.use('/mcp', mcp.express());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP server running on port ${PORT}`);
});
```

## Step 2: Push to Amazon ECR

```bash
# Create ECR repository
aws ecr create-repository \
  --repository-name mcp-server \
  --region us-west-2

# Get login token
aws ecr get-login-password --region us-west-2 | \
  docker login --username AWS --password-stdin \
  ACCOUNT_ID.dkr.ecr.us-west-2.amazonaws.com

# Build and tag image
docker build -t mcp-server .
docker tag mcp-server:latest \
  ACCOUNT_ID.dkr.ecr.us-west-2.amazonaws.com/mcp-server:latest

# Push to ECR
docker push ACCOUNT_ID.dkr.ecr.us-west-2.amazonaws.com/mcp-server:latest
```

## Step 3: Create ECS Task Definition

```json
{
  "family": "mcp-server",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "mcp-server",
      "image": "ACCOUNT_ID.dkr.ecr.us-west-2.amazonaws.com/mcp-server:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "AWS_REGION",
          "value": "us-west-2"
        },
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/mcp-server",
          "awslogs-region": "us-west-2",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "node -e \"require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})\""],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ],
  "executionRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::ACCOUNT_ID:role/mcpServerTaskRole"
}
```

Register the task definition:

```bash
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json
```

## Step 4: Create ECS Service

```bash
# Create ECS cluster
aws ecs create-cluster \
  --cluster-name mcp-cluster \
  --region us-west-2

# Create service with load balancer
aws ecs create-service \
  --cluster mcp-cluster \
  --service-name mcp-server-service \
  --task-definition mcp-server \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-zzz],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=mcp-server,containerPort=3000"
```

## Step 5: Configure Claude Code

Update your `.claude/config.json`:

```json
{
  "mcpServers": {
    "aws-tools": {
      "url": "https://mcp.your-domain.com/mcp",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer ${MCP_API_KEY}"
      }
    }
  }
}
```

## Security Best Practices

### 1. Use IAM Task Roles

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject"
      ],
      "Resource": ["arn:aws:s3:::allowed-bucket/*"]
    }
  ]
}
```

### 2. Enable VPC Endpoints

Keep traffic within AWS network:

```bash
aws ec2 create-vpc-endpoint \
  --vpc-id vpc-xxx \
  --service-name com.amazonaws.us-west-2.ecr.dkr \
  --route-table-ids rtb-xxx
```

### 3. Use Secrets Manager

```json
{
  "secrets": [
    {
      "name": "API_KEY",
      "valueFrom": "arn:aws:secretsmanager:us-west-2:ACCOUNT:secret:mcp-api-key"
    }
  ]
}
```

## Cost Optimization

### Fargate Pricing (us-west-2)

- **vCPU**: $0.04048 per vCPU per hour
- **Memory**: $0.004445 per GB per hour

**Example calculation:**

```
0.25 vCPU × $0.04048 = $0.01012/hour
0.5 GB × $0.004445 = $0.002222/hour
Total: $0.012342/hour = ~$9/month per task
```

### Cost-Saving Tips

1. **Right-size resources**: Start small (256 CPU, 512MB memory)
2. **Use Spot Fargate**: 70% discount for fault-tolerant workloads
3. **Auto-scaling**: Scale down during off-hours
4. **CloudWatch alarms**: Alert on unexpected scaling

## Monitoring and Logging

### CloudWatch Dashboard

```bash
aws cloudwatch put-dashboard \
  --dashboard-name MCPServerMetrics \
  --dashboard-body file://dashboard.json
```

### Key Metrics to Monitor

- **Task health**: ECS service health checks
- **CPU/Memory**: CloudWatch Container Insights
- **Request latency**: Application Load Balancer metrics
- **Error rates**: CloudWatch Logs Insights queries

### Example Log Insights Query

```
fields @timestamp, @message
| filter @message like /error/
| stats count() by bin(5m)
```

## Conclusion

Deploying MCP servers on AWS ECS provides production-grade reliability and scalability for Claude Code integrations. With Fargate, you eliminate server management while gaining auto-scaling, security, and cost efficiency.

**Next steps:**
- Set up CI/CD for automated deployments
- Implement custom MCP tools for your domain
- Configure monitoring and alerting
- Optimize for your specific workload

---

**Need help?** Check the [MCP documentation](https://modelcontextprotocol.io) or AWS ECS guides for more details.
