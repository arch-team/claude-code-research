# Screenshot Documentation

This directory contains guidelines and placeholders for workshop screenshots.

## Screenshot Locations

Screenshots are needed in the following areas:

### Exercise Documentation
1. **Exercise 004**: Claude Code memory mode interface
2. **Exercise 005**: Blog hero section (before/after)
3. **Exercise 006**: Blog post list display
4. **Exercise 007**: Custom command creation and usage
5. **Exercise 008**: Playwright MCP inspector, dark mode testing
6. **Exercise 009**: GitHub PR with @Claude integration
7. **Exercise 010**: Hook configuration in settings.json
8. **Exercise 011**: Protection hook approval dialog
9. **Exercise 012**: Auto-formatted code after hook execution
10. **Exercise 013**: Multiple hooks working together
11. **Exercise 014**: RSS feed generator script

### Blog Posts
1. **Blog Post 1**: AWS Bedrock console, IAM policies, cost dashboard
2. **Blog Post 2**: ECS task definition, ECR repository, CloudWatch logs
3. **Blog Post 3**: GitHub Actions workflow, PR comments, deployment metrics

## Screenshot Standards

### Technical Requirements
- **Format**: PNG (for UI/interfaces) or JPEG (for photographs)
- **Resolution**: Minimum 1920x1080 (Retina: 2x resolution preferred)
- **Color Space**: sRGB
- **Compression**: Optimize for web (use tools like TinyPNG)
- **File Size**: Target < 300KB per screenshot

### Naming Convention
```
{lesson-number}_{description}_{variant}.{ext}

Examples:
- 005_hero_section_before.png
- 005_hero_section_after.png
- 008_playwright_inspector.png
- 009_github_pr_comment.png
- blog_bedrock_console.png
```

### Composition Guidelines

#### 1. Window Screenshots
- **Include**: Application chrome (title bar, tabs)
- **Exclude**: Desktop clutter, personal information
- **Highlight**: Key areas with red boxes or arrows
- **Size**: Full window or focused area (1400x900 typical)

#### 2. Interface Close-ups
- **Focus**: Specific UI elements (buttons, forms, dialogs)
- **Context**: Include enough surrounding UI for orientation
- **Annotations**: Add callout numbers or labels if needed
- **Size**: 800x600 to 1200x800

#### 3. Code Screenshots
- **Theme**: Use consistent VS Code theme (Dark+ recommended)
- **Font**: Monospace, readable size (14-16px)
- **Highlighting**: Use VS Code's built-in syntax highlighting
- **Size**: Adjust to code length, typically 1000x600

#### 4. Terminal/CLI Screenshots
- **Theme**: Dark background, light text
- **Prompt**: Show clear command prompt
- **Output**: Include relevant output, truncate if too long
- **Size**: 1000x400 to 1200x600

### Annotation Style

Use consistent annotation style across all screenshots:

**Colors**:
- Red (#D13212) - Errors, warnings, critical areas
- Orange (#FF9900) - Highlights, important features
- Blue (#146EB4) - Information, secondary highlights
- Green (#1D8102) - Success states, positive feedback

**Elements**:
- Boxes: 3px solid stroke, no fill
- Arrows: 3px wide, simple arrowhead
- Numbers: White text on colored circle (40px diameter)
- Labels: Sans-serif font, 16px, white text on semi-transparent background

### Tools for Screenshots

#### macOS
```bash
# Full screen
Cmd + Shift + 3

# Selection
Cmd + Shift + 4

# Window (with shadow)
Cmd + Shift + 4, then Space, then click window

# Window (without shadow)
Cmd + Shift + 4, Space, Option + click window
```

#### Windows
```
# Full screen
PrtScn or Win + PrtScn

# Selection
Win + Shift + S

# Active window
Alt + PrtScn
```

#### Linux
```bash
# Using GNOME Screenshot
gnome-screenshot

# Using Spectacle (KDE)
spectacle
```

#### Browser DevTools
```javascript
// Chrome: Take full-page screenshot
Cmd/Ctrl + Shift + P
> "Capture full size screenshot"

// Firefox: Take full-page screenshot
Right-click → "Take Screenshot" → "Save full page"
```

### Annotation Tools

**Recommended Tools**:
1. **Skitch** (macOS) - Simple, fast annotations
2. **Snagit** (Windows/macOS) - Professional screenshot tool
3. **GIMP** (All platforms) - Free, powerful image editor
4. **Figma** (Web) - Design tool with annotation features
5. **Excalidraw** (Web) - Simple diagrams and annotations

## Screenshot Placeholders

Until real screenshots are available, use placeholders:

### HTML Placeholder Generator

```html
<!-- Placeholder for screenshots -->
<div class="screenshot-placeholder" style="
  width: 100%;
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, #232F3E 0%, #146EB4 100%);
  border: 2px dashed #FF9900;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
">
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#FF9900" stroke-width="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
  <p style="color: #FF9900; font-size: 18px; font-weight: 600; margin-top: 20px;">
    Screenshot: Exercise 005 - Hero Section
  </p>
  <p style="color: rgba(255, 255, 255, 0.7); font-size: 14px; margin-top: 8px;">
    1920x1080 • PNG • AWS Theme
  </p>
</div>
```

### Markdown Placeholder

```markdown
![Screenshot Placeholder: Exercise 005 - Hero Section](https://via.placeholder.com/1920x1080/232F3E/FF9900?text=Screenshot:+Hero+Section)

*Screenshot to be added: Hero section with AWS branding and gradient background*
```

## Screenshot Checklist

### Before Taking Screenshots

- [ ] Clear browser cache and cookies
- [ ] Use consistent browser/window size
- [ ] Close unnecessary tabs and windows
- [ ] Check for sensitive information (API keys, passwords)
- [ ] Ensure proper lighting (if photographing physical screens)
- [ ] Use consistent font sizes and zoom levels

### After Taking Screenshots

- [ ] Verify image quality and clarity
- [ ] Crop to relevant content
- [ ] Add annotations if needed
- [ ] Optimize file size
- [ ] Rename following naming convention
- [ ] Add alt text description
- [ ] Test display in documentation

### For Workshop Delivery

- [ ] All exercise screenshots captured
- [ ] All blog post screenshots captured
- [ ] Annotations added where helpful
- [ ] All files optimized for web
- [ ] Alt text written for accessibility
- [ ] Screenshots tested in workshop environment

## Screenshot List

### Exercise Screenshots (Required)

| Lesson | Screenshot | Description | Status |
|--------|------------|-------------|--------|
| 004 | `004_memory_mode.png` | Memory mode interface in Claude Code | ⏳ Pending |
| 005 | `005_hero_before.png` | Initial placeholder hero section | ⏳ Pending |
| 005 | `005_hero_after.png` | Completed AWS-themed hero section | ⏳ Pending |
| 006 | `006_blog_list.png` | Blog post list with navigation | ⏳ Pending |
| 007 | `007_command_file.png` | Custom command markdown file | ⏳ Pending |
| 007 | `007_command_usage.png` | Using custom command in CLI | ⏳ Pending |
| 008 | `008_playwright_setup.png` | MCP server configuration | ⏳ Pending |
| 008 | `008_playwright_test.png` | Dark mode testing with Playwright | ⏳ Pending |
| 009 | `009_github_pr.png` | Pull request with @Claude mention | ⏳ Pending |
| 009 | `009_claude_review.png` | Claude's code review comment | ⏳ Pending |
| 010 | `010_hook_config.png` | Hook configuration in settings | ⏳ Pending |
| 011 | `011_protection_dialog.png` | Approval dialog for protected file | ⏳ Pending |
| 012 | `012_formatted_code.png` | Auto-formatted markdown file | ⏳ Pending |
| 013 | `013_multiple_hooks.png` | Multiple hooks in action | ⏳ Pending |
| 014 | `014_rss_generator.png` | RSS feed generator script | ⏳ Pending |

### Blog Post Screenshots (Required)

| Post | Screenshot | Description | Status |
|------|------------|-------------|--------|
| 1 | `blog_bedrock_console.png` | AWS Bedrock console interface | ⏳ Pending |
| 1 | `blog_iam_policy.png` | IAM policy for Bedrock access | ⏳ Pending |
| 1 | `blog_cost_dashboard.png` | CloudWatch cost dashboard | ⏳ Pending |
| 2 | `blog_ecr_repository.png` | ECR repository with MCP image | ⏳ Pending |
| 2 | `blog_ecs_task.png` | ECS task definition | ⏳ Pending |
| 2 | `blog_cloudwatch_logs.png` | CloudWatch logs for MCP server | ⏳ Pending |
| 3 | `blog_github_actions.png` | GitHub Actions workflow | ⏳ Pending |
| 3 | `blog_pr_comment.png` | AI code review comment on PR | ⏳ Pending |
| 3 | `blog_deployment_metrics.png` | Deployment metrics dashboard | ⏳ Pending |

## Accessibility

All screenshots must include descriptive alt text:

### Good Alt Text Examples

```markdown
![Claude Code memory mode showing the # command to add persistent instructions to CLAUDE.md file](004_memory_mode.png)

![AWS-themed hero section with orange gradient background, white heading, and orange CTA button](005_hero_after.png)

![GitHub pull request with @Claude mention triggering automated code review](009_github_pr.png)
```

### Alt Text Guidelines

1. **Be descriptive**: Explain what the screenshot shows
2. **Include context**: Mention UI elements, colors, key features
3. **Keep it concise**: 125 characters or less when possible
4. **Avoid redundancy**: Don't start with "Screenshot of..." or "Image showing..."
5. **Prioritize important info**: Focus on what matters for understanding

## Advanced Screenshot Techniques

### Taking Animated GIFs

For demonstrating workflows:

```bash
# Using LICEcap (macOS/Windows)
# 1. Open LICEcap
# 2. Position recording area
# 3. Click Record
# 4. Perform actions
# 5. Click Stop

# Using Peek (Linux)
peek
```

**GIF Guidelines**:
- Duration: 3-10 seconds
- Frame rate: 15-30 fps
- Size: 800-1200px wide
- File size: Target < 5MB

### Browser-Specific Features

#### Chrome DevTools Screenshots
```javascript
// 1. Open DevTools (F12)
// 2. Toggle device toolbar (Cmd/Ctrl + Shift + M)
// 3. Open command palette (Cmd/Ctrl + Shift + P)
// 4. Type "Capture screenshot"
// Options:
//   - Capture area screenshot
//   - Capture full size screenshot
//   - Capture node screenshot
//   - Capture screenshot
```

#### Firefox Developer Tools
```
1. Open DevTools (F12)
2. Click "..." menu
3. Select "Take a screenshot"
4. Choose between:
   - Save full page
   - Save visible area
```

## Post-Processing

### Batch Optimization Script

```bash
#!/bin/bash
# optimize-screenshots.sh

# Optimize PNG files
for file in *.png; do
  pngquant --quality=65-80 --ext .png --force "$file"
  echo "Optimized: $file"
done

# Optimize JPEG files
for file in *.jpg *.jpeg; do
  jpegoptim --max=85 --strip-all "$file"
  echo "Optimized: $file"
done

echo "All screenshots optimized!"
```

### Adding Watermark (Optional)

```bash
# Using ImageMagick
for file in *.png; do
  convert "$file" \
    -gravity southeast \
    -pointsize 24 \
    -fill 'rgba(255,153,0,0.5)' \
    -annotate +20+20 'AWS Workshop' \
    "watermarked_$file"
done
```

## Resources

- [Chrome DevTools Screenshot Guide](https://developer.chrome.com/docs/devtools/screenshots/)
- [Accessibility Alt Text Guidelines](https://www.w3.org/WAI/tutorials/images/)
- [TinyPNG](https://tinypng.com/) - Image optimization
- [Carbon](https://carbon.now.sh/) - Beautiful code screenshots
- [Excalidraw](https://excalidraw.com/) - Diagram annotations
