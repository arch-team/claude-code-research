---
title: "Getting Started with Claude Code on AWS Bedrock"
date: "2025-10-22"
author: "AWS Workshop Team"
excerpt: "Learn how to set up and use Claude Code with AWS Bedrock for intelligent, AI-powered development workflows"
category: "Getting Started"
tags: ["AWS", "Bedrock", "Claude Code", "Tutorial", "IAM", "Setup"]
published: true
---

# Getting Started with Claude Code on AWS Bedrock

AWS Bedrock provides a fully managed service for accessing foundation models like Claude through a simple API. When combined with Claude Code, you get a powerful AI-assisted development environment that integrates seamlessly with your AWS infrastructure.

## What You'll Learn

In this guide, you'll learn how to:
- Set up AWS Bedrock access for Claude Code
- Configure IAM permissions correctly
- Choose the right Claude model for your needs
- Run your first Claude Code session with Bedrock
- Troubleshoot common configuration issues

## Prerequisites

Before you begin, ensure you have:
- An AWS account with appropriate permissions
- AWS CLI installed and configured
- Claude Code installed on your machine
- Basic familiarity with IAM and AWS services

## Understanding AWS Bedrock

AWS Bedrock is a fully managed service that makes foundation models from leading AI companies available through a single API. Key benefits include:

- **No Infrastructure Management**: Bedrock handles scaling, availability, and model updates
- **Enterprise Security**: Data never leaves your AWS environment
- **Cost Control**: Pay only for what you use with no upfront costs
- **Compliance**: Meets AWS compliance standards (HIPAA, GDPR, etc.)

### Claude Models on Bedrock

AWS Bedrock offers several Claude model variants:

| Model | Best For | Context Window | Cost |
|-------|----------|----------------|------|
| Claude 3.5 Sonnet | Complex reasoning, coding | 200K tokens | Medium |
| Claude 3 Opus | Highest capability tasks | 200K tokens | High |
| Claude 3 Haiku | Fast, lightweight tasks | 200K tokens | Low |

For most development workflows, **Claude 3.5 Sonnet** offers the best balance of capability and cost.

## Step 1: Enable Bedrock Access

First, enable model access in your AWS account:

```bash
# Navigate to AWS Bedrock console
aws bedrock list-foundation-models --region us-west-2

# Check available models
aws bedrock list-foundation-models \
  --by-provider anthropic \
  --region us-west-2
```

**In the AWS Console:**
1. Navigate to AWS Bedrock in us-west-2 (Oregon)
2. Go to "Model access" in the left sidebar
3. Click "Enable specific models"
4. Select "Claude 3.5 Sonnet", "Claude 3 Opus", and "Claude 3 Haiku"
5. Submit the request (usually approved instantly)

## Step 2: Configure IAM Permissions

Create an IAM policy that grants Bedrock access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": [
        "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-5-sonnet-*",
        "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-opus-*",
        "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku-*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:ListFoundationModels",
        "bedrock:GetFoundationModel"
      ],
      "Resource": "*"
    }
  ]
}
```

**Attach the policy:**

```bash
# Create the policy
aws iam create-policy \
  --policy-name ClaudeCodeBedrockAccess \
  --policy-document file://bedrock-policy.json

# Attach to your user or role
aws iam attach-user-policy \
  --user-name your-username \
  --policy-arn arn:aws:iam::ACCOUNT-ID:policy/ClaudeCodeBedrockAccess
```

### Security Best Practices

1. **Use IAM Roles**: Prefer roles over access keys when possible
2. **Least Privilege**: Only grant necessary permissions
3. **Enable CloudTrail**: Monitor Bedrock API calls
4. **Use VPC Endpoints**: Keep traffic within AWS network
5. **Rotate Credentials**: Regularly rotate access keys

## Step 3: Configure Claude Code

Update your Claude Code configuration to use Bedrock:

```bash
# Set environment variables
export AWS_REGION=us-west-2
export AWS_PROFILE=your-profile  # or use default

# Verify AWS credentials
aws sts get-caller-identity
```

**In Claude Code settings** (`.claude/config.json`):

```json
{
  "model": {
    "provider": "bedrock",
    "model_id": "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "region": "us-west-2"
  },
  "max_tokens": 4096,
  "temperature": 0.7
}
```

## Step 4: Your First Claude Code Session

Start a new project and initialize Claude Code:

```bash
# Create a new project
mkdir my-aws-project
cd my-aws-project

# Initialize git
git init

# Start Claude Code
claude

# Run your first command
/init
```

Claude will analyze your project and create a `CLAUDE.md` file with context about your codebase.

### Example Session

```
You: I want to create a Lambda function that processes S3 events

Claude: I'll help you create a Lambda function for S3 event processing.
Let me set up the basic structure with proper IAM permissions.

[Claude creates function.py, requirements.txt, and cloudformation template]

You: Add error handling and CloudWatch logging

Claude: I'll add comprehensive error handling and structured logging.

[Claude updates files with try/except blocks and logger configuration]
```

## Step 5: Model Selection Guide

Choose the right Claude model for your task:

### Claude 3.5 Sonnet (Recommended for Most Tasks)
**Best for:**
- General software development
- Code reviews and refactoring
- Architecture design
- Documentation writing
- Complex reasoning tasks

**Example use case:**
```bash
claude --model anthropic.claude-3-5-sonnet-20241022-v2:0
```

### Claude 3 Opus (Highest Capability)
**Best for:**
- Mission-critical code generation
- Complex system architecture
- Security-sensitive applications
- Advanced algorithm development

**When to use:** When you need the absolute best reasoning and code quality, cost is secondary.

### Claude 3 Haiku (Fast & Economical)
**Best for:**
- Simple CRUD operations
- Boilerplate code generation
- Quick code modifications
- Testing and validation scripts

**When to use:** High-volume, straightforward tasks where speed and cost matter more than complexity.

## Troubleshooting Common Issues

### Issue: "AccessDeniedException"

**Cause**: Insufficient IAM permissions

**Solution:**
```bash
# Check current permissions
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::ACCOUNT:user/USERNAME \
  --action-names bedrock:InvokeModel \
  --resource-arns "arn:aws:bedrock:*::foundation-model/anthropic.claude-*"

# Verify model access is enabled
aws bedrock get-foundation-model \
  --model-identifier anthropic.claude-3-5-sonnet-20241022-v2:0 \
  --region us-west-2
```

### Issue: "ModelNotAvailableException"

**Cause**: Model not enabled in your region or account

**Solution:**
1. Check model availability: Navigate to Bedrock console → Model access
2. Enable required models (may take 1-2 minutes)
3. Verify region is us-west-2 (primary Bedrock region)

### Issue: "ThrottlingException"

**Cause**: Exceeded rate limits

**Solution:**
```python
# Implement exponential backoff
import time
from botocore.exceptions import ClientError

def invoke_with_retry(client, **kwargs):
    max_retries = 5
    for attempt in range(max_retries):
        try:
            return client.invoke_model(**kwargs)
        except ClientError as e:
            if e.response['Error']['Code'] == 'ThrottlingException':
                wait_time = (2 ** attempt) + (random.randint(0, 1000) / 1000)
                time.sleep(wait_time)
            else:
                raise
```

### Issue: High Latency

**Causes and solutions:**
- **Region selection**: Use us-west-2 for lowest latency
- **Model choice**: Haiku is fastest, Opus is slowest
- **Streaming**: Enable response streaming for faster perceived response
- **Caching**: Cache common responses when appropriate

## Cost Optimization

### Understanding Bedrock Pricing

Claude on Bedrock pricing (as of 2025):

| Model | Input (per 1K tokens) | Output (per 1K tokens) |
|-------|-----------------------|------------------------|
| Sonnet | $0.003 | $0.015 |
| Opus | $0.015 | $0.075 |
| Haiku | $0.00025 | $0.00125 |

### Cost-Saving Tips

1. **Use Haiku for simple tasks**: 60x cheaper than Opus for output
2. **Optimize context**: Don't send entire codebases, use targeted `@` imports
3. **Cache CLAUDE.md**: Reuse project context across sessions
4. **Set token limits**: Configure `max_tokens` to prevent runaway costs
5. **Monitor usage**: Use AWS Cost Explorer to track Bedrock spending

**Example cost calculation:**

```python
# Estimate cost for a typical development session
input_tokens = 10000  # Code + context
output_tokens = 2000  # Generated code

sonnet_cost = (input_tokens / 1000 * 0.003) + (output_tokens / 1000 * 0.015)
print(f"Cost per request: ${sonnet_cost:.4f}")
# Output: Cost per request: $0.0600

# Daily cost for 50 requests
daily_cost = sonnet_cost * 50
print(f"Daily cost: ${daily_cost:.2f}")
# Output: Daily cost: $3.00
```

## Next Steps

Now that you have Claude Code connected to AWS Bedrock:

1. **Explore advanced features**: Try `/init`, Plan Mode, custom commands
2. **Set up MCP servers**: Extend Claude with tools like Playwright
3. **Configure hooks**: Automate code formatting and validation
4. **Integrate with CI/CD**: Use Claude in your deployment pipelines
5. **Join the community**: Share your Bedrock configurations and tips

### Recommended Reading

- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Claude Model Capabilities](https://www.anthropic.com/claude)
- [IAM Best Practices for Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/security-iam.html)
- [Bedrock Pricing Details](https://aws.amazon.com/bedrock/pricing/)

## Conclusion

AWS Bedrock provides a secure, scalable, and cost-effective way to access Claude's capabilities in your development workflow. With proper IAM configuration and model selection, you can leverage AI-assisted coding while maintaining enterprise security and cost control.

The combination of Claude Code and AWS Bedrock enables:
- **Faster development cycles** with AI assistance
- **Better code quality** through AI reviews and suggestions
- **Enhanced security** with AWS's compliance standards
- **Scalable AI infrastructure** without operational overhead

Start experimenting with Claude Code on Bedrock today, and transform your development workflow with AI-powered assistance that understands AWS services deeply.

---

**Questions or issues?** Share your experiences and ask questions in the AWS Bedrock forum or Claude Code community channels.
