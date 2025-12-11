# Claude Code Hooks Pipeline

This diagram illustrates the hook system in Claude Code, showing pre-tool and post-tool execution flows.

## Complete Hook Lifecycle

```mermaid
graph TB
    START[User Command] -->|Parse| CMD{Command Type}

    CMD -->|Tool Use| PRETOOL[Pre-Tool Hook]
    CMD -->|No Tool| EXECUTE

    PRETOOL -->|Check| VALIDATE{Validation}
    VALIDATE -->|Pass| EXECUTE[Execute Tool]
    VALIDATE -->|Fail| BLOCK[Block Execution]

    EXECUTE -->|Result| POSTTOOL[Post-Tool Hook]

    POSTTOOL -->|Process| FORMAT{Format Output}
    FORMAT -->|Transform| RESULT[Return Result]
    FORMAT -->|Error| RETRY[Retry/Alert]

    BLOCK -->|Log| ERROR[Error Response]
    RETRY -->|Log| ERROR

    RESULT --> END[Display to User]
    ERROR --> END

    style START fill:#FF9900
    style PRETOOL fill:#146EB4
    style POSTTOOL fill:#146EB4
    style EXECUTE fill:#232F3E,color:#fff
    style BLOCK fill:#d32f2f,color:#fff
    style RESULT fill:#388e3c,color:#fff
```

## Pre-Tool Hook Flow

```mermaid
sequenceDiagram
    participant User
    participant Claude
    participant PreHook
    participant Tool

    User->>Claude: Issue command
    Claude->>Claude: Plan tool use
    Claude->>PreHook: Before tool execution
    PreHook->>PreHook: Validate request

    alt Validation Passes
        PreHook-->>Claude: Allow
        Claude->>Tool: Execute tool
        Tool-->>Claude: Result
        Claude-->>User: Response
    else Validation Fails
        PreHook-->>Claude: Block
        Claude-->>User: Error message
    end
```

## Post-Tool Hook Flow

```mermaid
sequenceDiagram
    participant Claude
    participant Tool
    participant PostHook
    participant User

    Claude->>Tool: Execute tool
    Tool-->>Claude: Raw result
    Claude->>PostHook: After tool execution
    PostHook->>PostHook: Process result

    alt Processing Success
        PostHook->>PostHook: Format/transform
        PostHook-->>Claude: Processed result
        Claude-->>User: Display
    else Processing Error
        PostHook->>PostHook: Log error
        PostHook-->>Claude: Error details
        Claude-->>User: Error message
    end
```

## Hook Types and Use Cases

```mermaid
graph LR
    subgraph "Pre-Tool Hooks"
        P1[Protection<br/>Prevent destructive ops]
        P2[Validation<br/>Check frontmatter]
        P3[Authentication<br/>Verify credentials]
        P4[Rate Limiting<br/>Throttle requests]
    end

    subgraph "Post-Tool Hooks"
        O1[Formatting<br/>Auto-format code]
        O2[Logging<br/>Audit trail]
        O3[Notification<br/>Send alerts]
        O4[Backup<br/>Save versions]
    end

    TOOLS[Tool Execution] -->|Before| P1
    TOOLS -->|Before| P2
    TOOLS -->|Before| P3
    TOOLS -->|Before| P4

    TOOLS -->|After| O1
    TOOLS -->|After| O2
    TOOLS -->|After| O3
    TOOLS -->|After| O4

    style TOOLS fill:#232F3E,color:#fff
    style P1 fill:#146EB4
    style P2 fill:#146EB4
    style P3 fill:#146EB4
    style P4 fill:#146EB4
    style O1 fill:#FF9900
    style O2 fill:#FF9900
    style O3 fill:#FF9900
    style O4 fill:#FF9900
```

## Protection Hook Example

```mermaid
graph TB
    START[Write/Edit Tool Invoked]
    CHECK{Check File Path}

    CHECK -->|Match Protected| ALLOW{Check Approval}
    CHECK -->|Not Protected| EXEC[Execute Tool]

    ALLOW -->|User Approved| EXEC
    ALLOW -->|Not Approved| PROMPT[Request Approval]

    PROMPT -->|Approved| EXEC
    PROMPT -->|Denied| BLOCK[Block Execution]

    EXEC -->|Success| RESULT[File Modified]
    BLOCK -->|Error| ERROR[Operation Blocked]

    style START fill:#FF9900
    style ALLOW fill:#146EB4
    style EXEC fill:#232F3E,color:#fff
    style BLOCK fill:#d32f2f,color:#fff
    style RESULT fill:#388e3c,color:#fff
```

### Protection Hook Logic

```javascript
// Pseudo-code for protection hook
function preToolHook(tool, args) {
  const protectedPaths = [
    'package.json',
    'tsconfig.json',
    '.env'
  ];

  if (tool === 'Write' || tool === 'Edit') {
    const filePath = args.file_path;

    if (protectedPaths.some(p => filePath.includes(p))) {
      // Request user approval
      return {
        action: 'request_approval',
        message: `Modifying protected file: ${filePath}`
      };
    }
  }

  return { action: 'allow' };
}
```

## Formatting Hook Example

```mermaid
graph TB
    START[Write Tool Executed]
    CHECK{Check File Type}

    CHECK -->|Markdown| FORMAT_MD[Run Prettier]
    CHECK -->|TypeScript| FORMAT_TS[Run Prettier + ESLint]
    CHECK -->|Other| SKIP[Skip Formatting]

    FORMAT_MD -->|Format| RESULT[Save Formatted]
    FORMAT_TS -->|Format| RESULT
    SKIP --> RESULT

    RESULT -->|Success| COMMIT[Ready for Commit]

    style START fill:#FF9900
    style FORMAT_MD fill:#146EB4
    style FORMAT_TS fill:#146EB4
    style RESULT fill:#232F3E,color:#fff
    style COMMIT fill:#388e3c,color:#fff
```

### Formatting Hook Logic

```javascript
// Pseudo-code for formatting hook
async function postToolHook(tool, args, result) {
  if (tool === 'Write' || tool === 'Edit') {
    const filePath = args.file_path;

    if (filePath.endsWith('.md')) {
      // Run Prettier on markdown
      await exec(`prettier --write "${filePath}"`);
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      // Run Prettier + ESLint
      await exec(`prettier --write "${filePath}"`);
      await exec(`eslint --fix "${filePath}"`);
    }
  }

  return result;
}
```

## Validation Hook Example (Frontmatter)

```mermaid
graph TB
    START[Write to Content File]
    PARSE[Parse Frontmatter]

    PARSE -->|Valid YAML| CHECK{Validate Fields}
    PARSE -->|Invalid YAML| ERROR[Return Error]

    CHECK -->|Has Required| VALIDATE{Check Values}
    CHECK -->|Missing Fields| ERROR

    VALIDATE -->|All Valid| ALLOW[Allow Write]
    VALIDATE -->|Invalid Values| ERROR

    ALLOW -->|Success| RESULT[File Written]
    ERROR -->|Block| BLOCKED[Operation Blocked]

    style START fill:#FF9900
    style PARSE fill:#146EB4
    style VALIDATE fill:#146EB4
    style ALLOW fill:#388e3c,color:#fff
    style ERROR fill:#d32f2f,color:#fff
    style BLOCKED fill:#d32f2f,color:#fff
```

### Validation Hook Logic

```javascript
// Pseudo-code for validation hook
function preToolHook(tool, args) {
  if (tool === 'Write' && args.file_path.includes('/content/posts/')) {
    const content = args.content;
    const frontmatter = extractFrontmatter(content);

    // Required fields
    const required = ['title', 'date', 'author', 'category'];
    const missing = required.filter(f => !frontmatter[f]);

    if (missing.length > 0) {
      return {
        action: 'block',
        message: `Missing required fields: ${missing.join(', ')}`
      };
    }

    // Validate date format
    if (!isValidDate(frontmatter.date)) {
      return {
        action: 'block',
        message: 'Invalid date format. Use YYYY-MM-DD'
      };
    }

    // Validate category
    const validCategories = ['Tutorial', 'Guide', 'Reference'];
    if (!validCategories.includes(frontmatter.category)) {
      return {
        action: 'block',
        message: `Invalid category. Must be: ${validCategories.join(', ')}`
      };
    }
  }

  return { action: 'allow' };
}
```

## Hook Composition

```mermaid
graph TB
    START[Tool Execution]

    subgraph "Pre-Tool Hooks (Sequential)"
        PRE1[Hook 1: Auth Check]
        PRE2[Hook 2: Validation]
        PRE3[Hook 3: Rate Limit]
    end

    subgraph "Tool Execution"
        TOOL[Execute Tool]
    end

    subgraph "Post-Tool Hooks (Sequential)"
        POST1[Hook 1: Format]
        POST2[Hook 2: Log]
        POST3[Hook 3: Notify]
    end

    START --> PRE1
    PRE1 -->|Pass| PRE2
    PRE1 -->|Fail| BLOCK
    PRE2 -->|Pass| PRE3
    PRE2 -->|Fail| BLOCK
    PRE3 -->|Pass| TOOL
    PRE3 -->|Fail| BLOCK

    TOOL --> POST1
    POST1 --> POST2
    POST2 --> POST3
    POST3 --> RESULT

    BLOCK[Execution Blocked] --> ERROR
    RESULT[Final Result] --> END

    style START fill:#FF9900
    style PRE1 fill:#146EB4
    style PRE2 fill:#146EB4
    style PRE3 fill:#146EB4
    style TOOL fill:#232F3E,color:#fff
    style POST1 fill:#FF9900
    style POST2 fill:#FF9900
    style POST3 fill:#FF9900
    style BLOCK fill:#d32f2f,color:#fff
    style RESULT fill:#388e3c,color:#fff
```

## Hook Configuration

```mermaid
graph LR
    subgraph "Configuration Files"
        SETTINGS[.claude/settings.json]
        SCRIPTS[.claude/hooks/]
    end

    subgraph "Hook Definitions"
        DEF1[Pre-Tool Scripts]
        DEF2[Post-Tool Scripts]
        DEF3[Tool Filters]
        DEF4[Error Handlers]
    end

    subgraph "Runtime"
        LOAD[Load on Startup]
        EXEC[Execute on Tool Use]
        CACHE[Cache Results]
    end

    SETTINGS --> DEF1
    SETTINGS --> DEF2
    SETTINGS --> DEF3
    SETTINGS --> DEF4

    SCRIPTS --> DEF1
    SCRIPTS --> DEF2

    DEF1 --> LOAD
    DEF2 --> LOAD
    DEF3 --> LOAD
    DEF4 --> LOAD

    LOAD --> EXEC
    EXEC --> CACHE

    style SETTINGS fill:#146EB4
    style SCRIPTS fill:#146EB4
    style LOAD fill:#232F3E,color:#fff
    style EXEC fill:#FF9900
```

## Error Handling in Hooks

```mermaid
graph TB
    HOOK[Hook Execution]
    TRY{Try Execute}

    TRY -->|Success| RETURN[Return Result]
    TRY -->|Error| CATCH[Catch Error]

    CATCH --> LOG[Log Error Details]
    LOG --> NOTIFY[Notify User]
    NOTIFY --> FALLBACK{Fallback Strategy}

    FALLBACK -->|Continue| ALLOW[Allow Tool Execution]
    FALLBACK -->|Stop| BLOCK[Block Execution]
    FALLBACK -->|Retry| RETRY[Retry Hook]

    RETRY -->|Retry| TRY
    ALLOW --> RETURN
    BLOCK --> ERROR[Return Error]

    style HOOK fill:#FF9900
    style TRY fill:#146EB4
    style CATCH fill:#d32f2f,color:#fff
    style RETURN fill:#388e3c,color:#fff
    style ERROR fill:#d32f2f,color:#fff
```

## Performance Optimization

```mermaid
graph LR
    OPT[Optimization Strategies]

    subgraph "Caching"
        C1[Cache Hook Results]
        C2[Cache File Checks]
        C3[Cache Validation]
    end

    subgraph "Parallelization"
        P1[Parallel Post-Hooks]
        P2[Async Formatting]
        P3[Background Logging]
    end

    subgraph "Filtering"
        F1[File Type Filters]
        F2[Path Exclusions]
        F3[Conditional Execution]
    end

    OPT --> C1
    OPT --> C2
    OPT --> C3
    OPT --> P1
    OPT --> P2
    OPT --> P3
    OPT --> F1
    OPT --> F2
    OPT --> F3

    style OPT fill:#FF9900
    style C1 fill:#146EB4
    style C2 fill:#146EB4
    style C3 fill:#146EB4
    style P1 fill:#232F3E,color:#fff
    style P2 fill:#232F3E,color:#fff
    style P3 fill:#232F3E,color:#fff
```

## Usage in Workshop

This diagram is referenced in:
- **Exercise 010**: Understanding hooks
- **Exercise 011**: Defining protection hooks
- **Exercise 012**: Implementing formatting hooks
- **Exercise 013**: Composing multiple hooks
- **Blog Post 4** (optional): Advanced hook patterns

Students can use this to:
- Understand pre-tool and post-tool execution flow
- Design validation and protection strategies
- Implement formatting automation
- Debug hook execution issues
- Optimize hook performance

## Key Concepts

1. **Pre-Tool Hooks**: Execute BEFORE tool runs, can block execution
2. **Post-Tool Hooks**: Execute AFTER tool runs, can transform output
3. **Hook Composition**: Multiple hooks run sequentially in order
4. **Error Handling**: Hooks must handle errors gracefully
5. **Performance**: Hooks should be fast to avoid slowing Claude Code
6. **Restart Required**: Hook changes require Claude Code restart
