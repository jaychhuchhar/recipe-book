#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the recipe content directory
const CONTENT_DIR = path.join(process.cwd(), 'content', 'docs');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'recipes');
const SOURCE_IMAGES_DIR = path.join(process.cwd(), 'recipes', 'images');

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
- 01.jpg, 02.jpg, 03.jpg - Zero-padded main steps (better file organization)
- 1.1.jpg, 1.2.jpg - Sub-steps for detailed instructions (dot separator)
- 15-1.jpg, 15-2.jpg - Sub-steps for detailed instructions (dash separator)
- 01.1.jpg, 01.2.jpg - Zero-padded sub-steps
- 2.1.jpg, 2.2.jpg - Sub-steps for step 2, etc.

Legacy naming (still supported):
- step-1.jpg, step-2.jpg, step-3.jpg - Alternative naming
- step-01.jpg, step-02.jpg - Zero-padded legacy naming

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
 * Create source directory structure for a recipe (where original images are placed)
 */
function createSourceDirectories(recipeSlug) {
  const baseDir = path.join(SOURCE_IMAGES_DIR, recipeSlug);
  const overviewDir = path.join(baseDir, 'overview');
  const stepsDir = path.join(baseDir, 'steps');

  try {
    fs.mkdirSync(overviewDir, { recursive: true });
    fs.mkdirSync(stepsDir, { recursive: true });

    // Create README files with instructions for source images
    const sourceOverviewReadme = `# Source Overview Images for ${recipeSlug}

Place your HIGH-QUALITY original recipe overview images here.

This is the SOURCE directory - these images will be processed and optimized automatically.
The optimized versions will be placed in public/images/recipes/${recipeSlug}/overview/

Supported formats: jpg, jpeg, png, webp, avif

Naming conventions:
- main.jpg/png - Primary recipe image
- 1.jpg, 2.jpg, 3.jpg - Additional overview images
- hero.jpg/png - Hero image for the recipe
- final.jpg/png - Final result image

After adding images here, run: npm run convert-images
`;

    const sourceStepsReadme = `# Source Step Images for ${recipeSlug}

Place your HIGH-QUALITY original step-by-step cooking images here.

This is the SOURCE directory - these images will be processed and optimized automatically.
The optimized versions will be placed in public/images/recipes/${recipeSlug}/steps/

Supported formats: jpg, jpeg, png, webp, avif

Naming conventions:
- 1.jpg, 2.jpg, 3.jpg - Main step images in order
- 01.jpg, 02.jpg, 03.jpg - Zero-padded main steps (better file organization)

After adding images here, run: npm run convert-images
`;

    fs.writeFileSync(path.join(overviewDir, 'README.md'), sourceOverviewReadme);
    fs.writeFileSync(path.join(stepsDir, 'README.md'), sourceStepsReadme);

    return true;
  } catch (error) {
    console.error(`Error creating source directories for ${recipeSlug}:`, error.message);
    return false;
  }
}

/**
 * Get all existing recipe slugs from image directories
 */
function getExistingImageDirectories() {
  const recipeDirs = [];

  try {
    if (fs.existsSync(IMAGES_DIR)) {
      const items = fs.readdirSync(IMAGES_DIR);

      for (const item of items) {
        const fullPath = path.join(IMAGES_DIR, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          recipeDirs.push(item);
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read images directory:`, error.message);
  }

  return recipeDirs;
}

/**
 * Remove unused recipe directories and empty folders
 */
function cleanupUnusedImages(validRecipeSlugs) {
  console.log('\n🧹 Cleaning up unused image directories...');

  const existingDirs = getExistingImageDirectories();
  const unusedDirs = existingDirs.filter(dir => !validRecipeSlugs.includes(dir));

  let deletedCount = 0;

  for (const unusedDir of unusedDirs) {
    const dirPath = path.join(IMAGES_DIR, unusedDir);

    try {
      // Remove directory and all contents recursively
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`🗑️  Removed unused directory: ${unusedDir}`);
      deletedCount++;
    } catch (error) {
      console.warn(`⚠️  Failed to remove directory ${unusedDir}:`, error.message);
    }
  }

  // Remove empty subdirectories in remaining recipe folders
  const remainingDirs = existingDirs.filter(dir => validRecipeSlugs.includes(dir));
  let emptyDirsRemoved = 0;

  for (const recipeDir of remainingDirs) {
    const recipePath = path.join(IMAGES_DIR, recipeDir);

    try {
      const subDirs = fs.readdirSync(recipePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const subDir of subDirs) {
        const subDirPath = path.join(recipePath, subDir);
        const contents = fs.readdirSync(subDirPath);

        // Remove if empty or contains only .gitkeep files
        const hasActualFiles = contents.some(file => !file.startsWith('.'));

        if (!hasActualFiles) {
          fs.rmSync(subDirPath, { recursive: true, force: true });
          console.log(`🗑️  Removed empty subdirectory: ${recipeDir}/${subDir}`);
          emptyDirsRemoved++;
        }
      }

      // Check if recipe directory itself is empty
      const recipeContents = fs.readdirSync(recipePath);
      const hasActualContent = recipeContents.some(item => {
        const itemPath = path.join(recipePath, item);
        const isDir = fs.statSync(itemPath).isDirectory();

        if (isDir) {
          const dirContents = fs.readdirSync(itemPath);
          return dirContents.some(file => !file.startsWith('.'));
        }
        return !item.startsWith('.');
      });

      if (!hasActualContent) {
        fs.rmSync(recipePath, { recursive: true, force: true });
        console.log(`🗑️  Removed empty recipe directory: ${recipeDir}`);
        deletedCount++;
      }

    } catch (error) {
      console.warn(`⚠️  Error checking directory ${recipeDir}:`, error.message);
    }
  }

  if (deletedCount > 0 || emptyDirsRemoved > 0) {
    const messages = [];
    if (deletedCount > 0) messages.push(`${deletedCount} unused recipe directory(ies)`);
    if (emptyDirsRemoved > 0) messages.push(`${emptyDirsRemoved} empty subdirectory(ies)`);
    console.log(`\n🧹 Cleanup complete: Removed ${messages.join(' and ')}`);
  } else {
    console.log('\n✨ No unused directories or empty folders found');
  }
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const skipCleanup = args.includes('--no-cleanup');

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Recipe Image Setup Tool

Usage:
  node scripts/setup-recipe-images.js [options]
  npm run setup-images [-- options]

Options:
  --no-cleanup     Skip cleanup of unused image directories
  --help, -h       Show this help message

Description:
  - Creates image directories for all recipes found in content/docs/
  - Removes unused recipe image directories that no longer have corresponding recipes
  - Removes empty subdirectories (overview/steps folders with no actual images)
  - Creates overview/ and steps/ folders for each recipe

Examples:
  npm run setup-images
  npm run setup-images -- --no-cleanup
  node scripts/setup-recipe-images.js --no-cleanup
    `);
    process.exit(0);
  }

  console.log('🍳 Setting up recipe image directories...\n');

  // Create base images directories
  try {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
    fs.mkdirSync(SOURCE_IMAGES_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create base images directories:', error.message);
    process.exit(1);
  }

  // Get all recipe files
  const recipeFiles = getAllRecipeFiles();
  console.log(`Found ${recipeFiles.length} recipe files\n`);

  // Get valid recipe slugs for cleanup
  const validRecipeSlugs = recipeFiles.map(file => getRecipeSlug(file));

  // Clean up unused directories first (unless skipped)
  if (!skipCleanup) {
    cleanupUnusedImages(validRecipeSlugs);
  } else {
    console.log('⏭️  Skipping cleanup (--no-cleanup flag detected)\n');
  }

  let successCount = 0;
  const failed = [];

  console.log(`\n📁 Creating directories for current recipes...`);

  // Create directories for each recipe
  for (const file of recipeFiles) {
    const recipeSlug = getRecipeSlug(file);
    console.log(`Setting up: ${recipeSlug}`);

    const publicSuccess = createRecipeDirectories(recipeSlug);
    const sourceSuccess = createSourceDirectories(recipeSlug);

    if (publicSuccess && sourceSuccess) {
      successCount++;
    } else {
      failed.push(recipeSlug);
    }
  }

  // Cleanup unused directories and empty folders (unless skipped)
  if (!skipCleanup) {
    const validSlugs = recipeFiles.map(getRecipeSlug);
    cleanupUnusedImages(validSlugs);
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
  console.log('   Steps: 1.jpg, 01.jpg, step-1.jpg, step-01.jpg (all patterns supported)');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  createRecipeDirectories,
  getAllRecipeFiles,
  getRecipeSlug,
  getExistingImageDirectories,
  cleanupUnusedImages
};
