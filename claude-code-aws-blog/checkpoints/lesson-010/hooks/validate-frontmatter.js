#!/usr/bin/env node

/**
 * PostToolUse Hook: Blog Post Frontmatter Validator
 *
 * This hook validates YAML frontmatter in blog post markdown files after they are written.
 * It runs after Write/Edit operations and provides validation feedback to Claude Code.
 *
 * Exit codes:
 * - 0: Validation passed or file doesn't need validation
 * - 2: Validation failed (Claude will see stderr and can fix issues)
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

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
      // No file path provided, allow operation
      process.exit(0);
    }

    // Filter 1: Only process files in content/posts/ directory
    if (!filePath.includes('content/posts/')) {
      process.exit(0);
    }

    // Filter 2: Only process .md and .mdx files
    const ext = path.extname(filePath).toLowerCase();
    if (ext !== '.md' && ext !== '.mdx') {
      process.exit(0);
    }

    // Read the file from disk (PostToolUse hooks run after file is saved)
    if (!fs.existsSync(filePath)) {
      console.error(`Error: File not found at ${filePath}`);
      process.exit(2);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Parse frontmatter using gray-matter
    let parsed;
    try {
      parsed = matter(fileContent);
    } catch (parseError) {
      console.error(`Frontmatter parsing error: ${parseError.message}`);
      process.exit(2);
    }

    const frontmatter = parsed.data;
    const errors = [];

    // Validation rules for required fields

    // 1. Title: non-empty string
    if (!frontmatter.title || typeof frontmatter.title !== 'string' || frontmatter.title.trim() === '') {
      errors.push(`- title: Required non-empty string. Current value: ${JSON.stringify(frontmatter.title)}`);
    }

    // 2. Date: valid YYYY-MM-DD format
    if (!frontmatter.date) {
      errors.push(`- date: Required field missing. Expected format: YYYY-MM-DD (e.g., "2025-10-25")`);
    } else {
      // gray-matter may parse dates as Date objects, convert back to check format
      let dateStr;
      if (frontmatter.date instanceof Date) {
        // If it's a Date object, format it as YYYY-MM-DD to check validity
        const year = frontmatter.date.getFullYear();
        const month = String(frontmatter.date.getMonth() + 1).padStart(2, '0');
        const day = String(frontmatter.date.getDate()).padStart(2, '0');
        dateStr = `${year}-${month}-${day}`;

        // Check if the Date object is valid
        if (isNaN(frontmatter.date.getTime())) {
          errors.push(`- date: Invalid date value. Expected format: YYYY-MM-DD (e.g., "2025-10-25")`);
        } else {
          // If gray-matter parsed it as a Date object, the original format was likely not a quoted string
          // Proper format should be: date: "2025-10-25" (quoted string, not unquoted date)
          errors.push(`- date: Date should be a quoted string in YYYY-MM-DD format. Example: date: "2025-10-25" (note the quotes)`);
        }
      } else {
        dateStr = String(frontmatter.date);
      }

      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(dateStr)) {
        errors.push(`- date: Invalid format. Current value: ${JSON.stringify(frontmatter.date)}. Expected format: YYYY-MM-DD (e.g., "2025-10-25")`);
      } else {
        // Validate it's a real date
        const dateParts = dateStr.split('-');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]);
        const day = parseInt(dateParts[2]);

        // Check month and day are in valid ranges
        if (month < 1 || month > 12) {
          errors.push(`- date: Invalid month. Current value: "${dateStr}". Month must be between 01 and 12`);
        } else if (day < 1 || day > 31) {
          errors.push(`- date: Invalid day. Current value: "${dateStr}". Day must be between 01 and 31`);
        } else {
          // Check if it's a valid date for that month/year
          const testDate = new Date(year, month - 1, day);
          if (testDate.getFullYear() !== year ||
              testDate.getMonth() !== month - 1 ||
              testDate.getDate() !== day) {
            errors.push(`- date: Invalid date. Current value: "${dateStr}". Please use a valid date in YYYY-MM-DD format`);
          }
        }
      }
    }

    // 3. Author: non-empty string
    if (!frontmatter.author || typeof frontmatter.author !== 'string' || frontmatter.author.trim() === '') {
      errors.push(`- author: Required non-empty string. Current value: ${JSON.stringify(frontmatter.author)}`);
    }

    // 4. Category: must be one of allowed values
    const allowedCategories = ['Bedrock', 'Infrastructure', 'MCP', 'CI/CD', 'Best Practices'];
    if (!frontmatter.category) {
      errors.push(`- category: Required field missing. Allowed values: ${allowedCategories.join(', ')}`);
    } else if (!allowedCategories.includes(frontmatter.category)) {
      errors.push(`- category: Invalid value "${frontmatter.category}". Allowed values: ${allowedCategories.join(', ')}`);
    }

    // 5. Tags: array with 1-5 items
    if (!frontmatter.tags) {
      errors.push(`- tags: Required field missing. Expected array with 1-5 items (e.g., ["tag1", "tag2"])`);
    } else if (!Array.isArray(frontmatter.tags)) {
      errors.push(`- tags: Must be an array. Current value: ${JSON.stringify(frontmatter.tags)}`);
    } else if (frontmatter.tags.length < 1) {
      errors.push(`- tags: Array must contain at least 1 tag. Current count: ${frontmatter.tags.length}`);
    } else if (frontmatter.tags.length > 5) {
      errors.push(`- tags: Array must contain at most 5 tags. Current count: ${frontmatter.tags.length}`);
    } else {
      // Validate each tag is a non-empty string
      frontmatter.tags.forEach((tag, index) => {
        if (typeof tag !== 'string' || tag.trim() === '') {
          errors.push(`- tags[${index}]: Must be a non-empty string. Current value: ${JSON.stringify(tag)}`);
        }
      });
    }

    // 6. Published: boolean (optional field, but if present must be boolean)
    if (frontmatter.published !== undefined && typeof frontmatter.published !== 'boolean') {
      errors.push(`- published: Must be a boolean (true or false). Current value: ${JSON.stringify(frontmatter.published)}`);
    }

    // 7. Excerpt: non-empty string (commonly used field)
    if (frontmatter.excerpt && (typeof frontmatter.excerpt !== 'string' || frontmatter.excerpt.trim() === '')) {
      errors.push(`- excerpt: If provided, must be a non-empty string. Current value: ${JSON.stringify(frontmatter.excerpt)}`);
    }

    // Report validation results
    if (errors.length > 0) {
      console.error(`\nBlog post frontmatter validation failed for: ${path.basename(filePath)}`);
      console.error(`\nValidation errors found:\n`);
      errors.forEach(error => console.error(error));
      console.error(`\nPlease fix these errors in the frontmatter section of the blog post.`);
      console.error(`Refer to CLAUDE.md "Blog Post Structure" section for correct frontmatter format.\n`);
      process.exit(2);
    }

    // Validation passed
    process.exit(0);

  } catch (error) {
    console.error(`Hook execution error: ${error.message}`);
    process.exit(2);
  }
});
