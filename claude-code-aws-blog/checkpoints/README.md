# Workshop Checkpoints

This directory contains progressive solution states for key workshop exercises. Each checkpoint represents a complete, working version of the blog after completing that lesson.

## 🚀 Quick Start with Scripts

### For Students (Restore a Checkpoint)

```bash
# From the checkpoints directory
cd /workshop/claude-code-aws-blog/checkpoints

# Restore a checkpoint (e.g., lesson 008)
./restore-checkpoint.sh 008

# The script will:
# 1. Warn you about overwriting your current work
# 2. Copy checkpoint files to starter/
# 3. Run npm install automatically
# 4. Show you next steps
```

### For Instructors (Create a Checkpoint)

```bash
# From the checkpoints directory
cd /workshop/claude-code-aws-blog/checkpoints

# Create a checkpoint from current starter/ directory
./create-checkpoint.sh 008

# The script will:
# 1. Copy starter/ to checkpoints/lesson-008/
# 2. Exclude node_modules, .next, .env, etc.
# 3. Show you next steps for documentation
```

### Available Scripts

- **restore-checkpoint.sh** - Restores a checkpoint to your starter directory
  - Usage: `./restore-checkpoint.sh <lesson-number>`
  - Run without arguments to see available checkpoints

- **create-checkpoint.sh** - Creates a checkpoint from the starter directory
  - Usage: `./create-checkpoint.sh <lesson-number>`
  - For instructors/workshop creators only

# ⚠️ IMPORTANT: Understanding Checkpoints

## What Are Checkpoints?

Checkpoints are **completed code snapshots** taken AFTER specific exercises. They serve as:

1. **Safety nets** if you get stuck
2. **Reference implementations** to compare your work
3. **Fast-forward options** to skip to later lessons

## 🎯 Checkpoint Timeline

```
Starter Project → Exercise 004 → Exercise 005 → [CHECKPOINT 005]
                                                      ↓
                                  Exercise 006 → [CHECKPOINT 006]
                                                      ↓
                                  Exercise 007 → [CHECKPOINT 007]
                                                      ↓
                                  Exercise 008 → [CHECKPOINT 008]
                                                      ↓
                                  Exercise 009 → [CHECKPOINT 009]
                                                      ↓
                                  Exercise 010 → [CHECKPOINT 010]
                                                      ↓
                                  Exercise 011 → [CHECKPOINT 011]
```

## 📖 Reading the Checkpoint Table

| Checkpoint | Contains Features FROM | Use BEFORE Starting               |
| ---------- | ---------------------- | --------------------------------- |
| lesson-005 | Exercises 004-005      | Exercise 006                      |
| lesson-006 | Exercises 004-006      | Exercise 007                      |
| lesson-007 | Exercises 004-007      | Exercise 008                      |
| lesson-008 | Exercises 004-008      | Exercise 009                      |
| lesson-009 | Exercises 004-009      | Exercise 010                      |
| lesson-010 | Exercises 004-010      | Exercise 011                      |
| lesson-011 | Exercises 004-011      | Exercise 012 or workshop complete |

## ⚠️ Critical: Checkpoint Features Already Implemented

**Checkpoint 008 Example:**
If you copy `checkpoint/lesson-008/` to your working directory:

- ✅ Reading time calculator **is already built**
- ✅ MCP Playwright **is already configured**
- ✅ All previous features **are already implemented**

**What does this mean for Exercise 008?**
If Exercise 008 says "Build the reading time calculator," but you're using checkpoint 008:

1. The feature already exists in your code
2. Read the checkpoint's `CHECKPOINT_README.md` for guidance
3. Consider Option 1: Review the existing implementation
4. Or Option 2: Delete the feature files and rebuild yourself

## 🎓 Learning Strategy

**For Maximum Learning:**

- Avoid checkpoints until truly stuck
- Build features yourself first
- Use checkpoints only for reference or recovery

**For Time-Constrained Workshops:**

- Skip to checkpoints to focus on specific lessons
- Read `CHECKPOINT_README.md` to understand what you skipped

---

## Purpose

Checkpoints serve as:

- **Safety Net**: Students who fall behind can copy a checkpoint to catch up
- **Reference Solutions**: Show the expected outcome after each exercise
- **Testing Tool**: Validate that exercises produce working code
- **Instructor Aid**: Demonstrate complete implementations

## Available Checkpoints

### [Checkpoint 005: Hero Section](lesson-005/)

**After Exercise 005 - Making Changes**

- ✅ AWS-themed hero section with gradient
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Orange CTA button with hover effects
- ✅ Fade-in animations
- ✅ Git workflow demonstrated

### [Checkpoint 006: Blog Post List](lesson-006/)

**After Exercise 006 - Conversation Control**

- ✅ All features from Checkpoint 005
- ✅ Blog post list and navigation
- ✅ Post cards with AWS styling
- ✅ CloudFront proxy navigation setup

### [Checkpoint 007: Custom Commands](lesson-007/)

**After Exercise 007 - Custom Commands**

- ✅ All features from Checkpoint 006
- ✅ Custom `/new-aws-post` command
- ✅ Blog post generation workflow
- ✅ Command configuration in `.claude/commands/`

### [Checkpoint 008: MCP Integration](lesson-008/)

**After Exercise 008 - Extending Claude Code**

- ✅ All features from Checkpoint 007
- ✅ Reading time calculator with AWS Orange badges
- ✅ Playwright MCP integration
- ✅ Visual testing setup

### [Checkpoint 009: GitHub Integration](lesson-009/)

**After Exercise 009 - GitHub Workflow**

- ✅ All features from Checkpoint 008
- ✅ GitHub integration and PR workflow
- ✅ Collaboration features
- ✅ Issue tracking

### [Checkpoint 010: Format Hook](lesson-010/)

**After Exercise 010 - Introducing Hooks**

- ✅ All features from Checkpoint 009
- ✅ Post-tool format hook for markdown
- ✅ Prettier auto-formatting on saves
- ✅ Hook configuration in `.claude/settings.json`

### [Checkpoint 011: Complete Hooks](lesson-011/)

**After Exercise 011 - Multiple Hooks**

- ✅ All features from Checkpoint 010
- ✅ Pre-tool protection hook (.env blocking)
- ✅ Frontmatter validation hook
- ✅ TypeScript type-checking hook
- ✅ Multiple hooks composition
- ✅ Production-ready blog

## How to Use Checkpoints

### For Students (Catching Up)

**Recommended: Use the restore script** (see Quick Start above)

If you fall behind during the workshop:

1. **Use the restore script**:

   ```bash
   cd /workshop/claude-code-aws-blog/checkpoints
   ./restore-checkpoint.sh 008
   ```

2. **Continue with next exercise**:
   - You're now at the starting state for the next exercise
   - Continue with the workshop from that point

**Manual method** (if you prefer):

1. **Save your current work first**:

   ```bash
   mv /workshop/claude-code-aws-blog/starter /workshop/claude-code-aws-blog/starter-backup
   ```

2. **Copy checkpoint to your working directory**:
   ```bash
   cp -r /workshop/claude-code-aws-blog/checkpoints/lesson-008/ /workshop/claude-code-aws-blog/starter
   cd /workshop/claude-code-aws-blog/starter
   npm install
   ```

### For Instructors (Demonstrating)

**Creating checkpoints**: Use the `create-checkpoint.sh` script (see Quick Start above)

To show expected outcomes:

1. **Navigate to checkpoint**:

   ```bash
   cd /workshop/claude-code-aws-blog/checkpoints/lesson-005
   npm install
   npm run dev
   ```

2. **Open in browser**:
   - Local: `http://localhost:3000`
   - AWS Workshop: `https://{cloudfront-url}/proxy/3000/`

3. **Show features**:
   - Demonstrate what students should have built
   - Compare with student implementations
   - Debug common issues

### For Testing

To validate exercise instructions:

```bash
# Test each checkpoint independently
for checkpoint in lesson-005 lesson-006 lesson-007 lesson-008 lesson-009 lesson-010 lesson-011; do
  cd checkpoints/$checkpoint
  npm install
  npm run build
  npm run dev &
  sleep 5
  curl -f http://localhost:3000 || echo "FAILED: $checkpoint"
  pkill -f "next dev"
  cd ../..
done
```

## Checkpoint Structure

Each checkpoint contains:

- **Complete project files**: All source code at that stage
- **README.md**: What's included, how to use it
- **package.json**: All dependencies for that stage
- **CLAUDE.md**: Updated with features added up to that point
- **.claude/**: Any commands or hooks configured by that lesson

## Important Notes

### Not Included

- **node_modules/**: Run `npm install` after copying
- **.next/**: Build artifacts (run `npm run build` to generate)
- **Personal configurations**: `.claude/settings.local.json`, environment variables

### Git Usage

Each checkpoint represents a complete state, but you can also:

- Use git commits as "mini-checkpoints" during exercises
- Tag commits at checkpoint milestones: `git tag lesson-005`
- Create branches for experiments: `git checkout -b experiment-reading-time`

### Incremental vs Full Checkpoints

These are **full checkpoints** (complete project at that stage):

- Copy entire directory to start fresh
- All previous features included
- Independent and self-contained

If you prefer **incremental** (just changes since last checkpoint):

- Use `git diff` between checkpoint directories
- Apply specific changes to your project
- More advanced, not recommended for beginners

## Troubleshooting

### "Module not found" errors

```bash
cd checkpoints/lesson-XXX
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use

```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Checkpoint doesn't match expected state

- Check exercise instructions for missed steps
- Compare your files with checkpoint files
- Ask instructor for help

### Want to see differences

```bash
# Compare your project with checkpoint
diff -r your-project/ checkpoints/lesson-005/ --exclude=node_modules --exclude=.next
```

## Workshop Timeline

Based on extended workshop schedule:

| Time    | Checkpoint     | Purpose                              | What to Check                           |
| ------- | -------------- | ------------------------------------ | --------------------------------------- |
| ~15 min | Checkpoint 005 | Validate hero section implementation | Orange gradient, CTA button             |
| ~25 min | Checkpoint 006 | Verify blog post list and navigation | Post cards, links working               |
| ~35 min | Checkpoint 007 | Confirm custom command working       | `/new-aws-post` creates posts           |
| ~50 min | Checkpoint 008 | Check MCP and reading time feature   | Badges on posts, Playwright screenshots |
| ~65 min | Checkpoint 009 | Validate GitHub integration          | PR workflow, collaboration              |
| ~80 min | Checkpoint 010 | Verify format hook configured        | Auto-formatting on edits                |
| ~95 min | Checkpoint 011 | Show complete blog with all hooks    | PreToolUse, PostToolUse, type-checking  |

**Note:** First-time students may need 1.5-2x these times. See each checkpoint's `CLAUDE.md` for detailed verification steps.

## Contributing

After the workshop, if you:

- Found errors in a checkpoint
- Have improvements to suggest
- Want to add additional checkpoints for exercises 012-014

Please submit feedback to workshop instructors.

---

**Remember**: Checkpoints are learning aids, not shortcuts. Try to complete exercises on your own first. Use checkpoints only when stuck or falling behind.
