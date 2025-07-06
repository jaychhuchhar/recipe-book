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

// Category mapping for output directory
const CATEGORY_DIRS = {
  breakfast: 'breakfast',
  lunch: 'lunch', 
  dinner: 'dinner',
  snacks: 'snacks',
  desserts: 'desserts',
  beverages: 'beverages'
};

class RecipeConverter {
  constructor(options = {}) {
    this.recipe = {
      frontmatter: {},
      ingredients: [],
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

      // Parse content based on current section
      switch (currentSection) {
        case 'ingredients':
          if ((line.startsWith('-') || line.startsWith('*') || line.match(/^\d+\./) || line.match(/^[a-zA-Z]/)) 
              && !line.toLowerCase().startsWith('alt:')) {
            this.recipe.ingredients.push(this.cleanListItem(line));
          }
          break;
          
        case 'instructions':
          // Check for alt text line (starts with "Alt:")
          if (line.toLowerCase().startsWith('alt:') && this.recipe.instructions.length > 0) {
            const lastInstruction = this.recipe.instructions[this.recipe.instructions.length - 1];
            lastInstruction.altText = line.substring(4).trim();
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

  generateFrontmatter() {
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
      date: today,
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
    if (this.recipe.ingredients.length === 0) return '';
    
    let result = '### Ingredients\n\n<RecipeIngredients>\n';
    this.recipe.ingredients.forEach(ingredient => {
      result += `  <>${ingredient}</>\n`;
    });
    result += '</RecipeIngredients>\n\n';
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
        
        // Add step image if images option is enabled
        if (this.options.includeImages) {
          const altText = step.altText || `Step ${step.step}`;
          const caption = step.altText || `Step ${step.step} illustration`;
          result += `\n    <ServerStepImage stepNumber={${step.step}} alt="${altText}" caption="${caption}" />\n`;
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
    
    this.recipe.ingredients.forEach(ingredient => {
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

  convert() {
    return [
      this.generateFrontmatter(),
      this.generateIngredients(),
      this.generateInstructions(),
      this.generateNotes(),
      this.generateTags()
    ].join('');
  }
}

// CLI functionality
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Recipe Converter Tool

Usage:
  node scripts/recipe-converter.js <input-file> [output-file] [options]

Options:
  --category <category>  Set the category (breakfast, lunch, dinner, etc.)
  --images              Include ServerStepImage components for each step
  --help, -h            Show this help message

Examples:
  node scripts/recipe-converter.js my-recipe.txt
  node scripts/recipe-converter.js recipe.txt --category breakfast
  node scripts/recipe-converter.js input.txt output.mdx --category dinner
  node scripts/recipe-converter.js recipe.txt --images

Notes:
  - Images are automatically detected by step number (1.jpg, 2.jpg, etc.)
  - Use --images flag to include ServerStepImage components in output
  - Place images in: public/images/recipes/[recipe-name]/steps/[step-number].jpg
    `);
    process.exit(0);
  }

  const inputFile = args[0];
  const categoryIndex = args.indexOf('--category');
  const category = categoryIndex !== -1 ? args[categoryIndex + 1] : null;
  const includeImages = args.includes('--images');
  
  let outputFile = args[1];
  // If second argument is a flag or category, treat it as no output file specified
  if (outputFile && (outputFile.startsWith('--') || outputFile === category)) {
    outputFile = null;
  }

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file "${inputFile}" not found.`);
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(inputFile, 'utf-8');
    const converter = new RecipeConverter({ 
      includeImages: includeImages 
    });
    
    // Override category if specified
    if (category) {
      converter.recipe.frontmatter.category = category.charAt(0).toUpperCase() + category.slice(1);
    }
    
    converter.parseInput(content);
    const result = converter.convert();

    if (outputFile) {
      fs.writeFileSync(outputFile, result);
      console.log(`✅ Recipe converted and saved to: ${outputFile}`);
    } else {
      // Auto-generate output filename and path
      const title = converter.recipe.frontmatter.title || 'untitled-recipe';
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const recipeCategory = converter.recipe.frontmatter.category?.toLowerCase() || 'main';
      const categoryDir = CATEGORY_DIRS[recipeCategory] || 'main';
      
      const outputDir = path.join(__dirname, '..', 'content', 'docs', categoryDir);
      const outputPath = path.join(outputDir, `${slug}.mdx`);

      // Create directory if it doesn't exist
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      fs.writeFileSync(outputPath, result);
      console.log(`✅ Recipe converted and saved to: ${outputPath}`);
    }

    console.log(`
Recipe Details:
- Title: ${converter.recipe.frontmatter.title}
- Category: ${converter.recipe.frontmatter.category}
- Ingredients: ${converter.recipe.ingredients.length}
- Instructions: ${converter.recipe.instructions.length} steps
- Notes: ${converter.recipe.notes.length}
    `);
    
  } catch (error) {
    console.error('Error converting recipe:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { RecipeConverter };
