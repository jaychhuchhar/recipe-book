#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Image optimization script to generate metadata and preload hints
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const OUTPUT_FILE = path.join(process.cwd(), 'lib', 'image-manifest.json');

// Common image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

function generateImageManifest() {
  console.log('🖼️  Generating image manifest for optimization...');
  
  const manifest = {
    recipes: {},
    totalImages: 0,
    generatedAt: new Date().toISOString()
  };

  if (!fs.existsSync(IMAGES_DIR)) {
    console.log('No images directory found');
    return;
  }

  // Scan recipes directory
  const recipesDir = path.join(IMAGES_DIR, 'recipes');
  if (fs.existsSync(recipesDir)) {
    const recipes = fs.readdirSync(recipesDir);
    
    recipes.forEach(recipeSlug => {
      const recipePath = path.join(recipesDir, recipeSlug);
      if (!fs.statSync(recipePath).isDirectory()) return;
      
      manifest.recipes[recipeSlug] = {
        overview: [],
        steps: []
      };
      
      // Scan overview images
      const overviewPath = path.join(recipePath, 'overview');
      if (fs.existsSync(overviewPath)) {
        const overviewFiles = fs.readdirSync(overviewPath)
          .filter(file => IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()))
          .map(file => {
            const filePath = path.join(overviewPath, file);
            const stats = fs.statSync(filePath);
            return {
              filename: file,
              path: `/images/recipes/${recipeSlug}/overview/${file}`,
              size: stats.size,
              priority: file.toLowerCase().startsWith('main') ? 'high' : 'normal'
            };
          });
        
        manifest.recipes[recipeSlug].overview = overviewFiles;
        manifest.totalImages += overviewFiles.length;
      }
      
      // Scan step images
      const stepsPath = path.join(recipePath, 'steps');
      if (fs.existsSync(stepsPath)) {
        const stepFiles = fs.readdirSync(stepsPath)
          .filter(file => IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()))
          .map(file => {
            const filePath = path.join(stepsPath, file);
            const stats = fs.statSync(filePath);
            return {
              filename: file,
              path: `/images/recipes/${recipeSlug}/steps/${file}`,
              size: stats.size,
              priority: 'low' // Step images can be lazy loaded
            };
          });
        
        manifest.recipes[recipeSlug].steps = stepFiles;
        manifest.totalImages += stepFiles.length;
      }
    });
  }

  // Ensure lib directory exists
  const libDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  // Write manifest
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
  
  console.log(`✅ Image manifest generated with ${manifest.totalImages} images`);
  console.log(`📄 Saved to: ${OUTPUT_FILE}`);
  
  // Analyze and provide optimization recommendations
  const largeImages = [];
  Object.values(manifest.recipes).forEach(recipe => {
    [...recipe.overview, ...recipe.steps].forEach(img => {
      if (img.size > 1000000) { // > 1MB
        largeImages.push(img);
      }
    });
  });
  
  if (largeImages.length > 0) {
    console.log(`\n⚠️  Found ${largeImages.length} large images (>1MB):`);
    largeImages.forEach(img => {
      const sizeMB = (img.size / 1024 / 1024).toFixed(1);
      console.log(`   ${img.path} (${sizeMB}MB)`);
    });
    
    console.log(`\n💡 Optimization recommendations:`);
    console.log(`   1. Compress images to <500KB for web (use tools like TinyPNG, ImageOptim)`);
    console.log(`   2. Convert to WebP format for better compression`);
    console.log(`   3. Resize overview images to max 800x600px`);
    console.log(`   4. Resize step images to max 600x450px`);
    console.log(`   5. Use quality setting 85-90% for JPEG compression`);
  }
}

// Run if called directly
if (require.main === module) {
  generateImageManifest();
}

module.exports = { generateImageManifest };
