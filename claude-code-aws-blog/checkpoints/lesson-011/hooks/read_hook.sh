#!/bin/bash

# Pre-tool hook for Read and Grep operations
# Blocks access to .env files for security
#
# Exit codes:
#   0 - Allow operation
#   2 - Block operation (security violation)
#   1 - Error in hook execution

# Read JSON from stdin
INPUT_JSON=$(cat)

# Extract file_path from JSON using jq or grep
# Hooks receive: {"tool_name":"Read","tool_input":{"file_path":"..."}}
if command -v jq &> /dev/null; then
    FILE_PATH=$(echo "$INPUT_JSON" | jq -r '.tool_input.file_path // .tool_input.path // empty')
else
    # Fallback to grep/sed if jq not available
    FILE_PATH=$(echo "$INPUT_JSON" | grep -o '"file_path":"[^"]*"' | sed 's/"file_path":"\(.*\)"/\1/' || echo "$INPUT_JSON" | grep -o '"path":"[^"]*"' | sed 's/"path":"\(.*\)"/\1/')
fi

# If no file path found, allow the operation
if [ -z "$FILE_PATH" ]; then
    exit 0
fi

# Check if the path contains .env
if [[ "$FILE_PATH" == *".env"* ]]; then
    echo "❌ SECURITY: Access denied to .env file: $FILE_PATH" >&2
    echo "   Reason: Sensitive environment files are protected" >&2
    exit 2  # Exit code 2 blocks the operation
fi

# Allow the operation
exit 0
