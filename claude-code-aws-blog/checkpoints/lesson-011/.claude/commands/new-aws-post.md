---
description: "Generate a new AWS-themed blog post with MDX format"
argument-hint: "topic [category]"
allowed-tools: ["Write", "Bash"]
---

Create a new AWS-themed blog post with the following specifications:

**Topic:** $1
**Category:** $2 (default to "Bedrock" if not provided)

## File Requirements

1. **Filename format:** Use today's date in YYYY-MM-DD format followed by a URL-friendly slug derived from the topic
   - Example: `2025-10-25-getting-started-with-bedrock.mdx`
   - File extension must be `.mdx` (not `.md`)
   - Save to: `content/posts/`

2. **Frontmatter structure:**
```yaml
---
title: "[Derived from topic - use proper title case]"
date: "[Today's date in YYYY-MM-DD format]"
author: "AWS Developer"
excerpt: "[Generate a compelling 1-2 sentence description]"
category: "[Use $2 parameter, or 'Bedrock' if not provided]"
tags: ["[Generate 3-5 AWS-related tags based on the topic]"]
published: false
---
```

3. **Content structure:** Generate comprehensive content with these sections:

### Introduction
- Hook the reader with a real-world problem or use case
- Briefly explain what will be covered
- State who this guide is for

### Prerequisites
- List required AWS services and access
- Required tools and software
- Prior knowledge assumptions

### Step-by-Step Guide
- Break down the implementation into clear, numbered steps
- Include code examples where relevant
- Use AWS best practices terminology

### Best Practices
- List 3-5 best practices specific to this topic
- Include security considerations where relevant
- Performance optimization tips

### Common Pitfalls
- Document 2-3 common mistakes to avoid
- Explain why these are problematic
- Provide solutions or workarounds

### Conclusion
- Summarize key takeaways
- Suggest next steps or advanced topics
- Encourage reader engagement

### Further Reading
- Link to relevant AWS documentation
- Related blog posts (can be placeholders)
- Additional resources

## Style Guidelines

- Use AWS color scheme terminology (orange, dark, blue, etc.)
- Include code blocks with proper language tags
- Use clear, technical but accessible language
- Follow the professional, AWS documentation aesthetic
- Include practical examples and use cases
- Add inline code references for AWS service names (e.g., `AWS Bedrock`, `Claude Code`)

**Important:**
- File extension MUST be `.mdx` (not `.md`)
- Ensure the content is comprehensive (800-1200 words), technically accurate, and ready for review before publishing.
