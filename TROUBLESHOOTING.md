# Claude Code AWS Workshop - Troubleshooting Guide

## 🆘 Quick Help Index

Jump to your issue:
- [npm Install Failures](#npm-install-failures)
- [MCP Server Issues](#mcp-server-issues)
- [Port 3000 Conflicts](#port-3000-already-in-use)
- [CloudFront Proxy Errors](#cloudfront-proxy-url-issues)
- [Permission Errors](#permission-errors)
- [Build Failures](#build-failures)
- [Hook Not Working](#hooks-not-triggering)
- [Reading Time Feature Issues](#reading-time-feature-issues)
- [Claude Code General Issues](#claude-code-general-issues)

---

## npm Install Failures

### Symptom
```bash
npm install
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! peer eslint@"^7.23.0 || ^8.0.0" from eslint-config-next@14.2.22
```

### Cause
Peer dependency conflicts between Next.js 14, React 18, and ESLint versions.

### Fix
```bash
npm install --legacy-peer-deps
```

**Why this works:** The `--legacy-peer-deps` flag tells npm to ignore strict peer dependency requirements, which is safe for this workshop environment.

**Verification:**
```bash
npm list next  # Should show 14.2.22
npm list react # Should show 18.3.1
npm list eslint # Should show 8.57.0
```

### Alternative: Clean Install
```bash
# Remove existing installations
rm -rf node_modules package-lock.json

# Fresh install
npm install --legacy-peer-deps
```

---

## MCP Server Issues

### Symptom 1: "@playwright commands don't work"

**Error Message:**
```
Tool not found: playwright_navigate
```

**Fix:**
```bash
# 1. Check MCP server is installed
claude mcp list
# Should show: playwright

# 2. If missing, install it
claude mcp add playwright npx @modelcontextprotocol/server-playwright

# 3. Restart Claude Code
exit
claude
```

### Symptom 2: "Permission denied for MCP operations"

**Error Message:**
```
Permission denied: mcp__playwright__navigate
```

**Fix:**
Create or edit `.claude/settings.local.json`:
```bash
cat > .claude/settings.local.json <<EOF
{
  "permissions": {
    "allow": ["mcp__playwright"],
    "deny": []
  }
}
EOF
```

**Important:** Note the double underscore `__` in `mcp__playwright`.

**Then restart Claude Code:**
```bash
exit
claude
```

### Symptom 3: "Playwright browser not installed"

**Error Message:**
```
browserType.launch: Executable doesn't exist at /path/to/chrome
```

**Fix:**
```bash
npx playwright install chrome
```

**Verification:**
```bash
npx playwright --version
# Should show Playwright version
```

### Symptom 4: "MCP server timeout"

**Error:**
```
MCP server failed to start within timeout
```

**Fix:**
```bash
# Remove and re-add the server
claude mcp remove playwright
claude mcp add playwright npx @modelcontextprotocol/server-playwright

# Restart Claude
exit
claude
```

---

## Port 3000 Already in Use

### Symptom
```bash
npm run dev
Error: Port 3000 is already in use
```

### Fix (macOS/Linux)
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Alternative: Kill Next.js specifically
pkill -f next-dev

# Restart dev server
npm run dev
```

### Fix (Windows)
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F

# Restart dev server
npm run dev
```

### Permanent Fix: Use Different Port
```bash
# Edit package.json
"scripts": {
  "dev": "next dev -p 3001"  # Change to port 3001
}
```

---

## CloudFront Proxy URL Issues

### Symptom
"I don't know if I should use localhost:3000 or CloudFront URL"

### Answer
**YOU ARE IN AWS WORKSHOP - ALWAYS USE CLOUDFRONT URL**

Your CloudFront URL format:
```
https://d1234abcd56efg.cloudfront.net/proxy/3000/
```

**How to find it:**
```bash
# Your CloudFront domain was shown when you logged in
# Check environment variable:
echo $CLOUDFRONT_DOMAIN

# Or check all environment variables:
env | grep CLOUDFRONT
```

**Testing:**
```bash
# Test your dev server is accessible through CloudFront
curl https://$CLOUDFRONT_DOMAIN/proxy/3000/
```

### Common Mistakes

❌ **WRONG:** `http://localhost:3000`
✅ **RIGHT:** `https://your-cloudfront-id.cloudfront.net/proxy/3000/`

❌ **WRONG:** `https://cloudfront.net/3000/` (missing proxy path)
✅ **RIGHT:** `https://your-cloudfront-id.cloudfront.net/proxy/3000/`

### Symptom: "502 Bad Gateway" from CloudFront

**Cause:** Dev server not running or not accessible

**Fix:**
```bash
# Ensure dev server is running
npm run dev

# Check it's listening on 0.0.0.0, not 127.0.0.1
# Next.js 14 should bind to 0.0.0.0 by default

# Test locally first
curl http://localhost:3000
# Should return HTML

# Then test through CloudFront
curl https://$CLOUDFRONT_DOMAIN/proxy/3000/
```

---

## Permission Errors

### Symptom 1: "Hook script permission denied"

**Error:**
```
/bin/sh: .claude/hooks/format_hook.sh: Permission denied
```

**Fix:**
```bash
# Make hook scripts executable
chmod +x .claude/hooks/*.sh
chmod +x .claude/hooks/*.js

# Verify permissions
ls -l .claude/hooks/
# Should show: -rwxr-xr-x
```

### Symptom 2: "Cannot create .claude directory"

**Error:**
```
EACCES: permission denied, mkdir '.claude'
```

**Fix:**
```bash
# Create directory with correct permissions
mkdir -p .claude/commands .claude/hooks
chmod 755 .claude

# If still fails, check parent directory permissions
ls -ld /workshop/claude-code-aws-blog/starter
```

### Symptom 3: "Cannot write to CLAUDE.md"

**Fix:**
```bash
# Check file permissions
ls -l CLAUDE.md

# Make writable
chmod 644 CLAUDE.md
```

---

## Build Failures

### Symptom 1: "Type error: Property 'content' does not exist"

**Full Error:**
```
Type error: Property 'content' does not exist on type '{ title: string; excerpt: string; ... }'
  in PostCard.tsx
```

**Cause:** Missing `content` prop in posts array

**Fix in `app/page.tsx`:**
```typescript
const posts = [
  {
    title: "Getting Started with Claude Code on AWS Bedrock",
    excerpt: "Learn how to set up and use Claude Code...",
    date: "2025-10-22",
    category: "Getting Started",
    author: "AWS Workshop Team",
    slug: "getting-started-claude-code-bedrock",
    content: "Full post content here for reading time calculation. Learn how to set up and use Claude Code with AWS Bedrock for AI-powered development on AWS infrastructure. This comprehensive guide covers installation, configuration, and best practices for leveraging Claude's capabilities through AWS Bedrock. You'll learn how to authenticate with AWS, configure your development environment, and integrate Claude Code into your existing workflows."
  },
  // Add content field to ALL posts
];
```

### Symptom 2: "Module not found: Can't resolve '@/app/lib/readingTime'"

**Cause:** Missing readingTime utility file

**Fix:**
```bash
# Check if file exists
ls app/lib/readingTime.ts

# If missing, create it (or use checkpoint)
mkdir -p app/lib

# Ask Claude to create it:
# "Create app/lib/readingTime.ts with calculateReadingTime() function"
```

### Symptom 3: "Unexpected token"

**Example Error:**
```
SyntaxError: Unexpected token '<'
```

**Cause:** Usually importing wrong file type or corrupted file

**Fix:**
```bash
# Run build to see full error
npm run build

# Check the file mentioned in error
# Verify it's valid TypeScript/JavaScript

# If corrupted, restore from checkpoint
cp checkpoints/lesson-XXX/path/to/file.tsx your/path/
```

---

## Hooks Not Triggering

### Symptom
"My hook doesn't run when Claude edits files"

**Checklist:**

```bash
# 1. Check hook configuration exists
cat .claude/settings.json
# or
cat .claude/settings.local.json
# Should show PreToolUse or PostToolUse config

# 2. Verify hook script exists
ls .claude/hooks/

# 3. Check script is executable
ls -l .claude/hooks/*.js .claude/hooks/*.sh
# Should show: -rwxr-xr-x

# 4. Test hook manually
echo '{"tool_name":"Write","tool_input":{"file_path":"test.txt"}}' | node .claude/hooks/your_hook.js
echo $?  # Should be 0 or 2

# 5. RESTART CLAUDE CODE (hooks load at startup!)
exit
claude
```

### Common Hook Issues

**Issue 1: Matcher pattern typo**
```json
// ❌ WRONG - case sensitive!
"matcher": "read|write"

// ✅ RIGHT
"matcher": "Read|Write"
```

**Issue 2: Hook script has syntax errors**
```bash
# Test hook standalone
node .claude/hooks/your_hook.js <<< '{"tool_name":"Write","tool_input":{"file_path":"test.txt"}}'

# Check for errors
```

**Issue 3: Hook path incorrect**
```json
// ❌ WRONG
"command": "hooks/format_hook.sh"

// ✅ RIGHT (relative to project root)
"command": ".claude/hooks/format_hook.sh"

// ✅ ALSO RIGHT (using node for .js files)
"command": "node .claude/hooks/format_hook.js"
```

**Issue 4: Forgot to restart Claude Code**
- Hooks only load when Claude Code starts
- ALWAYS restart after modifying `.claude/settings.json`

---

## Reading Time Feature Issues

### Symptom 1: "Reading time badges don't appear"

**Debugging:**
```bash
# 1. Check ReadingTimeBadge component exists
ls app/components/ReadingTimeBadge.tsx

# 2. Check readingTime utility exists
ls app/lib/readingTime.ts

# 3. Check PostCard imports both
grep -n "ReadingTimeBadge" app/components/PostCard.tsx
grep -n "calculateReadingTime" app/components/PostCard.tsx

# 4. Check posts have content field
grep -A 5 "const posts" app/page.tsx | grep "content:"
```

**Fix:**
If any file is missing, use the checkpoint:
```bash
cp checkpoints/lesson-008/app/lib/readingTime.ts app/lib/
cp checkpoints/lesson-008/app/components/ReadingTimeBadge.tsx app/components/
```

### Symptom 2: "All posts show same reading time"

**Cause:** Posts have identical content or content field is too short

**Fix:**
Ensure each post has unique, substantial content (at least 50-100 words).

### Symptom 3: "Reading time shows '0 min read'"

**Cause:** Content is empty or calculation error

**Fix:**
```typescript
// In app/lib/readingTime.ts, add minimum:
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes); // Minimum 1 minute
}
```

---

## Claude Code General Issues

### Symptom 1: "Claude Code command not found"

**Fix:**
```bash
# Install Claude Code globally
npm install -g @anthropic-ai/claude-code

# Verify installation
which claude
claude --version
```

### Symptom 2: "API key not set"

**Error:**
```
Error: ANTHROPIC_API_KEY environment variable is not set
```

**Fix (AWS Workshop):**
```bash
# API key should be pre-configured
# Check environment:
env | grep ANTHROPIC

# If missing, contact workshop instructor
```

### Symptom 3: "Claude Code freezes/hangs"

**Fix:**
```bash
# Kill Claude Code process
pkill -f claude

# Restart
claude
```

### Symptom 4: "Context limit exceeded"

**Error:**
```
Error: Maximum context length exceeded
```

**Fix:**
```bash
# In Claude Code, compact conversation:
/compact

# Or clear and start fresh:
/clear
```

### Symptom 5: "/init creates empty CLAUDE.md"

**Fix:**
```bash
# Ensure you're in the project root
pwd  # Should be /workshop/claude-code-aws-blog/starter

# Check package.json exists
ls package.json

# Re-run init
claude
/init
```

---

## Still Stuck?

### Debug Checklist
1. [ ] Read the relevant `CHECKPOINT_README.md` if using a checkpoint
2. [ ] Checked this TROUBLESHOOTING.md guide
3. [ ] Verified you're in the correct directory (`/workshop/claude-code-aws-blog/starter`)
4. [ ] Confirmed dev server is running (`npm run dev`)
5. [ ] Restarted Claude Code (many issues resolve with restart)
6. [ ] Tried comparing with checkpoint files (`diff` command)

### Ask Claude for Help
If you're in Claude Code, try:
```
I'm stuck on Exercise [NUMBER] with this error:
[paste error message]

I've tried:
- [what you tried]

Please help me troubleshoot. Check my project structure and suggest fixes.
```

### Workshop Support Resources
- **Raise your hand** for instructor help during workshop
- **Check Slack**: #claude-code-workshop channel
- **Review lesson** again for missed steps
- **Use checkpoints**: See CHECKPOINT_README.md for guidance

### Emergency Recovery
If completely stuck and need to catch up:
```bash
# 1. Back up your work
mv /workshop/claude-code-aws-blog/starter /workshop/claude-code-aws-blog/my-backup

# 2. Copy appropriate checkpoint
cp -r /workshop/claude-code-aws-blog/checkpoints/lesson-008 /workshop/claude-code-aws-blog/starter

# 3. Install and continue
cd /workshop/claude-code-aws-blog/starter
npm install --legacy-peer-deps
npm run dev
```

---

**Remember:** Most issues resolve with:
1. Restarting Claude Code
2. Using `--legacy-peer-deps` for npm
3. Making hooks executable (`chmod +x`)
4. Using CloudFront URLs (not localhost)
5. Checking CHECKPOINT_README.md for guidance
