#!/bin/bash

# create-checkpoint.sh - Create a checkpoint from the starter directory
# Usage: ./create-checkpoint.sh <lesson-number>
# Example: ./create-checkpoint.sh 005

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if lesson number is provided
if [ -z "$1" ]; then
  echo -e "${RED}Error: Lesson number required${NC}"
  echo "Usage: ./create-checkpoint.sh <lesson-number>"
  echo "Example: ./create-checkpoint.sh 005"
  exit 1
fi

LESSON_NUM="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
STARTER_DIR="$PROJECT_ROOT/starter"
CHECKPOINT_DIR="$SCRIPT_DIR/lesson-$LESSON_NUM"

# Validate lesson number format (3 digits)
if ! [[ "$LESSON_NUM" =~ ^[0-9]{3}$ ]]; then
  echo -e "${YELLOW}Warning: Lesson number should be 3 digits (e.g., 005, 008)${NC}"
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Check if starter directory exists
if [ ! -d "$STARTER_DIR" ]; then
  echo -e "${RED}Error: Starter directory not found at $STARTER_DIR${NC}"
  exit 1
fi

# Confirm if checkpoint already exists
if [ -d "$CHECKPOINT_DIR" ]; then
  echo -e "${YELLOW}Warning: Checkpoint lesson-$LESSON_NUM already exists${NC}"
  read -p "Overwrite existing checkpoint? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
  fi
  rm -rf "$CHECKPOINT_DIR"
fi

echo -e "${GREEN}Creating checkpoint for lesson $LESSON_NUM...${NC}"
echo "Source: $STARTER_DIR"
echo "Destination: $CHECKPOINT_DIR"
echo

# Create checkpoint directory
mkdir -p "$CHECKPOINT_DIR"

# Copy files using rsync with exclusions
rsync -av \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='out' \
  --exclude='.env*' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='.DS_Store' \
  --exclude='coverage' \
  --exclude='.turbo' \
  --exclude='dist' \
  --exclude='build' \
  "$STARTER_DIR/" "$CHECKPOINT_DIR/"

echo
echo -e "${GREEN}✓ Checkpoint created successfully!${NC}"
echo
echo "Next steps:"
echo "1. Create/update CHECKPOINT_README.md in $CHECKPOINT_DIR"
echo "2. Document what features are included"
echo "3. Test the checkpoint:"
echo "   cd $CHECKPOINT_DIR"
echo "   npm install"
echo "   npm run dev"
echo
echo "Checkpoint location: $CHECKPOINT_DIR"
