#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the recipe content directory
const CONTENT_DIR = path.join(process.cwd(), 'content', 'docs');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'recipes');

// Common image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

/**
 * Extract recipe slug from file path
 */
function getRecipeSlug(filePath) {
  const relativePath = path.relative(CONTENT_DIR, filePath);
  // Extract just the filename without category folder
  const fileName = path.basename(relativePath, path.extname(relativePath));
  return fileName;
}

/**
 * Get all recipe MDX files
 */
function getAllRecipeFiles(dir = CONTENT_DIR) {
  let files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files = files.concat(getAllRecipeFiles(fullPath));
      } else if (item.endsWith('.mdx') || item.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dir}:`, error.message);
  }
  
  return files;
}

/**
 * Create directory structure for a recipe
 */
function createRecipeDirectories(recipeSlug) {
  const baseDir = path.join(IMAGES_DIR, recipeSlug);
  const overviewDir = path.join(baseDir, 'overview');
  const stepsDir = path.join(baseDir, 'steps');
  
  try {
    fs.mkdirSync(overviewDir, { recursive: true });
    fs.mkdirSync(stepsDir, { recursive: true });
    
    // Create README files with instructions
    const overviewReadme = `# Overview Images for ${recipeSlug}

Place your recipe overview images here. Supported formats: jpg, jpeg, png, webp, avif

Naming conventions:
- main.jpg/png - Primary recipe image
- 1.jpg, 2.jpg, 3.jpg - Additional overview images
- hero.jpg/png - Hero image for the recipe
- final.jpg/png - Final result image

Images will be automatically detected and displayed in the recipe carousel.
`;

    const stepsReadme = `# Step Images for ${recipeSlug}

Place your step-by-step cooking images here. Supported formats: jpg, jpeg, png, webp, avif

Naming conventions:
- 1.jpg, 2.jpg, 3.jpg - Main step images in order
- 1.1.jpg, 1.2.jpg - Sub-steps for detailed instructions
- 2.1.jpg, 2.2.jpg - Sub-steps for step 2, etc.

Legacy naming (still supported):
- step-1.jpg, step-2.jpg, step-3.jpg - Alternative naming

Images will be automatically detected and displayed when using the ServerStepImage component in your MDX file.

Usage in MDX:
\`\`\`jsx
{/* Main steps */}
<ServerStepImage recipeSlug="${recipeSlug}" stepNumber={1} alt="Step 1" />
<ServerStepImage recipeSlug="${recipeSlug}" stepNumber={2} alt="Step 2" />

{/* Sub-steps */}
<ServerStepImage recipeSlug="${recipeSlug}" stepNumber="1.1" alt="Sub-step 1.1" />
<ServerStepImage recipeSlug="${recipeSlug}" stepNumber="1.2" alt="Sub-step 1.2" />
\`\`\`
`;

    fs.writeFileSync(path.join(overviewDir, 'README.md'), overviewReadme);
    fs.writeFileSync(path.join(stepsDir, 'README.md'), stepsReadme);
    
    return true;
  } catch (error) {
    console.error(`Error creating directories for ${recipeSlug}:`, error.message);
    return false;
  }
}

/**
 * Main function
 */
function main() {
  console.log('🍳 Setting up recipe image directories...\n');
  
  // Create base images directory
  try {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create base images directory:', error.message);
    process.exit(1);
  }
  
  // Get all recipe files
  const recipeFiles = getAllRecipeFiles();
  console.log(`Found ${recipeFiles.length} recipe files\n`);
  
  let successCount = 0;
  const failed = [];
  
  // Create directories for each recipe
  for (const file of recipeFiles) {
    const recipeSlug = getRecipeSlug(file);
    console.log(`Setting up: ${recipeSlug}`);
    
    if (createRecipeDirectories(recipeSlug)) {
      successCount++;
    } else {
      failed.push(recipeSlug);
    }
  }
  
  // Summary
  console.log(`\n✅ Successfully created directories for ${successCount} recipes`);
  
  if (failed.length > 0) {
    console.log(`❌ Failed to create directories for ${failed.length} recipes:`);
    failed.forEach(slug => console.log(`   - ${slug}`));
  }
  
  console.log(`\n📁 Recipe images directory: ${IMAGES_DIR}`);
  console.log('\n📖 Usage Instructions:');
  console.log('1. Place your recipe overview images in the "overview" folder');
  console.log('2. Place your step-by-step images in the "steps" folder');
  console.log('3. Use RecipeStepImages component in MDX files for step images');
  console.log('4. Overview images will automatically appear on recipe pages');
  console.log('\n🏷️ Naming Conventions:');
  console.log('   Overview: main.jpg, 1.jpg, 2.jpg, hero.jpg, final.jpg');
  console.log('   Steps: step-1.jpg, step-2.jpg, or 1.jpg, 2.jpg');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { createRecipeDirectories, getAllRecipeFiles, getRecipeSlug };
