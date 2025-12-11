# MCP Server Deployment on AWS ECS

This diagram shows the complete architecture for deploying MCP servers on AWS using ECS Fargate.

## Full Architecture

```mermaid
graph TB
    subgraph "Developer Environment"
        DEV[Developer<br/>Claude Code]
    end

    subgraph "AWS Cloud"
        subgraph "Network Layer"
            ALB[Application Load Balancer]
            TG[Target Group]
        end

        subgraph "ECS Cluster"
            subgraph "Fargate Service"
                TASK1[MCP Task 1<br/>Container]
                TASK2[MCP Task 2<br/>Container]
                TASK3[MCP Task 3<br/>Container]
            end
        end

        subgraph "Container Registry"
            ECR[Amazon ECR<br/>MCP Server Image]
        end

        subgraph "Storage"
            EFS[Amazon EFS<br/>Shared State]
            S3[Amazon S3<br/>Artifacts]
        end

        subgraph "Security"
            SG[Security Groups]
            IAM[IAM Task Role]
            SM[Secrets Manager]
        end

        subgraph "Monitoring"
            CW[CloudWatch Logs]
            XRAY[X-Ray Tracing]
        end
    end

    DEV -->|HTTPS| ALB
    ALB -->|Route| TG
    TG -->|Forward| TASK1
    TG -->|Forward| TASK2
    TG -->|Forward| TASK3

    TASK1 -->|Pull Image| ECR
    TASK2 -->|Pull Image| ECR
    TASK3 -->|Pull Image| ECR

    TASK1 -->|Mount| EFS
    TASK2 -->|Mount| EFS
    TASK3 -->|Mount| EFS

    TASK1 -->|Store| S3
    TASK2 -->|Store| S3
    TASK3 -->|Store| S3

    SG -.->|Control| TASK1
    SG -.->|Control| TASK2
    SG -.->|Control| TASK3

    IAM -.->|Permissions| TASK1
    IAM -.->|Permissions| TASK2
    IAM -.->|Permissions| TASK3

    SM -.->|Secrets| TASK1
    SM -.->|Secrets| TASK2
    SM -.->|Secrets| TASK3

    TASK1 -->|Logs| CW
    TASK2 -->|Logs| CW
    TASK3 -->|Logs| CW

    TASK1 -->|Traces| XRAY
    TASK2 -->|Traces| XRAY
    TASK3 -->|Traces| XRAY

    style DEV fill:#FF9900
    style ALB fill:#146EB4
    style TASK1 fill:#232F3E,color:#fff
    style TASK2 fill:#232F3E,color:#fff
    style TASK3 fill:#232F3E,color:#fff
    style ECR fill:#146EB4
    style EFS fill:#146EB4
    style S3 fill:#146EB4
```

## Deployment Pipeline

```mermaid
graph LR
    A[Source Code] -->|Docker Build| B[Docker Image]
    B -->|Push| C[Amazon ECR]
    C -->|Pull| D[ECS Task Definition]
    D -->|Deploy| E[ECS Service]
    E -->|Register| F[Target Group]
    F -->|Health Check| G[Running Tasks]

    style A fill:#FF9900
    style B fill:#FF9900
    style C fill:#146EB4
    style D fill:#146EB4
    style E fill:#232F3E,color:#fff
    style F fill:#232F3E,color:#fff
    style G fill:#232F3E,color:#fff
```

## Component Details

### Network Layer
- **Application Load Balancer**: TLS termination, health checks, routing
- **Target Group**: Manages ECS task registration and health

### ECS Cluster
- **Fargate Service**: Serverless container orchestration
- **MCP Tasks**: Individual container instances running MCP servers
- **Auto Scaling**: Scale based on CPU/memory or custom metrics

### Container Registry
- **Amazon ECR**: Private Docker registry for MCP server images
- **Image Scanning**: Automated vulnerability scanning
- **Lifecycle Policies**: Automatic cleanup of old images

### Storage
- **Amazon EFS**: Shared filesystem for stateful MCP servers
- **Amazon S3**: Artifact storage, backups, logs archival

### Security
- **Security Groups**: Network-level firewall rules
- **IAM Task Role**: Permissions for AWS service access
- **Secrets Manager**: Secure credential storage

### Monitoring
- **CloudWatch Logs**: Centralized logging
- **X-Ray**: Distributed tracing for performance analysis

## Task Configuration

```mermaid
graph TB
    subgraph "ECS Task"
        subgraph "Container"
            APP[MCP Server<br/>Node.js/Python]
            PORT[Port 3000]
        end

        subgraph "Task Role"
            PERM[IAM Permissions]
        end

        subgraph "Environment"
            ENV[Environment Variables]
            SEC[Secrets from SM]
        end

        subgraph "Resources"
            CPU[0.5 vCPU]
            MEM[1 GB RAM]
        end

        subgraph "Storage"
            MOUNT[EFS Mount<br/>/mnt/data]
        end
    end

    style APP fill:#232F3E,color:#fff
    style PORT fill:#FF9900
    style PERM fill:#146EB4
    style ENV fill:#146EB4
    style SEC fill:#146EB4
    style CPU fill:#146EB4
    style MEM fill:#146EB4
    style MOUNT fill:#146EB4
```

## High Availability Setup

```mermaid
graph TB
    subgraph "Multi-AZ Deployment"
        subgraph "us-west-2a"
            TASK1[MCP Task]
        end

        subgraph "us-west-2b"
            TASK2[MCP Task]
        end

        subgraph "us-west-2c"
            TASK3[MCP Task]
        end
    end

    ALB[Application Load Balancer<br/>Multi-AZ] --> TASK1
    ALB --> TASK2
    ALB --> TASK3

    TASK1 --> EFS[Amazon EFS<br/>Multi-AZ]
    TASK2 --> EFS
    TASK3 --> EFS

    style ALB fill:#FF9900
    style TASK1 fill:#232F3E,color:#fff
    style TASK2 fill:#232F3E,color:#fff
    style TASK3 fill:#232F3E,color:#fff
    style EFS fill:#146EB4
```

## Scaling Strategy

```mermaid
graph LR
    A[CloudWatch Metrics] -->|CPU > 70%| B[Scale Out]
    A -->|CPU < 30%| C[Scale In]
    B -->|Add Task| D[Running Tasks: 2→3]
    C -->|Remove Task| E[Running Tasks: 3→2]
    D -->|Register| F[Load Balancer]
    E -->|Deregister| F

    style A fill:#146EB4
    style B fill:#FF9900
    style C fill:#FF9900
    style D fill:#232F3E,color:#fff
    style E fill:#232F3E,color:#fff
    style F fill:#146EB4
```

## Cost Optimization

1. **Right-size Tasks**: Start with 0.5 vCPU / 1 GB, adjust based on metrics
2. **Fargate Spot**: Use for non-critical workloads (70% cost savings)
3. **Auto Scaling**: Scale to zero during off-hours
4. **ECR Lifecycle**: Delete images older than 90 days
5. **EFS**: Use Infrequent Access storage class

## Security Best Practices

1. **Network Isolation**: Private subnets for tasks, public for ALB only
2. **Least Privilege**: IAM task role with minimum required permissions
3. **Secrets Management**: Never hardcode credentials, use Secrets Manager
4. **TLS Everywhere**: HTTPS on ALB, TLS between services
5. **Image Scanning**: Enable ECR scan-on-push
6. **CloudWatch Alarms**: Alert on security group changes

## Usage in Workshop

This diagram is referenced in:
- **Blog Post 2**: Deploying MCP Servers on AWS ECS
- **Exercise 008**: Understanding MCP server architecture

Students can use this to:
- Visualize complete MCP deployment architecture
- Understand AWS service interactions
- Plan their own MCP server deployments
- Identify security and scaling considerations
