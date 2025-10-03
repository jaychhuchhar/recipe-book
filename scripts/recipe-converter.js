#!/usr/bin/env node

/**
 * Recipe Converter Tool
 * Converts simple text/MDX files into the full recipe format with custom components
 *
 * Usage:
 *   node scripts/recipe-converter.js input.txt [output.mdx] [--category breakfast]
 *   npm run convert-recipe input.txt
 */

const fs = require('fs');
const path = require('path');

// Default values for recipe metadata
const DEFAULT_VALUES = {
  author: "The IT Chef",
  rating: "4.5",
  difficulty: "Medium",
  cuisine: "International",
  dietary: "None",
  allergens: "None",
  cost: "$5",
  source: "Home Recipe"
};

// No fixed category mapping - use folder names directly

class RecipeConverter {
  constructor(options = {}) {
    this.recipe = {
      frontmatter: {},
      ingredients: [],
      ingredientCategories: [], // For categorized ingredients
      instructions: [],
      notes: [],
      tags: []
    };
    this.options = options;
  }

  parseInput(content) {
    const lines = content.split('\n').map(line => line.trim());
    let currentSection = null;
    let currentInstructionSection = null;
    let currentIngredientCategory = null;
    let stepNumber = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (!line) continue;

      // Parse frontmatter-style metadata
      if (line.toLowerCase().startsWith('title:')) {
        this.recipe.frontmatter.title = this.extractValue(line);
        continue;
      }
      if (line.toLowerCase().startsWith('description:')) {
        this.recipe.frontmatter.description = this.extractValue(line);
        continue;
      }
      if (line.toLowerCase().startsWith('category:')) {
        this.recipe.frontmatter.category = this.extractValue(line);
        continue;
      }
      if (line.toLowerCase().startsWith('cuisine:')) {
        this.recipe.frontmatter.cuisine = this.extractValue(line);
        continue;
      }
      if (line.toLowerCase().startsWith('difficulty:')) {
        this.recipe.frontmatter.difficulty = this.extractValue(line);
        continue;
      }
      if (line.toLowerCase().startsWith('servings:')) {
        this.recipe.frontmatter.servings = this.extractValue(line);
        continue;
      }
      if (line.toLowerCase().startsWith('prep time:') || line.toLowerCase().startsWith('preptime:')) {
        this.recipe.frontmatter.prepTime = this.extractValue(line);
        continue;
      }
      if (line.toLowerCase().startsWith('cook time:') || line.toLowerCase().startsWith('cooktime:')) {
        this.recipe.frontmatter.cookTime = this.extractValue(line);
        continue;
      }
      if (line.toLowerCase().startsWith('total time:') || line.toLowerCase().startsWith('totaltime:')) {
        this.recipe.frontmatter.totalTime = this.extractValue(line);
        continue;
      }
      if (line.toLowerCase().startsWith('calories:')) {
        this.recipe.frontmatter.calories = this.extractValue(line);
        continue;
      }
      if (line.toLowerCase().startsWith('dietary:')) {
        this.recipe.frontmatter.dietary = this.extractValue(line);
        continue;
      }
      if (line.toLowerCase().startsWith('allergens:')) {
        this.recipe.frontmatter.allergens = this.extractValue(line);
        continue;
      }
      if (line.toLowerCase().startsWith('cost:')) {
        this.recipe.frontmatter.cost = this.extractValue(line);
        continue;
      }
      if (line.toLowerCase().startsWith('youtube:') || line.toLowerCase().startsWith('video:')) {
        this.recipe.frontmatter.youtube = this.extractValue(line);
        continue;
      }

      // Section headers - handle both plain text and markdown
      const cleanLine = line.replace(/^#+\s*/, '').toLowerCase().trim();
      if (cleanLine === 'ingredients') {
        currentSection = 'ingredients';
        continue;
      }
      if (cleanLine === 'instructions' || cleanLine === 'directions') {
        currentSection = 'instructions';
        stepNumber = 1;
        continue;
      }
      if (cleanLine === 'notes') {
        currentSection = 'notes';
        continue;
      }
      if (cleanLine === 'tags') {
        currentSection = 'tags';
        continue;
      }

      // Instruction section headers (e.g., "## Prepare Vegetables")
      if (currentSection === 'instructions' && (line.startsWith('##') || line.startsWith('**'))) {
        currentInstructionSection = line.replace(/^#+\s*|\*\*/g, '').trim();
        continue;
      }

      // Ingredient category headers (e.g., "### Spices", "### Vegetables")
      if (currentSection === 'ingredients' && line.startsWith('###')) {
        currentIngredientCategory = line.replace(/^#+\s*/, '').trim();
        continue;
      }

      // Parse content based on current section
      switch (currentSection) {
        case 'ingredients':
          if ((line.startsWith('-') || line.startsWith('*') || line.match(/^\d+\./) || line.match(/^[a-zA-Z]/))
              && !line.toLowerCase().startsWith('alt:')) {
            const ingredient = this.cleanListItem(line);

            if (currentIngredientCategory) {
              // Add to categorized ingredients
              let category = this.recipe.ingredientCategories.find(cat => cat.title === currentIngredientCategory);
              if (!category) {
                category = { title: currentIngredientCategory, ingredients: [] };
                this.recipe.ingredientCategories.push(category);
              }
              category.ingredients.push(ingredient);
            } else {
              // Add to main ingredients list
              this.recipe.ingredients.push(ingredient);
            }
          }
          break;

        case 'instructions':
          // Check for alt text line (starts with "Alt:")
          if (line.toLowerCase().startsWith('alt:') && this.recipe.instructions.length > 0) {
            const lastInstruction = this.recipe.instructions[this.recipe.instructions.length - 1];
            const altText = line.substring(4).trim();

            // Initialize altTexts array if it doesn't exist
            if (!lastInstruction.altTexts) {
              lastInstruction.altTexts = [];
            }

            // Support for backward compatibility (single altText)
            if (!lastInstruction.altText) {
              lastInstruction.altText = altText;
            }

            // Add to array for multiple images
            lastInstruction.altTexts.push(altText);
          }
          else if (line.startsWith('-') || line.startsWith('*') || line.match(/^\d+\./) || line.match(/^[a-zA-Z]/)) {
            this.recipe.instructions.push({
              step: stepNumber++,
              text: this.cleanListItem(line),
              section: currentInstructionSection || 'Main Steps'
            });
          }
          break;

        case 'notes':
          if (line.startsWith('-') || line.startsWith('*') || line.match(/^[a-zA-Z]/)) {
            this.recipe.notes.push(this.cleanListItem(line));
          }
          break;

        case 'tags':
          if (line.startsWith('-') || line.startsWith('*') || line.match(/^[a-zA-Z]/)) {
            this.recipe.tags.push(this.cleanListItem(line));
          }
          break;
      }
    }
  }

  extractValue(line) {
    return line.split(':').slice(1).join(':').trim().replace(/^["']|["']$/g, '');
  }

  cleanListItem(line) {
    return line.replace(/^[-*]\s*|^\d+\.\s*/, '').trim();
  }

  generateFrontmatter(existingDate = null) {
    const today = new Date().toISOString().split('T')[0];

    // Calculate total time if not provided
    let totalTime = this.recipe.frontmatter.totalTime;
    if (!totalTime && this.recipe.frontmatter.prepTime && this.recipe.frontmatter.cookTime) {
      const prep = parseInt(this.recipe.frontmatter.prepTime) || 0;
      const cook = parseInt(this.recipe.frontmatter.cookTime) || 0;
      totalTime = `${prep + cook} Minutes`;
    }

    const frontmatter = {
      title: this.recipe.frontmatter.title || "Untitled Recipe",
      description: this.recipe.frontmatter.description || "A delicious recipe",
      rating: this.recipe.frontmatter.rating || DEFAULT_VALUES.rating,
      author: this.recipe.frontmatter.author || DEFAULT_VALUES.author,
      date: existingDate || today, // Use existing date if provided, otherwise today
      category: this.recipe.frontmatter.category || "Main",
      cuisine: this.recipe.frontmatter.cuisine || DEFAULT_VALUES.cuisine,
      difficulty: this.recipe.frontmatter.difficulty || DEFAULT_VALUES.difficulty,
      servings: this.recipe.frontmatter.servings || "4",
      prepTime: this.recipe.frontmatter.prepTime || "15 Minutes",
      cookTime: this.recipe.frontmatter.cookTime || "20 Minutes",
      totalTime: totalTime || "35 Minutes",
      calories: this.recipe.frontmatter.calories || "300",
      dietary: this.recipe.frontmatter.dietary || DEFAULT_VALUES.dietary,
      allergens: this.recipe.frontmatter.allergens || DEFAULT_VALUES.allergens,
      cost: this.recipe.frontmatter.cost || DEFAULT_VALUES.cost,
      source: this.recipe.frontmatter.source || DEFAULT_VALUES.source
    };

    // Add tags array if we have any
    if (this.recipe.tags.length > 0) {
      frontmatter.tags = this.recipe.tags;
    }

    let result = '---\n';
    for (const [key, value] of Object.entries(frontmatter)) {
      if (key === 'tags' && Array.isArray(value)) {
        result += `tags:\n`;
        value.forEach(tag => {
          result += `  - ${tag}\n`;
        });
      } else {
        result += `${key}: "${value}"\n`;
      }
    }
    result += '---\n';

    return result;
  }

  generateIngredients() {
    if (this.recipe.ingredients.length === 0 && this.recipe.ingredientCategories.length === 0) return '';

    let result = '### Ingredients\n\n';

    // Handle categorized ingredients
    if (this.recipe.ingredientCategories.length > 0) {
      result += '<RecipeIngredients categories={[\n';
      this.recipe.ingredientCategories.forEach((category, index) => {
        result += `  {\n    title: "${category.title}",\n    ingredients: [\n`;
        category.ingredients.forEach((ingredient, ingredientIndex) => {
          const comma = ingredientIndex < category.ingredients.length - 1 ? ',' : '';
          result += `      "${ingredient.replace(/"/g, '\\"')}"${comma}\n`;
        });
        const categoryComma = index < this.recipe.ingredientCategories.length - 1 ? ',' : '';
        result += `    ]\n  }${categoryComma}\n`;
      });

      // Add any non-categorized ingredients at the end
      if (this.recipe.ingredients.length > 0) {
        result += `,\n  {\n    title: "Other Ingredients",\n    ingredients: [\n`;
        this.recipe.ingredients.forEach((ingredient, index) => {
          const comma = index < this.recipe.ingredients.length - 1 ? ',' : '';
          result += `      "${ingredient.replace(/"/g, '\\"')}"${comma}\n`;
        });
        result += `    ]\n  }\n`;
      }
      result += ']} />\n\n';
    } else {
      // Handle non-categorized ingredients (original behavior)
      result += '<RecipeIngredients>\n';
      this.recipe.ingredients.forEach(ingredient => {
        result += `<>${ingredient}</>\n`;
      });
      result += '</RecipeIngredients>\n\n';
    }

    return result;
  }

  generateInstructions() {
    if (this.recipe.instructions.length === 0) return '';

    let result = '### Instructions\n\n<InstructionsContainer>\n';

    // Group instructions by section
    const sections = {};
    this.recipe.instructions.forEach(instruction => {
      const sectionName = instruction.section || 'Main Steps';
      if (!sections[sectionName]) {
        sections[sectionName] = [];
      }
      sections[sectionName].push(instruction);
    });

    // Generate each section
    Object.entries(sections).forEach(([sectionName, steps]) => {
      result += `  <InstructionsSection title="${sectionName}">\n`;

      steps.forEach(step => {
        const text = this.highlightIngredients(step.text);
        result += `    <InstructionStep stepNumber={${step.step}}>\n`;
        result += `      ${text}\n`;
        result += `    </InstructionStep>\n`;

        // Add step images if Alt text is provided
        if (step.altTexts && step.altTexts.length > 1) {
          // Multiple images with dash notation (step-1, step-2, etc.)
          step.altTexts.forEach((altText, index) => {
            const stepImageNumber = `${step.step}-${index + 1}`;
            const caption = altText;
            result += `\n    <ServerStepImage stepNumber="${stepImageNumber}" alt="${altText}" caption="${caption}" />\n`;
          });
        } else if (step.altTexts && step.altTexts.length === 1) {
          // Single image from altTexts array - use zero-padded step number to match 01.jpg, 02.jpg, etc.
          const altText = step.altTexts[0];
          const caption = altText;
          const stepNumber = step.step.toString().padStart(2, '0');
          result += `\n    <ServerStepImage stepNumber="${stepNumber}" alt="${altText}" caption="${caption}" />\n`;
        } else if (step.altText) {
          // Single image (backward compatibility) - use zero-padded step number
          const altText = step.altText;
          const caption = step.altText;
          const stepNumber = step.step.toString().padStart(2, '0');
          result += `\n    <ServerStepImage stepNumber="${stepNumber}" alt="${altText}" caption="${caption}" />\n`;
        }

        if (step !== steps[steps.length - 1]) result += '\n';
      });

      result += '  </InstructionsSection>\n';
    });

    result += '</InstructionsContainer>\n\n';
    return result;
  }

  highlightIngredients(text) {
    // Simple highlighting - wrap words that match ingredients in <strong> tags
    let result = text;
    const processedWords = new Set();

    // Collect all ingredients from both regular and categorized lists
    const allIngredients = [...this.recipe.ingredients];
    this.recipe.ingredientCategories.forEach(category => {
      allIngredients.push(...category.ingredients);
    });

    allIngredients.forEach(ingredient => {
      const words = ingredient.split(' ').filter(word => word.length > 3);
      words.forEach(word => {
        const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
        if (cleanWord.length > 3 && !processedWords.has(cleanWord)) {
          const regex = new RegExp(`\\b${cleanWord}\\b`, 'gi');
          result = result.replace(regex, (match) => {
            if (match.includes('<strong>')) return match; // Already highlighted
            return `<strong>${match}</strong>`;
          });
          processedWords.add(cleanWord);
        }
      });
    });
    return result;
  }

  generateNotes() {
    if (this.recipe.notes.length === 0) return '';

    let result = '### Notes\n\n<RecipeNotes>\n';
    this.recipe.notes.forEach(note => {
      result += `  <>${note}</>\n`;
    });
    result += '</RecipeNotes>\n\n';
    return result;
  }

  generateTags() {
    const defaultTags = [
      `Cuisine: ${this.recipe.frontmatter.cuisine || DEFAULT_VALUES.cuisine}`,
      `Dietary: ${this.recipe.frontmatter.dietary || DEFAULT_VALUES.dietary}`,
      `Difficulty: ${this.recipe.frontmatter.difficulty || DEFAULT_VALUES.difficulty}`,
      'Season: All Season'
    ];

    let result = '### Additional Tags\n\n<RecipeTags>\n';
    defaultTags.forEach(tag => {
      result += `  <>${tag}</>\n`;
    });
    result += '</RecipeTags>\n';
    return result;
  }

  generateYouTube() {
    if (!this.recipe.frontmatter.youtube) {
      return '';
    }

    // Extract YouTube ID from various URL formats
    let youtubeId = this.recipe.frontmatter.youtube;

    // Handle full YouTube URLs
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = youtubeId.match(youtubeRegex);
    if (match) {
      youtubeId = match[1];
    }

    // Use recipe title for the YouTube component
    const recipeTitle = this.recipe.frontmatter.title || 'Recipe Video';

    return `\n### External Sources\n\n<YouTube id="${youtubeId}" title="${recipeTitle}" />\n\n`;
  }

  convert(existingDate = null) {
    return [
      this.generateFrontmatter(existingDate),
      this.generateIngredients(),
      this.generateInstructions(),
      this.generateNotes(),
      this.generateTags(),
      this.generateYouTube()
    ].join('');
  }
}

// CLI functionality
function convertSingleFile(inputFile, options = {}) {
  const { category, outputFile = null } = options;

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file "${inputFile}" not found.`);
    return false;
  }

  try {
    const content = fs.readFileSync(inputFile, 'utf-8');
    const converter = new RecipeConverter();

    // Override category if specified
    if (category) {
      converter.recipe.frontmatter.category = category.charAt(0).toUpperCase() + category.slice(1);
    }

    converter.parseInput(content);

    // Check for existing file and extract date if it exists
    let existingDate = null;
    let outputPath = outputFile;

    if (!outputFile) {
      // Auto-generate output filename and path
      const title = converter.recipe.frontmatter.title || 'untitled-recipe';
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const recipeCategory = converter.recipe.frontmatter.category?.toLowerCase() || '';

      // Use category as folder name directly, or root if no category
      const outputDir = recipeCategory
        ? path.join(__dirname, '..', 'content', 'docs', recipeCategory)
        : path.join(__dirname, '..', 'content', 'docs');
      outputPath = path.join(outputDir, `${slug}.mdx`);

      // Create directory if it doesn't exist
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
    }

    // Check if the output file already exists and extract its date
    if (fs.existsSync(outputPath)) {
      try {
        const existingContent = fs.readFileSync(outputPath, 'utf-8');
        const dateMatch = existingContent.match(/^date:\s*"?([^"]+)"?$/im);
        if (dateMatch) {
          existingDate = dateMatch[1].trim();
        }
      } catch (error) {
        // If we can't read the existing file, continue with new date
      }
    }

    const result = converter.convert(existingDate);

    fs.writeFileSync(outputPath, result);
    const status = existingDate ? 'updated' : 'created';
    console.log(`✅ Recipe ${status} and saved to: ${outputPath}`);

    // Count total ingredients
    const totalIngredients = converter.recipe.ingredients.length +
      converter.recipe.ingredientCategories.reduce((total, cat) => total + cat.ingredients.length, 0);

    console.log(`Recipe Details: ${converter.recipe.frontmatter.title} | ${converter.recipe.frontmatter.category} | ${totalIngredients} ingredients | ${converter.recipe.instructions.length} steps`);
    return true;

  } catch (error) {
    console.error(`Error converting recipe "${inputFile}":`, error.message);
    return false;
  }
}

function convertAllRecipes(options = {}) {
  const recipesDir = path.join(__dirname, '..', 'recipes');

  if (!fs.existsSync(recipesDir)) {
    console.error(`Error: Recipes directory "${recipesDir}" not found.`);
    return;
  }

  console.log('🚀 Converting all recipes from recipes/ folder...\n');

  // First, clean up orphaned recipes
  if (options.cleanup !== false) {
    cleanupOrphanedRecipes(recipesDir);
  }

  let totalConverted = 0;
  let totalFailed = 0;

  function processDirectory(dirPath, categoryFromPath = null) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Skip template directories and images directory entirely
        if (entry.name.startsWith('_templates') || entry.name.includes('template') || entry.name === 'images') {
          console.log(`⏭️  Skipping directory: ${entry.name}`);
          continue;
        }

        // Recursively process subdirectories, use folder name as category
        const categoryName = entry.name;
        console.log(`📁 Processing category: ${categoryName}`);
        processDirectory(fullPath, categoryName);
      } else if (entry.isFile() && entry.name.endsWith('.txt')) {
        // Skip template and README files
        if (entry.name.includes('template') || entry.name.includes('README') || entry.name.includes('readme')) {
          console.log(`⏭️  Skipping: ${entry.name}`);
          continue;
        }

        console.log(`📄 Converting: ${entry.name}`);
        const success = convertSingleFile(fullPath, {
          category: categoryFromPath
        });

        if (success) {
          totalConverted++;
        } else {
          totalFailed++;
        }
      }
    }
  }

  processDirectory(recipesDir);

  console.log(`\n📊 Conversion Summary:`);
  console.log(`✅ Successfully converted: ${totalConverted} recipes`);
  if (totalFailed > 0) {
    console.log(`❌ Failed to convert: ${totalFailed} recipes`);
  }
  console.log(`\n🎉 All recipes processed!`);
}

function cleanupOrphanedRecipes(recipesDir) {
  const contentDir = path.join(__dirname, '..', 'content', 'docs');

  console.log('🧹 Cleaning up orphaned recipe files...\n');

  // Get all existing recipe text files with their expected output paths
  const existingRecipes = new Set();

  function scanRecipes(dirPath, categoryFromPath = null) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Skip template directories and images directory entirely
        if (entry.name.startsWith('_templates') || entry.name.includes('template') || entry.name === 'images') {
          continue;
        }
        scanRecipes(fullPath, entry.name);
      } else if (entry.isFile() && entry.name.endsWith('.txt')) {
        // Skip template and README files
        if (entry.name.includes('template') || entry.name.includes('README') || entry.name.includes('readme')) {
          continue;
        }

        // Read the title and category to generate the expected slug
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const titleMatch = content.match(/^title:\s*(.+)$/im);
          const title = titleMatch ? titleMatch[1].trim().replace(/^["']|["']$/g, '') : 'untitled-recipe';
          const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

          // Parse category from file content, fallback to categoryFromPath
          const categoryMatch = content.match(/^category:\s*(.+)$/im);
          const fileCategory = categoryMatch ? categoryMatch[1].trim().replace(/^["']|["']$/g, '') : null;
          const category = fileCategory || categoryFromPath || '';

          const expectedPath = category
            ? path.join(contentDir, category.toLowerCase(), `${slug}.mdx`)
            : path.join(contentDir, `${slug}.mdx`);

          existingRecipes.add(expectedPath);
        } catch (error) {
          console.warn(`⚠️  Could not read recipe file: ${fullPath}`);
        }
      }
    }
  }

  scanRecipes(recipesDir);

  // Find and remove orphaned MDX files
  let deletedCount = 0;

  function cleanupCategory(categoryPath) {
    if (!fs.existsSync(categoryPath)) return;

    const entries = fs.readdirSync(categoryPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.mdx')) {
        const fullPath = path.join(categoryPath, entry.name);

        if (!existingRecipes.has(fullPath)) {
          console.log(`🗑️  Removing orphaned recipe: ${path.relative(contentDir, fullPath)}`);
          fs.unlinkSync(fullPath);
          deletedCount++;
        }
      }
    }
  }

  function removeEmptyDirectories(dir) {
    if (!fs.existsSync(dir)) return false;

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      // First, recursively check subdirectories
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const subDirPath = path.join(dir, entry.name);
          removeEmptyDirectories(subDirPath);
        }
      }

      // Check if directory is now empty (after potential subdirectory removal)
      const remainingEntries = fs.readdirSync(dir);
      if (remainingEntries.length === 0) {
        console.log(`🗑️  Removing empty category folder: ${path.relative(contentDir, dir)}`);
        fs.rmdirSync(dir);
        return true;
      }
    } catch (error) {
      // Silently ignore errors (directory might have been removed already, etc.)
    }

    return false;
  }

  // Clean up all possible category directories and root
  function cleanupCategory(dir) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively clean subdirectories
        cleanupCategory(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
        if (!existingRecipes.has(fullPath)) {
          console.log(`🗑️  Removing orphaned recipe: ${path.relative(contentDir, fullPath)}`);
          fs.unlinkSync(fullPath);
          deletedCount++;
        }
      }
    }
  }

  // Clean content/docs directory recursively
  cleanupCategory(contentDir);

  // Remove empty directories after cleaning up orphaned files
  let removedDirs = 0;
  if (removeEmptyDirectories(contentDir)) {
    removedDirs++;
  }

  if (deletedCount > 0 || removedDirs > 0) {
    const messages = [];
    if (deletedCount > 0) messages.push(`${deletedCount} orphaned recipe(s)`);
    if (removedDirs > 0) messages.push(`${removedDirs} empty folder(s)`);
    console.log(`\n🧹 Cleanup complete: Removed ${messages.join(' and ')}\n`);
  } else {
    console.log(`\n✨ No orphaned recipes or empty folders found\n`);
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Recipe Converter Tool

Usage:
  # Convert single file
  node scripts/recipe-converter.js <input-file> [output-file] [options]

  # Convert all recipes in recipes/ folder
  node scripts/recipe-converter.js --all [options]

Options:
  --all                 Convert all recipes in recipes/ folder (maintains folder structure)
  --category <category> Set the category (any folder name) - single file only
  --no-cleanup          Skip cleanup of orphaned recipe files and empty folders (use with --all)
  --help, -h            Show this help message

Single File Examples:
  node scripts/recipe-converter.js my-recipe.txt
  node scripts/recipe-converter.js recipe.txt --category breakfast
  node scripts/recipe-converter.js input.txt output.mdx --category dinner

Batch Examples:
  node scripts/recipe-converter.js --all
  node scripts/recipe-converter.js --all --no-cleanup

Notes:
  - When using --all, the folder structure in recipes/ is preserved
  - Any subfolder name in recipes/ becomes a category (e.g., recipes/breakfast/ -> breakfast category)
  - Recipes without categories are placed in the root of content/docs/
  - Template directories (starting with _templates) are automatically skipped
  - Template files and README files are automatically skipped
  - Orphaned MDX files (without corresponding .txt files) are automatically removed
  - Use --no-cleanup to skip orphaned file and empty folder removal
  - Step images are automatically detected from Alt: lines in instructions
  - YouTube videos are automatically embedded from YouTube: lines with auto-generated titles
    `);
    process.exit(0);
  }

  // Check if we're doing batch processing
  if (args.includes('--all')) {
    const cleanup = !args.includes('--no-cleanup');
    convertAllRecipes({ cleanup });
    return;
  }

  // Single file processing (existing logic)
  const inputFile = args[0];
  const categoryIndex = args.indexOf('--category');
  const category = categoryIndex !== -1 ? args[categoryIndex + 1] : null;

  let outputFile = args[1];
  // If second argument is a flag or category, treat it as no output file specified
  if (outputFile && (outputFile.startsWith('--') || outputFile === category)) {
    outputFile = null;
  }

  const success = convertSingleFile(inputFile, {
    category,
    outputFile
  });

  if (!success) {
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { RecipeConverter };
