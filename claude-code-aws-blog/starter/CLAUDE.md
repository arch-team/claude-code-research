# CLAUDE.md - AWS Blog Project

This file provides guidance to Claude Code when working with this AWS-themed blog project.

## Project Overview

This is a Next.js 14 blog built during the AWS Claude Code workshop. The blog demonstrates how to use Claude Code to build modern web applications with AWS branding and best practices.

## AWS Design Requirements

### Color Palette
- **AWS Orange**: `#FF9900` - Primary accent color (buttons, links, highlights)
- **AWS Dark**: `#232F3E` - Primary text and dark backgrounds
- **AWS Blue**: `#146EB4` - Secondary accent (links, information)
- **AWS Light Gray**: `#F2F3F3` - Light backgrounds and borders
- **AWS Dark Gray**: `#545B64` - Secondary text

### Typography
- **Body Text**: System sans-serif fonts
- **Code**: Fira Code or monospace fallback
- **Line Height**: 1.6 for body text, 1.2 for headings

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Key Files

<!-- Students will add important files here using @ imports as they build -->

### Core Application
- `app/page.tsx` - Home page with hero section and post list
- `app/layout.tsx` - Root layout with metadata and footer
- `app/globals.css` - Global styles and AWS theme variables

### Blog Posts
- `content/posts/` - Blog post markdown files (to be created)

## Development Workflow

### Running the Application
```bash
npm install        # Install dependencies
npm run dev        # Start development server on localhost:3000
npm run build      # Build for production
npm run lint       # Run ESLint
```

### Code Style
- Use TypeScript for type safety
- Follow React Server Components pattern (Next.js 15)
- Use Tailwind CSS utility classes
- Keep components small and focused
- Add comments for complex logic

## AWS Theme Usage

When building components, always reference the AWS color palette:

```typescript
// Example: AWS-themed button
<button className="bg-aws-orange hover:bg-aws-blue text-white px-6 py-3 rounded">
  Call to Action
</button>

// Example: AWS-themed heading
<h1 className="text-aws-dark font-bold text-4xl">
  Heading Text
</h1>
```

## CloudFront Proxy Architecture

### CRITICAL: How the Proxy Works

This project runs behind a CloudFront proxy with specific path-stripping behavior that affects navigation:

**Public URL Structure:**
```
https://{cloudfront-url}/proxy/3000/
```

**Path Stripping Behavior:**
- User visits: `https://{cloudfront-url}/proxy/3000/posts/slug`
- CloudFront strips prefix and forwards to Next.js as: `/posts/slug`
- Next.js receives requests WITHOUT the `/proxy/3000/` prefix
- Next.js routes are defined without the prefix (e.g., `app/posts/[slug]/page.tsx`)

**Navigation Requirements:**
- ALL `Link` components must output full paths: `/proxy/3000/posts/slug`
- Use the `withBasePath()` helper from `app/lib/basePath.ts`
- Example: `<Link href={withBasePath('/posts/slug')}>`
- The helper adds `/proxy/3000/` to all internal navigation URLs

**Configuration Approach:**
- ✅ DO use `next.config.js` rewrites for server-side routing
- ✅ DO use `withBasePath()` helper for all Link hrefs
- ❌ DO NOT use `basePath` in `next.config.js` (won't work with path stripping)
- ❌ DO NOT hardcode proxy path in route files

**Why This Approach:**
CloudFront strips the prefix before Next.js sees the request, so `basePath` doesn't work. Instead:
1. Server-side: Next.js routes handle requests at `/` and `/posts/[slug]`
2. Client-side: Links must include `/proxy/3000/` so browsers navigate to correct URLs
3. The `withBasePath()` helper bridges this gap

## CloudFront Proxy Setup

**Environment Details:**
- Local development: `http://localhost:3000`
- Workshop access: `https://{your-cloudfront-url}/proxy/3000/`
- Dev server binds to `0.0.0.0` for network accessibility
- Proxy rewrites configured in `next.config.js`
- Inline styles in layout bypass MIME type issues

## Blog Post Structure

Blog posts should use frontmatter with the following structure:

```markdown
---
title: "Post Title"
date: "2025-10-22"
author: "Author Name"
excerpt: "Brief description of the post"
category: "Category Name"
tags: ["tag1", "tag2"]
published: false
---

Post content here...
```

## Workshop Context

This project is built progressively through workshop exercises:
- **Exercise 004**: Context management with `/init` and memory mode
- **Exercise 005**: Visual development with screenshots and Plan Mode
- **Exercise 006**: Conversation control and component building
- **Exercise 007**: Custom commands for blog post generation
- **Exercise 008**: MCP servers for visual testing
- **Exercise 009**: GitHub integration and collaboration
- **Exercise 010-012**: Hooks for automation
- **Exercise 013**: Multiple hooks composition
- **Exercise 014**: Claude Code SDK integration

## Common Tasks

### Adding a New Blog Post
<!-- Students will create a custom command for this in Exercise 007 -->

### Testing Visual Changes
<!-- Students will use Playwright MCP server for this in Exercise 008 -->

### Git Workflow
- Make frequent commits with descriptive messages
- Use branches for features
- Let Claude help with commit messages

## Hooks Implementation

### Critical Details for Creating Hooks

**JSON Structure Received by Hooks:** Hooks receive JSON via stdin with this
structure:

```json
{
  "session_id": "...",
  "tool_name": "Read",
  "tool_input": {
    "file_path": "/path/to/file"
  },
  "hook_event_name": "PreToolUse",
  "cwd": "/project/path"
}
```

**Key Implementation Details:**

- **Extract file path**: Use `.tool_input.file_path` when parsing the JSON
- **Read input**: Use `cat` to read JSON from stdin in bash scripts
- **Exit codes**:
  - Exit code `0` = Allow operation to proceed
  - Exit code `2` = Block operation (stderr message shown to Claude)
  - Other codes = Show error to user but continue
- **Configuration file**: Place hooks configuration in `.claude/settings.json`
- **Script location**: Place hook scripts in the `hooks/` directory
- **Matcher patterns**: Use `"Read|Grep"` to match both Read and Grep tools
- **Command format**: Simple format works best: `"bash hooks/script_name.sh"`
- **Make executable**: Remember to `chmod +x` hook scripts

**Example Configuration Structure:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read|Grep",
        "hooks": [
          {
            "type": "command",
            "command": "bash hooks/your_hook_script.sh"
          }
        ]
      }
    ]
  }
}
```

### Environment Variables

Available in hook commands:

- `$CLAUDE_PROJECT_DIR`: Project root directory
- `$CLAUDE_EDITED_FILE`: File that was edited/written (for Edit/Write tools)
- `$CLAUDE_TOOL_NAME`: Name of the tool that triggered the hook


## Notes for Claude

When working on this project:
- Always maintain the AWS color scheme
- Ensure responsive design works on all breakpoints
- Use semantic HTML elements
- Keep accessibility in mind
- Test on both light and dark color schemes
- Add comments for complex logic
- Follow Next.js 15 App Router conventions
- Use React Server Components by default
- Only use "use client" when necessary (interactivity, hooks)

## Memory Mode Instructions

<!-- Students will add custom instructions here in Exercise 004 -->
<!-- Example: "Always use AWS orange (#FF9900) for primary buttons" -->
