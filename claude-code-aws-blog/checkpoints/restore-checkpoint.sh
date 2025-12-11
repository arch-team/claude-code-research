#!/bin/bash

# restore-checkpoint.sh - Restore a checkpoint to the starter directory
# Usage: ./restore-checkpoint.sh <lesson-number>
# Example: ./restore-checkpoint.sh 008

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if lesson number is provided
if [ -z "$1" ]; then
  echo -e "${RED}Error: Lesson number required${NC}"
  echo "Usage: ./restore-checkpoint.sh <lesson-number>"
  echo "Example: ./restore-checkpoint.sh 008"
  echo
  echo "Available checkpoints:"
  ls -d lesson-*/ 2>/dev/null | sed 's|lesson-||; s|/||' | sort | sed 's/^/  - /'
  exit 1
fi

LESSON_NUM="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CHECKPOINT_DIR="$SCRIPT_DIR/lesson-$LESSON_NUM"
STARTER_DIR="$PROJECT_ROOT/starter"

# Check if checkpoint exists
if [ ! -d "$CHECKPOINT_DIR" ]; then
  echo -e "${RED}Error: Checkpoint lesson-$LESSON_NUM not found${NC}"
  echo
  echo "Available checkpoints:"
  ls -d "$SCRIPT_DIR"/lesson-*/ 2>/dev/null | sed 's|.*/lesson-||; s|/||' | sort | sed 's/^/  - /'
  exit 1
fi

# Show warning
echo -e "${YELLOW}⚠️  WARNING: This will overwrite your current starter directory${NC}"
echo
echo "Source: $CHECKPOINT_DIR"
echo "Destination: $STARTER_DIR"
echo
echo -e "${RED}This will replace ALL files in your starter directory!${NC}"
echo -e "Make sure you've backed up any work you want to keep."
echo

# Require confirmation
read -p "Are you sure you want to continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled. No changes were made."
  exit 0
fi

echo
echo -e "${BLUE}Restoring checkpoint lesson-$LESSON_NUM...${NC}"

# Create starter directory if it doesn't exist
mkdir -p "$STARTER_DIR"

# Copy files using rsync
rsync -av --delete \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='out' \
  --exclude='*.log' \
  --exclude='.DS_Store' \
  "$CHECKPOINT_DIR/" "$STARTER_DIR/"

echo
echo -e "${BLUE}Installing dependencies...${NC}"

# Navigate to starter directory and install dependencies
cd "$STARTER_DIR"

if [ -f "package.json" ]; then
  npm install
else
  echo -e "${RED}Warning: No package.json found in checkpoint${NC}"
fi

echo
echo -e "${GREEN}✓ Checkpoint restored successfully!${NC}"
echo
echo "Next steps:"
echo "1. Navigate to the starter directory:"
echo "   cd $STARTER_DIR"
echo "2. Start the development server:"
echo "   npm run dev"
echo "3. Open your browser to http://localhost:3000"
echo "   (or your CloudFront URL: https://{cloudfront-url}/proxy/3000/)"
echo
echo -e "${YELLOW}Note: Read the checkpoint's README for details on included features${NC}"
echo "   $CHECKPOINT_DIR/CHECKPOINT_README.md"
