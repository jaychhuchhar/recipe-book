# Recipe Images - Source Directory

This directory contains the original, high-quality images for all recipes. These images are preserved at their original resolution and quality to serve as the source material for optimization.

## Directory Structure

```
recipes/images/
├── [recipe-name]/
│   ├── overview/
│   │   ├── main.jpg        # Main recipe image (featured/hero image)
│   │   ├── 1.jpg           # Additional overview images
│   │   ├── 2.jpg
│   │   └── ...
│   └── steps/
│       ├── 01.jpg          # Step images (zero-padded or non-padded)
│       ├── 02.jpg
│       ├── 15-1.jpg        # Multiple images per step
│       ├── 15-2.jpg
│       └── ...
└── README.md               # This file
```

## Image Guidelines

### File Formats
- Use JPEG for photographs
- Use PNG for graphics, screenshots, or images with transparency
- Original images can be high resolution (4K, etc.)

### Naming Conventions
- **Overview images**: `main.jpg` (required), `1.jpg`, `2.jpg`, etc.
- **Step images**: Support multiple formats:
  - Zero-padded: `01.jpg`, `02.jpg`, `03.jpg`
  - Non-padded: `1.jpg`, `2.jpg`, `3.jpg`
  - Legacy: `step-1.jpg`, `step-01.jpg`
  - Multiple per step: `15-1.jpg`, `15-2.jpg` (for multiple images in step 15)

### Image Optimization Workflow

1. **Store originals here**: Place your high-quality source images in this directory
2. **Run optimization**: The build process automatically:
   - Optimizes images from `recipes/images/` → `public/images/recipes/`
   - Resizes large images to max 1920×1080
   - Compresses JPEG/PNG with quality settings
   - Generates WebP versions for modern browsers
   - Preserves originals for future re-processing

3. **Build commands**:
   ```bash
   npm run convert-images        # Optimize all images
   npm run convert-images-webp   # Generate WebP versions
   npm run analyze-images        # Analyze source images
   ```

## Manual Commands

```bash
# Optimize all recipes
node scripts/convert-images.js --all

# Optimize specific recipe
node scripts/convert-images.js --recipe recipe-name

# Generate WebP versions
node scripts/convert-images.js --all --webp

# Analyze source images
node scripts/convert-images.js --analyze

# Custom quality settings
node scripts/convert-images.js --all --jpeg-quality 80 --webp-quality 75
```

## Benefits of This Workflow

- **Preserves originals**: Source images remain untouched
- **Automatic optimization**: Build process handles optimization
- **Multiple formats**: Serves both JPEG and WebP for browser compatibility
- **Re-processable**: Can re-optimize with different settings anytime
- **Version control friendly**: Optimized images are generated, not committed
- **Performance**: Dramatically reduces file sizes (typically 90%+ reduction)

## File Size Guidelines

- Original images can be any size (the system will optimize)
- Target for optimized images: Under 500KB per image
- WebP versions are typically 20-40% smaller than optimized JPEG
- Overview images are more important to optimize (shown on listing pages)
