---
title: "AWS Bedrock Integration Patterns with Claude Code"
date: "2025-10-18"
author: "Maria Rodriguez"
excerpt: "Explore different patterns for integrating Claude Code with AWS Bedrock in production applications."
category: "AWS"
tags: ["AWS", "Bedrock", "Integration", "Patterns"]
published: true
---

# AWS Bedrock Integration Patterns with Claude Code

When building production applications with Claude Code and AWS Bedrock, choosing the right integration pattern is crucial for performance, cost, and reliability. This article explores proven patterns used by successful teams.

## Pattern 1: Direct Integration

The simplest pattern connects Claude Code directly to AWS Bedrock.

### Architecture

```
Claude Code CLI → AWS Bedrock API → Claude Model
```

### When to Use

- Development environments
- Small teams
- Prototype applications
- Low-volume workloads

### Implementation

Configure Claude Code with your AWS credentials:

```bash
export AWS_PROFILE=claude-bedrock
claude-code config set provider bedrock
```

### Pros and Cons

**Pros:**
- Simple setup
- Low latency
- Direct control

**Cons:**
- Limited monitoring
- No request queuing
- Harder to scale

## Pattern 2: API Gateway + Lambda

Route requests through API Gateway and Lambda for better control.

### Architecture

```
Claude Code → API Gateway → Lambda → Bedrock
```

### When to Use

- Production applications
- Need for authentication/authorization
- Request transformation required
- Cost optimization through caching

### Implementation

Create a Lambda function:

```python
import boto3
import json

bedrock = boto3.client('bedrock-runtime')

def handler(event, context):
    body = json.loads(event['body'])

    response = bedrock.invoke_model(
        modelId='anthropic.claude-3-sonnet',
        body=json.dumps({
            'prompt': body['prompt'],
            'max_tokens': body.get('max_tokens', 1000)
        })
    )

    return {
        'statusCode': 200,
        'body': json.dumps(response)
    }
```

Configure API Gateway with:
- Rate limiting
- API key authentication
- Request/response transformation
- CloudWatch logging

### Pros and Cons

**Pros:**
- Better security
- Request throttling
- Caching capabilities
- Detailed monitoring

**Cons:**
- Additional latency
- More complex setup
- Higher cost (API Gateway + Lambda)

## Pattern 3: SQS Queue + Worker Pattern

For batch processing and asynchronous workloads.

### Architecture

```
Claude Code → SQS → Lambda Workers → Bedrock → Results Bucket
```

### When to Use

- Batch processing
- Long-running tasks
- High-volume workloads
- Cost-sensitive applications

### Implementation

```typescript
// Producer: Send requests to SQS
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const sqs = new SQSClient({ region: 'us-east-1' });

async function submitPrompt(prompt: string) {
  await sqs.send(new SendMessageCommand({
    QueueUrl: process.env.QUEUE_URL,
    MessageBody: JSON.stringify({ prompt })
  }));
}

// Consumer: Lambda worker
export async function handler(event: any) {
  for (const record of event.Records) {
    const { prompt } = JSON.parse(record.body);
    const response = await invokeBedrockModel(prompt);
    await saveToS3(response);
  }
}
```

### Pros and Cons

**Pros:**
- Decoupled architecture
- Cost-effective for batch jobs
- Automatic retries
- Scalable

**Cons:**
- Not suitable for real-time
- More complex architecture
- Eventual consistency

## Pattern 4: EventBridge + Step Functions

For complex, multi-step AI workflows.

### Architecture

```
Claude Code → EventBridge → Step Functions → [Bedrock, S3, DynamoDB]
```

### When to Use

- Multi-step AI workflows
- Orchestration required
- Complex error handling
- Audit trail needed

### Implementation

Define a Step Functions state machine:

```json
{
  "StartAt": "InvokeClaude",
  "States": {
    "InvokeClaude": {
      "Type": "Task",
      "Resource": "arn:aws:states:::bedrock:invokeModel",
      "Parameters": {
        "ModelId": "anthropic.claude-3-sonnet",
        "Body": {
          "prompt.$": "$.prompt"
        }
      },
      "Next": "ProcessResponse"
    },
    "ProcessResponse": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:function:ProcessLambda",
      "Next": "SaveResults"
    },
    "SaveResults": {
      "Type": "Task",
      "Resource": "arn:aws:states:::dynamodb:putItem",
      "End": true
    }
  }
}
```

## Choosing the Right Pattern

| Pattern | Latency | Cost | Complexity | Best For |
|---------|---------|------|------------|----------|
| Direct | Low | Low | Low | Development |
| API Gateway | Medium | Medium | Medium | Production APIs |
| SQS Queue | High | Low | Medium | Batch jobs |
| Step Functions | High | Medium | High | Workflows |

## Monitoring and Observability

Regardless of pattern, implement:

1. **CloudWatch Metrics**: Track invocations, latency, errors
2. **X-Ray Tracing**: End-to-end request tracing
3. **CloudWatch Logs**: Detailed logging for debugging
4. **Cost Explorer**: Monitor Bedrock API costs

## Conclusion

Start with direct integration for development, then move to more sophisticated patterns as your application scales. Each pattern has trade-offs—choose based on your specific requirements for latency, cost, and complexity.

## Additional Resources

- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Anthropic Claude on Bedrock](https://aws.amazon.com/bedrock/claude/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
