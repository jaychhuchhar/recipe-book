#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');

/**
 * Image Conversion and Optimization Utility
 * 
 * This script compresses and optimizes images in the recipe book using sharp.
 * Supports conversion to WebP format and various compression levels.
 */

const DEFAULT_JPEG_QUALITY = 85;
const DEFAULT_PNG_QUALITY = 90;
const DEFAULT_WEBP_QUALITY = 80;
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

class ImageConverter {
  constructor(options = {}) {
    this.jpegQuality = options.jpegQuality || DEFAULT_JPEG_QUALITY;
    this.pngQuality = options.pngQuality || DEFAULT_PNG_QUALITY;
    this.webpQuality = options.webpQuality || DEFAULT_WEBP_QUALITY;
    this.generateWebP = options.generateWebP || false;
    this.maxWidth = options.maxWidth || MAX_WIDTH;
    this.maxHeight = options.maxHeight || MAX_HEIGHT;
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;
  }

  async convertImage(inputPath, outputPath = null) {
    try {
      // If no output path specified, maintain same structure but in public directory
      let outputFilePath = outputPath;
      if (!outputFilePath) {
        // Convert recipes/images/... to public/images/recipes/...
        outputFilePath = inputPath.replace(
          path.join(process.cwd(), 'recipes', 'images'),
          path.join(process.cwd(), 'public', 'images', 'recipes')
        );
      }
      
      const ext = path.extname(inputPath).toLowerCase();
      
      // Ensure output directory exists
      const outputDir = path.dirname(outputFilePath);
      await fs.mkdir(outputDir, { recursive: true });
      
      // Get original file stats
      const originalStats = await fs.stat(inputPath);
      const originalSize = originalStats.size;

      if (this.verbose) {
        console.log(`Processing: ${path.relative(process.cwd(), inputPath)}`);
        console.log(`  Output: ${path.relative(process.cwd(), outputFilePath)}`);
        console.log(`  Original size: ${(originalSize / 1024).toFixed(2)} KB`);
      }

      // Create sharp instance
      let image = sharp(inputPath);
      
      // Get image metadata
      const metadata = await image.metadata();
      
      // Resize if too large
      if (metadata.width > this.maxWidth || metadata.height > this.maxHeight) {
        image = image.resize(this.maxWidth, this.maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        });
        
        if (this.verbose) {
          console.log(`  Resizing from ${metadata.width}x${metadata.height} to max ${this.maxWidth}x${this.maxHeight}`);
        }
      }

      // Apply format-specific optimization
      if (ext === '.jpg' || ext === '.jpeg') {
        image = image.jpeg({ 
          quality: this.jpegQuality,
          progressive: true,
          mozjpeg: true
        });
      } else if (ext === '.png') {
        image = image.png({ 
          quality: this.pngQuality,
          compressionLevel: 9,
          palette: true
        });
      } else if (ext === '.webp') {
        image = image.webp({ 
          quality: this.webpQuality,
          effort: 6
        });
      }

      if (!this.dryRun) {
        // Write optimized image
        await image.toFile(outputFilePath + '.tmp');
        
        // Check if optimization actually reduced file size
        const optimizedStats = await fs.stat(outputFilePath + '.tmp');
        const optimizedSize = optimizedStats.size;
        
        if (optimizedSize < originalSize) {
          // Replace original with optimized version
          await fs.rename(outputFilePath + '.tmp', outputFilePath);
          
          const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
          console.log(`✓ Optimized: ${path.basename(inputPath)} (${savings}% smaller, ${(optimizedSize / 1024).toFixed(2)} KB)`);
        } else {
          // Keep original if optimization didn't help
          await fs.unlink(outputFilePath + '.tmp');
          console.log(`- Skipped: ${path.basename(inputPath)} (optimization didn't reduce size)`);
        }

        // Generate WebP version if requested
        if (this.generateWebP && ext !== '.webp') {
          const webpPath = outputFilePath.replace(/\.(jpe?g|png)$/i, '.webp');
          const webpDir = path.dirname(webpPath);
          await fs.mkdir(webpDir, { recursive: true });
          
          await sharp(inputPath)
            .resize(this.maxWidth, this.maxHeight, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .webp({ 
              quality: this.webpQuality,
              effort: 6
            })
            .toFile(webpPath);
          
          const webpStats = await fs.stat(webpPath);
          console.log(`✓ WebP created: ${path.basename(webpPath)} (${(webpStats.size / 1024).toFixed(2)} KB)`);
        }
      } else {
        console.log(`[DRY RUN] Would optimize: ${path.basename(inputPath)}`);
      }

    } catch (error) {
      console.error(`Error processing ${inputPath}:`, error.message);
    }
  }

  async convertRecipe(recipeName) {
    const sourceDir = path.join(process.cwd(), 'recipes', 'images', recipeName);
    const outputDir = path.join(process.cwd(), 'public', 'images', 'recipes', recipeName);
    
    try {
      await fs.access(sourceDir);
    } catch {
      console.error(`Source recipe directory not found: ${sourceDir}`);
      return;
    }

    console.log(`\n🔄 Converting images for recipe: ${recipeName}`);
    console.log(`  Source: recipes/images/${recipeName}`);
    console.log(`  Output: public/images/recipes/${recipeName}`);
    
    // Find all image files in the source recipe directory
    const imagePattern = path.join(sourceDir, '**', '*.{jpg,jpeg,png,webp}');
    const imageFiles = await glob(imagePattern, { nodir: true });
    
    if (imageFiles.length === 0) {
      console.log(`No images found in ${sourceDir}`);
      return;
    }

    console.log(`Found ${imageFiles.length} images to process`);
    
    for (const imagePath of imageFiles) {
      await this.convertImage(imagePath);
    }
  }

  async convertAllRecipes() {
    const sourceDir = path.join(process.cwd(), 'recipes', 'images');
    
    try {
      await fs.access(sourceDir);
    } catch {
      console.error(`Source recipes directory not found: ${sourceDir}`);
      return;
    }

    console.log('🔄 Converting images for all recipes...');
    console.log('  Source: recipes/images/');
    console.log('  Output: public/images/recipes/');
    
    // Get all recipe directories
    const entries = await fs.readdir(sourceDir, { withFileTypes: true });
    const recipeNames = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);

    if (recipeNames.length === 0) {
      console.log('No recipe directories found');
      return;
    }

    console.log(`Found ${recipeNames.length} recipes to process`);
    
    for (const recipeName of recipeNames) {
      await this.convertRecipe(recipeName);
    }
  }

  async analyzeImages() {
    const sourceDir = path.join(process.cwd(), 'recipes', 'images');
    
    try {
      await fs.access(sourceDir);
    } catch {
      console.error(`Source recipes directory not found: ${sourceDir}`);
      return;
    }

    console.log('📊 Analyzing source recipe images...');
    
    const imagePattern = path.join(sourceDir, '**', '*.{jpg,jpeg,png,webp}');
    const imageFiles = await glob(imagePattern, { nodir: true });
    
    if (imageFiles.length === 0) {
      console.log('No images found');
      return;
    }

    let totalSize = 0;
    let largeImages = [];
    
    for (const imagePath of imageFiles) {
      try {
        const stats = await fs.stat(imagePath);
        const metadata = await sharp(imagePath).metadata();
        
        totalSize += stats.size;
        
        if (stats.size > 500 * 1024) { // Files larger than 500KB
          largeImages.push({
            path: imagePath,
            size: stats.size,
            dimensions: `${metadata.width}x${metadata.height}`,
            format: metadata.format
          });
        }
      } catch (error) {
        console.error(`Error analyzing ${imagePath}:`, error.message);
      }
    }
    
    console.log(`\nAnalysis Results:`);
    console.log(`Total images: ${imageFiles.length}`);
    console.log(`Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Average size: ${(totalSize / imageFiles.length / 1024).toFixed(2)} KB`);
    
    if (largeImages.length > 0) {
      console.log(`\nLarge images (>500KB):`);
      largeImages
        .sort((a, b) => b.size - a.size)
        .forEach(img => {
          console.log(`  ${path.relative(sourceDir, img.path)} - ${(img.size / 1024).toFixed(2)} KB (${img.dimensions}, ${img.format})`);
        });
    }
  }
}

// CLI handling
function showHelp() {
  console.log(`
Image Conversion and Optimization Utility

This tool converts and optimizes images from recipes/images/ to public/images/recipes/
preserving original files while serving optimized versions to users.

Usage:
  node scripts/convert-images.js [options] [command]

Commands:
  --all                 Convert all recipes from recipes/images/ to public/images/recipes/
  --recipe <name>       Convert specific recipe
  --analyze             Analyze source images without converting

Options:
  --webp               Generate WebP versions alongside optimized originals
  --jpeg-quality <q>   JPEG quality (default: ${DEFAULT_JPEG_QUALITY})
  --png-quality <q>    PNG quality (default: ${DEFAULT_PNG_QUALITY})
  --webp-quality <q>   WebP quality (default: ${DEFAULT_WEBP_QUALITY})
  --max-width <w>      Maximum width (default: ${MAX_WIDTH})
  --max-height <h>     Maximum height (default: ${MAX_HEIGHT})
  --dry-run            Show what would be done without making changes
  --verbose            Show detailed processing information
  --help               Show this help message

Examples:
  node scripts/convert-images.js --all
  node scripts/convert-images.js --recipe chicken-tikka-masala
  node scripts/convert-images.js --all --webp --jpeg-quality 80
  node scripts/convert-images.js --analyze
  node scripts/convert-images.js --all --dry-run

Workflow:
  1. Store original high-quality images in recipes/images/[recipe-name]/
  2. Run conversion to generate optimized images in public/images/recipes/[recipe-name]/
  3. Next.js serves optimized images while preserving originals for re-processing
`);
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.length === 0) {
    showHelp();
    return;
  }

  const options = {
    generateWebP: args.includes('--webp'),
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose')
  };

  // Parse quality options
  const jpegQualityIndex = args.indexOf('--jpeg-quality');
  if (jpegQualityIndex !== -1 && args[jpegQualityIndex + 1]) {
    options.jpegQuality = parseInt(args[jpegQualityIndex + 1]);
  }

  const pngQualityIndex = args.indexOf('--png-quality');
  if (pngQualityIndex !== -1 && args[pngQualityIndex + 1]) {
    options.pngQuality = parseInt(args[pngQualityIndex + 1]);
  }

  const webpQualityIndex = args.indexOf('--webp-quality');
  if (webpQualityIndex !== -1 && args[webpQualityIndex + 1]) {
    options.webpQuality = parseInt(args[webpQualityIndex + 1]);
  }

  const maxWidthIndex = args.indexOf('--max-width');
  if (maxWidthIndex !== -1 && args[maxWidthIndex + 1]) {
    options.maxWidth = parseInt(args[maxWidthIndex + 1]);
  }

  const maxHeightIndex = args.indexOf('--max-height');
  if (maxHeightIndex !== -1 && args[maxHeightIndex + 1]) {
    options.maxHeight = parseInt(args[maxHeightIndex + 1]);
  }

  const converter = new ImageConverter(options);

  try {
    if (args.includes('--analyze')) {
      await converter.analyzeImages();
    } else if (args.includes('--all')) {
      await converter.convertAllRecipes();
    } else {
      const recipeIndex = args.indexOf('--recipe');
      if (recipeIndex !== -1 && args[recipeIndex + 1]) {
        const recipeName = args[recipeIndex + 1];
        await converter.convertRecipe(recipeName);
      } else {
        console.error('Please specify --all, --recipe <name>, or --analyze');
        showHelp();
        process.exit(1);
      }
    }
    
    console.log('\n✅ Image conversion completed!');
  } catch (error) {
    console.error('Error during image conversion:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = ImageConverter;
