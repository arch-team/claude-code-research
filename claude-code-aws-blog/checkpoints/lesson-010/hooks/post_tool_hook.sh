#!/bin/bash

# Post-tool hook for Edit and Write operations
# Auto-formats markdown files with Prettier
#
# Exit codes:
#   0 - Success

# Read JSON from stdin
INPUT_JSON=$(cat)

# Extract file_path from JSON
# Hooks receive: {"tool_name":"Write","tool_input":{"file_path":"..."}}
if command -v jq &> /dev/null; then
    FILE_PATH=$(echo "$INPUT_JSON" | jq -r '.tool_input.file_path // empty')
else
    # Fallback without jq
    FILE_PATH=$(echo "$INPUT_JSON" | grep -o '"file_path":"[^"]*"' | head -1 | sed 's/"file_path":"\(.*\)"/\1/')
fi

# If no file path found or not markdown, exit
if [ -z "$FILE_PATH" ]; then
    exit 0
fi

# Check if the file is markdown
if [[ "$FILE_PATH" =~ \.(md|mdx)$ ]]; then
    npx prettier --write "$FILE_PATH" 2>/dev/null && echo "✓ Formatted markdown: $FILE_PATH"
fi

exit 0
