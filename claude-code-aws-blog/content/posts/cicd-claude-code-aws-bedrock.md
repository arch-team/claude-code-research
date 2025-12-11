---
title: "CI/CD with Claude Code and AWS Bedrock"
date: "2025-10-24"
author: "AWS Workshop Team"
excerpt: "Integrate Claude Code into your CI/CD pipelines for automated code reviews, documentation generation, and intelligent deployment workflows"
category: "DevOps"
tags: ["AWS", "CI/CD", "GitHub Actions", "Bedrock", "Automation", "CodePipeline"]
published: true
---

# CI/CD with Claude Code and AWS Bedrock

Integrating Claude Code into your CI/CD pipeline transforms traditional automation by adding AI-powered code reviews, intelligent testing, and automated documentation. Combined with AWS Bedrock's enterprise security, you get production-ready AI in your deployment workflows.

## Why AI in CI/CD?

Traditional CI/CD focuses on automation. AI-powered CI/CD adds intelligence:

- **Automated Code Reviews**: Catch bugs before human review
- **Intelligent Test Generation**: Create tests based on code changes
- **Documentation**: Auto-generate and update technical docs
- **Security Scanning**: AI-powered vulnerability detection
- **Deployment Intelligence**: Predict and prevent deployment issues

## Architecture Overview

```
┌──────────────┐
│  Developer   │
│  git push    │
└───────┬──────┘
        │
        ▼
┌────────────────────┐      ┌──────────────┐
│  GitHub Actions    │─────▶│ AWS Bedrock  │
│  Workflow          │      │ Claude 3.5   │
└────────┬───────────┘      └──────────────┘
         │
         ▼
  ┌──────────────┐
  │ Code Review  │
  │ Tests        │
  │ Docs         │
  └──────────────┘
         │
         ▼
  ┌──────────────┐
  │ AWS Services │
  │ (ECS, Lambda)│
  └──────────────┘
```

## Prerequisites

- GitHub repository
- AWS account with Bedrock access
- GitHub Actions enabled
- AWS IAM user for CI/CD

## Step 1: Configure GitHub Secrets

Store AWS credentials securely in GitHub:

```bash
# In your GitHub repository:
# Settings → Secrets and variables → Actions → New repository secret

# Required secrets:
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION  # e.g., us-west-2
ANTHROPIC_API_KEY  # For Claude SDK
```

### IAM Policy for CI/CD

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
      "Resource": "arn:aws:bedrock:*::foundation-model/anthropic.claude-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::ci-artifacts/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

## Step 2: AI-Powered Code Review Workflow

Create `.github/workflows/ai-code-review.yml`:

```yaml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  claude-review:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
      contents: read

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Get changed files
        id: changes
        run: |
          git diff --name-only origin/${{ github.base_ref }}...${{ github.sha }} > changed_files.txt
          echo "files<<EOF" >> $GITHUB_OUTPUT
          cat changed_files.txt >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Claude SDK
        run: npm install @anthropic-ai/sdk

      - name: Run AI Code Review
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ${{ secrets.AWS_REGION }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          node .github/scripts/ai-review.js \
            --pr-number="${{ github.event.pull_request.number }}" \
            --base-sha="${{ github.event.pull_request.base.sha }}" \
            --head-sha="${{ github.event.pull_request.head.sha }}"

      - name: Comment on PR
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review-output.md', 'utf8');
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: review
            });
```

### AI Review Script

Create `.github/scripts/ai-review.js`:

```javascript
const { Anthropic } = require('@anthropic-ai/sdk');
const { BedrockRuntime } = require('@aws-sdk/client-bedrock-runtime');
const fs = require('fs');
const { execSync } = require('child_process');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: 'https://bedrock-runtime.us-west-2.amazonaws.com'
});

async function reviewCode(prNumber, baseSha, headSha) {
  // Get diff
  const diff = execSync(`git diff ${baseSha}...${headSha}`).toString();

  // Call Claude via Bedrock
  const response = await anthropic.messages.create({
    model: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `Review this code diff and provide:
1. Potential bugs or issues
2. Security concerns
3. Performance implications
4. Code quality suggestions
5. Best practices recommendations

Diff:
\`\`\`diff
${diff}
\`\`\`

Format as markdown with specific file:line references.`
    }]
  });

  const review = response.content[0].text;

  // Add AI review header
  const reviewOutput = `## 🤖 AI Code Review (Claude 3.5 Sonnet via AWS Bedrock)

${review}

---
*This review was automatically generated. Please verify suggestions before implementing.*
`;

  fs.writeFileSync('review-output.md', reviewOutput);
}

// Parse arguments
const args = process.argv.slice(2);
const prNumber = args.find(arg => arg.startsWith('--pr-number='))?.split('=')[1];
const baseSha = args.find(arg => arg.startsWith('--base-sha='))?.split('=')[1];
const headSha = args.find(arg => arg.startsWith('--head-sha='))?.split('=')[1];

reviewCode(prNumber, baseSha, headSha)
  .then(() => console.log('Review complete'))
  .catch(err => {
    console.error('Review failed:', err);
    process.exit(1);
  });
```

## Step 3: Automated Documentation

Create `.github/workflows/update-docs.yml`:

```yaml
name: Update Documentation

on:
  push:
    branches: [main]
    paths:
      - 'src/**/*.ts'
      - 'src/**/*.js'

jobs:
  generate-docs:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Generate API documentation
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ${{ secrets.AWS_REGION }}
        run: node .github/scripts/generate-docs.js

      - name: Commit documentation
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add docs/
          git diff --staged --quiet || git commit -m "docs: auto-update API documentation [skip ci]"
          git push
```

## Step 4: Intelligent Test Generation

Create `.github/workflows/generate-tests.yml`:

```yaml
name: Generate Tests

on:
  pull_request:
    types: [labeled]

jobs:
  generate-tests:
    if: contains(github.event.pull_request.labels.*.name, 'needs-tests')
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Get changed files
        id: files
        run: |
          git diff --name-only --diff-filter=AM origin/${{ github.base_ref }} | \
            grep -E '\.(ts|js)$' > new_files.txt

      - name: Generate tests with Claude
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY}}
          AWS_REGION: ${{ secrets.AWS_REGION }}
        run: |
          while IFS= read -r file; do
            node .github/scripts/generate-test.js "$file"
          done < new_files.txt

      - name: Create PR with tests
        uses: peter-evans/create-pull-request@v5
        with:
          commit-message: "test: add AI-generated tests"
          title: "🤖 AI-Generated Tests"
          body: |
            Auto-generated tests for new/modified files.
            Please review and adjust as needed.
          branch: ai-tests-${{ github.event.pull_request.number }}
```

## Step 5: Deployment Intelligence

Create `.github/workflows/smart-deploy.yml`:

```yaml
name: Smart Deployment

on:
  push:
    branches: [main]

jobs:
  pre-deployment-analysis:
    runs-on: ubuntu-latest
    outputs:
      risk-score: ${{ steps.analysis.outputs.risk }}
      recommendations: ${{ steps.analysis.outputs.recommendations }}

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 50  # Get recent history

      - name: Analyze deployment risk
        id: analysis
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ${{ secrets.AWS_REGION }}
        run: |
          node .github/scripts/analyze-deployment.js \
            --commits=10 \
            --output=analysis.json

          RISK=$(jq -r '.riskScore' analysis.json)
          echo "risk=$RISK" >> $GITHUB_OUTPUT

      - name: Upload analysis
        uses: actions/upload-artifact@v4
        with:
          name: deployment-analysis
          path: analysis.json

  deploy:
    needs: pre-deployment-analysis
    if: needs.pre-deployment-analysis.outputs.risk-score < 7
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to ECS
        run: |
          # Your ECS deployment commands
          aws ecs update-service \
            --cluster production \
            --service my-app \
            --force-new-deployment

      - name: Monitor deployment
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ${{ secrets.AWS_REGION }}
        run: |
          node .github/scripts/monitor-deployment.js \
            --duration=300 \
            --alert-on-errors
```

## Security Best Practices

### 1. Use OIDC Instead of Long-lived Credentials

```yaml
permissions:
  id-token: write
  contents: read

steps:
  - name: Configure AWS credentials
    uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::ACCOUNT:role/GitHubActionsRole
      aws-region: us-west-2
```

### 2. Implement Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. Audit Claude Interactions

```javascript
async function auditedBedrockCall(prompt, metadata) {
  const auditLog = {
    timestamp: new Date().toISOString(),
    user: metadata.user,
    action: 'bedrock_invoke',
    prompt_hash: hashPrompt(prompt)
  };

  await logToCloudWatch(auditLog);

  const response = await callBedrock(prompt);

  await logToCloudWatch({
    ...auditLog,
    response_length: response.length,
    tokens_used: response.usage
  });

  return response;
}
```

## Cost Optimization

### Caching Strategies

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 });

async function cachedReview(diff) {
  const cacheKey = crypto.createHash('md5').update(diff).digest('hex');

  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('Using cached review');
    return cached;
  }

  const review = await callClaude(diff);
  cache.set(cacheKey, review);
  return review;
}
```

### Batch Processing

```javascript
async function batchReviews(files) {
  const chunks = chunkArray(files, 10);  // Process 10 at a time

  for (const chunk of chunks) {
    await Promise.all(chunk.map(file => reviewFile(file)));
    await sleep(1000);  // Rate limiting
  }
}
```

## Monitoring and Alerts

### CloudWatch Dashboard

Track key metrics:
- Bedrock invocation count
- Average response time
- Error rates
- Token usage
- Cost per deployment

### Example Alert

```yaml
# cloudwatch-alarm.yml
Type: AWS::CloudWatch::Alarm
Properties:
  AlarmName: HighBedrockCost
  ComparisonOperator: GreaterThanThreshold
  EvaluationPeriods: 1
  MetricName: EstimatedCharges
  Namespace: AWS/Billing
  Period: 21600  # 6 hours
  Statistic: Maximum
  Threshold: 100.0  # Alert if over $100/6hr
  AlarmActions:
    - !Ref SNSTopic
```

## Best Practices

1. **Start small**: Begin with code reviews, then expand
2. **Human oversight**: Always review AI suggestions
3. **Monitor costs**: Set up billing alerts
4. **Test thoroughly**: Verify AI-generated code/tests
5. **Iterate**: Improve prompts based on results
6. **Security first**: Never expose secrets to AI
7. **Audit trails**: Log all AI interactions

## Conclusion

Integrating Claude Code with AWS Bedrock in your CI/CD pipeline adds intelligent automation while maintaining enterprise security and control. Start with code reviews, expand to documentation, and eventually build comprehensive AI-powered deployment workflows.

**Key benefits:**
- Faster code reviews
- Automated documentation
- Intelligent test generation
- Reduced human error
- Cost-effective scaling

**Next steps:**
- Implement code review workflow
- Add custom prompts for your domain
- Monitor and optimize costs
- Expand to additional workflows

---

**Questions?** Join the Claude Code community or AWS Bedrock forums for support and best practices.
