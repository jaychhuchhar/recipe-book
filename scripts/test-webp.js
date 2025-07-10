#!/usr/bin/env node

/**
 * Test script to verify WebP generation and serving
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing WebP Implementation...\n');

// Check if WebP files were generated
const publicDir = path.join(process.cwd(), 'public', 'images', 'recipes');

function checkWebPFiles(dir, recipeName = '') {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let webpCount = 0;
    let jpegCount = 0;
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const result = checkWebPFiles(fullPath, recipeName || entry.name);
        webpCount += result.webpCount;
        jpegCount += result.jpegCount;
      } else if (entry.name.endsWith('.webp')) {
        webpCount++;
        console.log(`✓ WebP: ${path.relative(publicDir, fullPath)}`);
      } else if (entry.name.endsWith('.jpg') || entry.name.endsWith('.jpeg')) {
        jpegCount++;
        console.log(`✓ JPEG: ${path.relative(publicDir, fullPath)}`);
      }
    }
    
    return { webpCount, jpegCount };
  } catch (error) {
    console.error(`Error checking directory ${dir}:`, error.message);
    return { webpCount: 0, jpegCount: 0 };
  }
}

if (fs.existsSync(publicDir)) {
  const results = checkWebPFiles(publicDir);
  
  console.log('\n📊 Results:');
  console.log(`JPEG files: ${results.jpegCount}`);
  console.log(`WebP files: ${results.webpCount}`);
  
  if (results.webpCount > 0 && results.jpegCount > 0) {
    console.log('\n✅ WebP generation successful!');
    console.log('Browsers will automatically select the optimal format.');
    
    const ratio = (results.webpCount / results.jpegCount * 100).toFixed(1);
    console.log(`WebP coverage: ${ratio}%`);
  } else if (results.jpegCount > 0) {
    console.log('\n⚠️  JPEG files found but no WebP files.');
    console.log('Run: npm run convert-images-webp');
  } else {
    console.log('\n❌ No optimized images found.');
    console.log('Run: npm run convert-images');
  }
} else {
  console.log('❌ No public/images/recipes directory found.');
  console.log('Run: npm run setup-images && npm run convert-images');
}

console.log('\n🔍 To test in browser:');
console.log('1. Open browser dev tools → Network tab');
console.log('2. Load a recipe page');
console.log('3. Check image requests - modern browsers should load .webp files');
console.log('4. In older browsers, .jpg files should be loaded instead');
