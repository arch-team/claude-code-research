# CI/CD Pipeline with Claude Code and AWS Bedrock

This diagram shows the complete CI/CD workflow integrating Claude Code for automated code reviews, testing, and deployment.

## Full CI/CD Pipeline

```mermaid
graph TB
    subgraph "Developer Workflow"
        DEV[Developer<br/>git push]
        PR[Create Pull Request]
    end

    subgraph "GitHub Actions"
        subgraph "Pre-Deployment"
            TRIGGER[Workflow Trigger]
            CHECKOUT[Checkout Code]
            DIFF[Get Code Diff]
        end

        subgraph "AI Analysis"
            CLAUDE[Claude Code Review<br/>via Bedrock]
            TESTS[Generate Tests<br/>via Claude]
            SECURITY[Security Scan<br/>AI-powered]
        end

        subgraph "Quality Gates"
            UNIT[Unit Tests]
            LINT[Linters]
            BUILD[Build]
            RISK[Risk Analysis]
        end

        subgraph "Deployment"
            DEPLOY[Deploy to ECS]
            MONITOR[Monitor Metrics]
            VALIDATE[Validate Deployment]
        end

        subgraph "Feedback"
            COMMENT[Comment on PR]
            STATUS[Update Status]
            ALERT[Send Alerts]
        end
    end

    subgraph "AWS Services"
        subgraph "Bedrock"
            BR[Bedrock API]
            MODEL[Claude 3.5 Sonnet]
        end

        subgraph "Infrastructure"
            ECS[Amazon ECS]
            CW[CloudWatch]
            S3[S3 Artifacts]
        end
    end

    DEV -->|Push| PR
    PR -->|Trigger| TRIGGER
    TRIGGER --> CHECKOUT
    CHECKOUT --> DIFF

    DIFF -->|Send Diff| CLAUDE
    CLAUDE -->|Call| BR
    BR -->|Invoke| MODEL
    MODEL -->|Analysis| CLAUDE

    CLAUDE -->|Generate| TESTS
    TESTS -->|Create| UNIT

    DIFF -->|Scan| SECURITY
    SECURITY -->|Call| BR

    UNIT --> BUILD
    LINT --> BUILD
    BUILD -->|Pass| RISK

    RISK -->|Call| BR
    RISK -->|Low Risk| DEPLOY
    RISK -->|High Risk| ALERT

    DEPLOY --> ECS
    DEPLOY -->|Logs| CW
    DEPLOY -->|Artifacts| S3

    ECS --> MONITOR
    MONITOR --> VALIDATE
    VALIDATE -->|Success| COMMENT
    VALIDATE -->|Failure| ALERT

    COMMENT --> STATUS

    style DEV fill:#FF9900
    style PR fill:#FF9900
    style CLAUDE fill:#146EB4
    style TESTS fill:#146EB4
    style SECURITY fill:#146EB4
    style RISK fill:#146EB4
    style BR fill:#232F3E,color:#fff
    style MODEL fill:#232F3E,color:#fff
    style ECS fill:#232F3E,color:#fff
```

## GitHub Actions Workflow Stages

```mermaid
graph LR
    A[Code Push] -->|Trigger| B[AI Code Review]
    B -->|Generate| C[Test Creation]
    C -->|Run| D[Quality Gates]
    D -->|Analyze| E[Risk Assessment]
    E -->|Low Risk| F[Deploy]
    E -->|High Risk| G[Manual Approval]
    G -->|Approved| F
    F -->|Monitor| H[Validation]

    style A fill:#FF9900
    style B fill:#146EB4
    style C fill:#146EB4
    style E fill:#146EB4
    style D fill:#232F3E,color:#fff
    style F fill:#232F3E,color:#fff
    style H fill:#232F3E,color:#fff
```

## AI Code Review Flow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant GH as GitHub
    participant GA as GitHub Actions
    participant BR as AWS Bedrock
    participant CL as Claude Model

    Dev->>GH: Push code / Open PR
    GH->>GA: Trigger workflow
    GA->>GA: Checkout code
    GA->>GA: Generate diff
    GA->>BR: Send diff for review
    BR->>CL: Invoke Claude model
    CL->>CL: Analyze code
    CL-->>BR: Return analysis
    BR-->>GA: Review results
    GA->>GA: Format markdown
    GA->>GH: Post PR comment
    GH->>Dev: Notification
```

## Risk Analysis Decision Tree

```mermaid
graph TB
    START[Analyze Deployment] -->|Check| CHANGES{Code Changes}

    CHANGES -->|Database Schema| HIGH[High Risk<br/>Score: 8-10]
    CHANGES -->|Auth/Security| HIGH
    CHANGES -->|Core APIs| MED[Medium Risk<br/>Score: 5-7]
    CHANGES -->|UI Components| LOW[Low Risk<br/>Score: 1-4]
    CHANGES -->|Documentation| LOW

    HIGH -->|Require| MANUAL[Manual Approval]
    MED -->|Optional| AUTO[Auto Deploy]
    LOW -->|Proceed| AUTO

    MANUAL -->|Approved| DEPLOY[Deploy]
    AUTO --> DEPLOY

    DEPLOY -->|Monitor| METRICS{Metrics OK?}
    METRICS -->|Yes| SUCCESS[Deployment Success]
    METRICS -->|No| ROLLBACK[Auto Rollback]

    style START fill:#FF9900
    style HIGH fill:#d32f2f,color:#fff
    style MED fill:#f57c00,color:#fff
    style LOW fill:#388e3c,color:#fff
    style DEPLOY fill:#232F3E,color:#fff
    style SUCCESS fill:#388e3c,color:#fff
    style ROLLBACK fill:#d32f2f,color:#fff
```

## Security Scanning Integration

```mermaid
graph TB
    subgraph "Security Pipeline"
        CODE[Code Changes]

        subgraph "AI-Powered Scans"
            CLAUDE_SEC[Claude Security Review]
            PATTERN[Pattern Detection]
            VULN[Vulnerability Analysis]
        end

        subgraph "Traditional Scans"
            SAST[SAST Tools]
            DEPS[Dependency Check]
            SECRETS[Secret Scanning]
        end

        subgraph "Results"
            CRITICAL[Critical Issues]
            HIGH[High Priority]
            MEDIUM[Medium Priority]
            LOW[Low Priority]
        end
    end

    CODE --> CLAUDE_SEC
    CODE --> PATTERN
    CODE --> VULN
    CODE --> SAST
    CODE --> DEPS
    CODE --> SECRETS

    CLAUDE_SEC --> CRITICAL
    CLAUDE_SEC --> HIGH
    PATTERN --> HIGH
    VULN --> MEDIUM
    SAST --> HIGH
    DEPS --> CRITICAL
    SECRETS --> CRITICAL

    CRITICAL -->|Block| FAIL[Deployment Blocked]
    HIGH -->|Review| REVIEW[Manual Review]
    MEDIUM -->|Log| PASS[Deploy with Warning]
    LOW -->|Track| PASS

    style CODE fill:#FF9900
    style CLAUDE_SEC fill:#146EB4
    style PATTERN fill:#146EB4
    style VULN fill:#146EB4
    style CRITICAL fill:#d32f2f,color:#fff
    style FAIL fill:#d32f2f,color:#fff
```

## Automated Testing Flow

```mermaid
graph LR
    A[Code Changes] -->|Analyze| B[Claude Generates Tests]
    B -->|Create| C[Test Files]
    C -->|Run| D[Test Execution]
    D -->|Results| E{All Pass?}
    E -->|Yes| F[Proceed to Build]
    E -->|No| G[Create GitHub Issue]
    G -->|Assign| H[Developer]
    H -->|Fix| A

    style A fill:#FF9900
    style B fill:#146EB4
    style C fill:#232F3E,color:#fff
    style D fill:#232F3E,color:#fff
    style F fill:#388e3c,color:#fff
    style G fill:#d32f2f,color:#fff
```

## Deployment Monitoring

```mermaid
graph TB
    subgraph "Deployment Phase"
        START[Start Deployment]
        BLUE[Blue Environment<br/>Current]
        GREEN[Green Environment<br/>New]
    end

    subgraph "Health Checks"
        HTTP[HTTP 200 Check]
        API[API Endpoints]
        METRICS[Key Metrics]
    end

    subgraph "Decision"
        PASS{Healthy?}
        SWITCH[Switch Traffic]
        ROLLBACK[Rollback]
    end

    subgraph "Monitoring"
        CW[CloudWatch<br/>Metrics]
        ERRORS[Error Rate]
        LATENCY[Latency]
        TRAFFIC[Traffic]
    end

    START --> GREEN
    GREEN --> HTTP
    GREEN --> API
    GREEN --> METRICS

    HTTP --> PASS
    API --> PASS
    METRICS --> PASS

    PASS -->|Yes| SWITCH
    PASS -->|No| ROLLBACK

    SWITCH --> CW
    ROLLBACK --> BLUE

    CW --> ERRORS
    CW --> LATENCY
    CW --> TRAFFIC

    ERRORS -->|Spike| ROLLBACK
    LATENCY -->|High| ROLLBACK

    style START fill:#FF9900
    style GREEN fill:#388e3c,color:#fff
    style BLUE fill:#146EB4
    style SWITCH fill:#388e3c,color:#fff
    style ROLLBACK fill:#d32f2f,color:#fff
    style CW fill:#232F3E,color:#fff
```

## Cost Optimization Strategy

```mermaid
graph TB
    OPT[Cost Optimization]

    subgraph "Caching"
        CACHE1[Cache Review Results]
        CACHE2[Reuse Test Generations]
        CACHE3[Store Analysis]
    end

    subgraph "Smart Triggers"
        TRIG1[Skip on Docs-Only]
        TRIG2[Partial on UI-Only]
        TRIG3[Full on Core Changes]
    end

    subgraph "Model Selection"
        MOD1[Haiku for Simple Tasks]
        MOD2[Sonnet for Reviews]
        MOD3[Opus for Complex Only]
    end

    subgraph "Batch Processing"
        BATCH1[Group Similar Files]
        BATCH2[Parallel Reviews]
        BATCH3[Rate Limiting]
    end

    OPT --> CACHE1
    OPT --> CACHE2
    OPT --> CACHE3
    OPT --> TRIG1
    OPT --> TRIG2
    OPT --> TRIG3
    OPT --> MOD1
    OPT --> MOD2
    OPT --> MOD3
    OPT --> BATCH1
    OPT --> BATCH2
    OPT --> BATCH3

    style OPT fill:#FF9900
    style CACHE1 fill:#146EB4
    style CACHE2 fill:#146EB4
    style CACHE3 fill:#146EB4
    style TRIG3 fill:#232F3E,color:#fff
    style MOD2 fill:#232F3E,color:#fff
```

## Usage in Workshop

This diagram is referenced in:
- **Blog Post 3**: CI/CD with Claude Code and AWS Bedrock
- **Exercise 009**: Understanding GitHub integration

Students can use this to:
- Understand complete CI/CD pipeline with AI integration
- Identify decision points and automation opportunities
- Plan security scanning integration
- Design deployment strategies with risk assessment
- Implement cost-effective AI workflows

## Key Metrics to Track

1. **Code Quality**:
   - Bugs caught by AI vs human review
   - Time to review (AI vs manual)
   - False positive rate

2. **Deployment**:
   - Deployment frequency
   - Lead time for changes
   - Mean time to recovery (MTTR)
   - Change failure rate

3. **Cost**:
   - Bedrock API calls per deployment
   - Token usage trends
   - Cost per review/test generation

4. **Security**:
   - Vulnerabilities detected
   - Mean time to remediate
   - Security scan coverage
