#!/usr/bin/env node

/**
 * PostToolUse Hook: TypeScript Type-Checking
 *
 * This hook runs TypeScript type-checking after editing .ts or .tsx files.
 * It provides informational feedback about type errors but ALWAYS allows the operation
 * (exit code 0) so Claude can see the errors and fix them in subsequent edits.
 *
 * Exit codes:
 * - 0: Always (non-blocking feedback hook)
 */

const { execSync } = require('child_process');
const path = require('path');

// Read JSON input from stdin
let inputJson = '';
process.stdin.on('data', (chunk) => {
  inputJson += chunk;
});

process.stdin.on('end', () => {
  try {
    const hookData = JSON.parse(inputJson);

    // Extract file path from tool_input (see CLAUDE.md for JSON structure)
    const filePath = hookData.tool_input?.file_path;

    if (!filePath) {
      // No file path provided, exit silently
      process.exit(0);
    }

    // Filter: Only run for TypeScript files (.ts, .tsx)
    const ext = path.extname(filePath).toLowerCase();
    if (ext !== '.ts' && ext !== '.tsx') {
      // Not a TypeScript file, exit silently
      process.exit(0);
    }

    // Run TypeScript type-checking on entire project
    // We check the whole project (not just the changed file) to catch cascading type errors
    // For example, if we change a function signature, we want to catch all call sites

    console.error(`\n🔍 Running TypeScript type-check after editing: ${path.basename(filePath)}\n`);

    let tscOutput = '';
    let hasErrors = false;

    try {
      // Run tsc --noEmit and capture output
      // Note: tsc exits with non-zero code when there are type errors
      tscOutput = execSync('npx tsc --noEmit', {
        encoding: 'utf8',
        stdio: 'pipe',
        cwd: process.cwd()
      });

      // If we reach here, no type errors were found
      console.error('✅ No TypeScript errors found\n');

    } catch (error) {
      // tsc exited with non-zero code, meaning type errors exist
      hasErrors = true;
      tscOutput = error.stdout || error.stderr || '';

      if (error.code === 127 || error.message.includes('command not found')) {
        // tsc is not available
        console.error('⚠️  TypeScript compiler (tsc) not found. Skipping type-check.');
        console.error('   Run: npm install typescript\n');
        process.exit(0);
      }
    }

    if (hasErrors && tscOutput) {
      // Parse and format TypeScript errors
      const errorLines = tscOutput.split('\n').filter(line => line.trim());

      // Count the number of errors
      const errorCountMatch = tscOutput.match(/Found (\d+) error/);
      const errorCount = errorCountMatch ? errorCountMatch[1] : 'multiple';

      console.error('❌ TypeScript type errors detected:\n');
      console.error('─'.repeat(80));

      // Output the full error messages from tsc
      errorLines.forEach(line => {
        // Highlight error lines for readability
        if (line.includes('error TS')) {
          console.error(`\n${line}`);
        } else if (line.trim()) {
          console.error(line);
        }
      });

      console.error('─'.repeat(80));
      console.error(`\n📊 Total: ${errorCount} type error(s) found`);
      console.error('💡 Please review and fix these type errors\n');
    }

    // Always exit with code 0 (non-blocking)
    // This allows the file write to succeed, but Claude sees the errors and can fix them
    process.exit(0);

  } catch (error) {
    // Unexpected error in hook execution
    console.error(`⚠️  Type-check hook error: ${error.message}`);
    // Still exit with 0 to not block the operation
    process.exit(0);
  }
});
