# Claude Code Workshop - Quick Reference

## 🚨 Emergency Commands

**Something's Broken?**
```bash
# 1. Restart Claude Code
exit
claude

# 2. Kill port 3000 if blocked
pkill -f next-dev

# 3. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# 4. Use checkpoint as backup
cp -r checkpoints/lesson-XXX/* /workshop/claude-code-aws-blog/starter/
cd /workshop/claude-code-aws-blog/starter
npm install --legacy-peer-deps
```

---

## 📍 Where Am I?

**Check Current State:**
```bash
# What lesson am I on?
cat CLAUDE.md | head -5

# What features do I have?
ls app/components/  # Shows which components exist
ls app/lib/         # Shows utilities (readingTime.ts?)
ls .claude/commands/  # Shows custom commands
ls .claude/hooks/   # Shows hooks

# Am I using a checkpoint?
cat CHECKPOINT_README.md  # If exists, you're on a checkpoint
```

**Project Structure Quick Check:**
```
/workshop/claude-code-aws-blog/
├── starter/              ← YOUR WORKING DIRECTORY
├── checkpoints/          ← Safety nets (lesson-005, 008, 010, 014)
└── README.md
```

---

## 🌐 URLs to Remember

**AWS Workshop Environment:**
- **Dev Server**: `https://[your-cloudfront].cloudfront.net/proxy/3000/`
- **VS Code**: `https://[your-cloudfront].cloudfront.net/`

**Find Your CloudFront URL:**
```bash
echo $CLOUDFRONT_DOMAIN
# or
env | grep CLOUDFRONT
```

**⚠️ IMPORTANT:** Always use CloudFront URLs in workshop, NOT localhost!

---

## ⌨️ Claude Code Commands

| Command | What It Does | When to Use |
|---------|-------------|-------------|
| `/init` | Create CLAUDE.md | Start of every project |
| `/clear` | Fresh conversation | Switching tasks |
| `/compact` | Summarize conversation | Long sessions |
| `@filename.tsx` | Reference file | Give Claude context |
| `Escape` | Stop Claude | Redirect mid-task |
| `Escape Escape` | View history | Navigate conversation |
| `Shift+Tab x2` | Enable Plan Mode | Complex multi-file changes |
| `/new-aws-post` | Custom command | Create blog posts (after lesson 007) |

**Thinking Modes:**
- `"think about..."` → 4,000 token budget
- `"think hard about..."` → 10,000 tokens
- `"ultrathink about..."` → 32,000 tokens

---

## 🔧 Common Fixes

### Reading Time Not Showing?
```bash
# Check files exist
ls app/lib/readingTime.ts
ls app/components/ReadingTimeBadge.tsx

# Check PostCard uses it
grep "ReadingTimeBadge" app/components/PostCard.tsx
grep "content:" app/page.tsx  # Posts need content field
```

### MCP Not Working?
```bash
# Check installation
claude mcp list  # Should show: playwright

# Check permissions
cat .claude/settings.local.json  # Should have: "allow": ["mcp__playwright"]

# Reinstall if needed
claude mcp add playwright npx @modelcontextprotocol/server-playwright

# RESTART CLAUDE CODE
exit
claude
```

### Build Errors?
```bash
# See full error
npm run build

# Common fix: reinstall
npm install --legacy-peer-deps

# Check imports
grep -r "from '@/app" app/  # Verify paths
```

### Hooks Not Running?
```bash
# Make executable
chmod +x .claude/hooks/*.sh

# Check configuration
cat .claude/settings.json

# RESTART CLAUDE CODE (required!)
exit
claude
```

---

## 🎯 Workshop Progress Checklist

### Lesson 004: Context ✓
- [ ] `/init` created CLAUDE.md
- [ ] AWS colors added to CLAUDE.md
- [ ] `@mentions` tested

### Lesson 005: Hero Section ✓
- [ ] Orange gradient hero
- [ ] CTA button styled
- [ ] Plan Mode tested

### Lesson 008: Reading Time + MCP ✓
- [ ] Navigation header
- [ ] Post cards with reading time
- [ ] Playwright screenshots work
- [ ] `/new-aws-post` command available

### Lesson 010: Hooks ✓
- [ ] `.claude/settings.json` has PostToolUse hook
- [ ] `format_hook.sh` executable
- [ ] Auto-formatting on edits

### Lesson 014: Complete ✓
- [ ] All features working
- [ ] Blog looks professional
- [ ] Ready to deploy

---

## 📦 Checkpoint Quick Reference

| Checkpoint | After Lesson | Has These Features |
|------------|-------------|-------------------|
| **lesson-005** | 005 | Hero section |
| **lesson-008** | 008 | + Navigation + Posts + Reading Time + MCP |
| **lesson-010** | 010 | + GitHub + Format Hooks |
| **lesson-014** | 014 | + All Hooks + SDK + Complete |

**Using Checkpoints:**
```bash
# See what's in a checkpoint
cat checkpoints/lesson-008/CHECKPOINT_README.md

# Copy checkpoint to recover
cp -r checkpoints/lesson-008/* /workshop/claude-code-aws-blog/starter/
cd /workshop/claude-code-aws-blog/starter
npm install --legacy-peer-deps
```

---

## 🐛 Quick Diagnostics

**Dev Server Issues:**
```bash
# Is it running?
ps aux | grep next-dev

# Restart it
pkill -f next-dev
npm run dev

# Check port
lsof -i:3000
```

**File Permission Issues:**
```bash
# Make hooks executable
chmod +x .claude/hooks/*.sh

# Check permissions
ls -l .claude/hooks/
```

**npm Issues:**
```bash
# Always use this flag
npm install --legacy-peer-deps

# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## 🎓 Learning Aids

**Reading a CHECKPOINT_README.md:**
1. Shows what's included
2. When to use it
3. How to copy it
4. What you should understand

**Using TROUBLESHOOTING.md:**
1. Find your error in index
2. Follow the fix steps
3. Check verification commands
4. See TROUBLESHOOTING.md for details

**Exercise Pattern:**
- **Introduction**: What you'll learn
- **Tasks**: Step-by-step instructions
- **Success Criteria**: ✅ How to know it worked
- **Troubleshooting**: 🆘 Common issues

---

## 💡 Pro Tips

1. **Always restart Claude Code after**:
   - Adding/modifying hooks
   - Changing settings.json
   - Installing MCP servers

2. **Use checkpoints wisely**:
   - Read CHECKPOINT_README.md first
   - Understand what you're skipping
   - Consider using for reference, not copying

3. **Common command sequence**:
   ```bash
   npm install --legacy-peer-deps
   npm run dev  # (in background)
   claude
   /init  # (if new project)
   ```

4. **Debug workflow**:
   - Check TROUBLESHOOTING.md
   - Compare with checkpoint
   - Ask Claude for help
   - Raise hand for instructor

5. **Time savers**:
   - `@filename` instead of describing files
   - Plan Mode for multi-file changes
   - `/compact` to preserve learning
   - Hooks for automatic formatting

---

## 📞 Get Help

**In Order of Escalation:**
1. Check this QUICK_REFERENCE.md
2. Read TROUBLESHOOTING.md
3. Compare with checkpoint CHECKPOINT_README.md
4. Ask Claude Code for help
5. Raise hand for workshop instructor

**When Asking for Help:**
Provide:
- Which exercise you're on
- What you were trying to do
- The error message (exact text)
- What you've already tried

---

**Keep this handy during the workshop!** Most questions are answered here or in TROUBLESHOOTING.md.
