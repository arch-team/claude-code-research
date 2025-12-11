#!/usr/bin/env node

/**
 * Pre-tool hook for Read and Grep operations
 * Blocks access to .env files for security
 *
 * Exit codes:
 *   0 - Allow operation
 *   2 - Block operation (security violation)
 *   1 - Error in hook execution
 */

process.stdin.setEncoding('utf8');

let inputData = '';

// Read all data from stdin
process.stdin.on('data', (chunk) => {
  inputData += chunk;
});

process.stdin.on('end', () => {
  try {
    // Parse the JSON input
    const input = JSON.parse(inputData);

    // Extract tool information
    const toolName = input.tool_name;
    const toolInput = input.tool_input || {};

    // Get the file path being accessed
    let filePath = null;

    if (toolName === 'Read') {
      filePath = toolInput.file_path;
    } else if (toolName === 'Grep') {
      filePath = toolInput.path;
    }

    // If no file path found, allow the operation
    if (!filePath) {
      process.exit(0);
    }

    // Check if the path contains .env
    if (filePath.includes('.env')) {
      console.error(`❌ SECURITY: Access denied to .env file: ${filePath}`);
      console.error('   Reason: Sensitive environment files are protected');
      process.exit(2); // Exit code 2 blocks the operation
    }

    // Allow the operation
    process.exit(0);

  } catch (error) {
    // Error handling - log to stderr and exit with error code
    console.error('❌ Hook error:', error.message);
    process.exit(1);
  }
});

process.stdin.on('error', (error) => {
  console.error('❌ Stdin error:', error.message);
  process.exit(1);
});
