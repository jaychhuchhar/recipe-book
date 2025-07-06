# Recipe Image M        └── steps/             # Step-by-step cooking images
            ├── 1.jpg          # First cooking step
            ├── 1.1.jpg        # First sub-step  
            ├── 1.2.jpg        # Second sub-step
            ├── 2.jpg          # Second cooking step
            └── ...ment System

This project uses a structured approach to manage recipe images, automatically detecting and displaying local images when available, with fallbacks to external URLs.

## Directory Structure

```
public/images/recipes/
├── [recipe-slug]/
│   ├── overview/          # Recipe overview/hero images
│   │   ├── main.jpg       # Primary recipe image
│   │   ├── 1.jpg          # Additional overview images
│   │   ├── 2.jpg
│   │   ├── hero.jpg       # Hero image
│   │   └── final.jpg      # Final result image
│   └── steps/             # Step-by-step cooking images
│       ├── 1.jpg          # First cooking step
│       ├── 1.1.jpg        # First sub-step  
│       ├── 1.2.jpg        # Second sub-step
│       ├── 2.jpg          # Second cooking step
│       └── ...
```

## Setup

### Automatic Setup
Run the setup script to create directories for all existing recipes:

```bash
node scripts/setup-recipe-images.js
```

### Manual Setup
Create directories manually for a specific recipe:

```bash
mkdir -p public/images/recipes/[recipe-slug]/overview
mkdir -p public/images/recipes/[recipe-slug]/steps
```

## Supported Image Formats

- `.jpg` / `.jpeg`
- `.png`
- `.webp`
- `.avif`

## Naming Conventions

### Overview Images
- `main.jpg` - Primary recipe image (recommended)
- `1.jpg`, `2.jpg`, `3.jpg` - Additional overview images
- `hero.jpg` - Hero/banner image
- `final.jpg` - Final result image

### Step Images
- `1.jpg`, `2.jpg`, `3.jpg` - Main step images
- `1.1.jpg`, `1.2.jpg` - Sub-steps for detailed instructions
- `2.1.jpg`, `2.2.jpg` - Sub-steps for step 2, etc.
- `step-1.jpg`, `step-2.jpg` - Legacy naming (still supported)

## Usage in Code

### Overview Images
Overview images are automatically detected and displayed on recipe pages. No code changes needed.

```tsx
// Automatically used in recipe view pages
<RecipeImageManager 
  recipeSlug="breakfast/avocado-toast-egg"
  type="overview"
  localImages={detectedImages}
  fallbackImages={page.data.images}
  alt={page.data.title}
/>
```

### Step Images in MDX Files
Use the `RecipeStepImages` component in your MDX files:

```jsx
<!-- In your recipe.mdx file -->
<RecipeStepImages recipeSlug="breakfast/avocado-toast-egg" alt="Cooking steps" />
```

Or with manual images:
```jsx
<RecipeStepImages 
  stepImages={[
    "https://example.com/step1.jpg",
    "https://example.com/step2.jpg"
  ]} 
  alt="Cooking steps" 
/>
```

## Priority System

The system follows this priority order:

1. **Local images** (from `/public/images/recipes/[recipe-slug]/`)
2. **Frontmatter images** (from recipe MDX `images` field)
3. **Fallback** (logo.png for missing images)

## Components

### RecipeImageManager
Main component for displaying recipe images with automatic detection.

**Props:**
- `recipeSlug`: String identifier for the recipe
- `type`: 'overview' | 'steps'
- `localImages`: Pre-detected local images
- `fallbackImages`: Fallback images from frontmatter
- `alt`: Alt text for images

### RecipeStepImages
Specialized component for step-by-step images in MDX content.

**Props:**
- `recipeSlug`: String identifier for the recipe (optional)
- `stepImages`: Manual step images (optional)
- `alt`: Alt text for images

## Utilities

### Server-side Functions
Located in `lib/recipe-images.ts`:

- `getRecipeImages(recipeSlug, type)` - Get images for a recipe
- `hasRecipeImages(recipeSlug, type?)` - Check if recipe has images
- `getRecipesWithImages()` - Get all recipes with images
- `createRecipeImageDirectories(recipeSlug)` - Create directory structure

### Preview Functions
Located in `lib/recipe-preview.ts`:

- `getRecipePreviewImage(recipeSlug, fallbackImages)` - Get first available image
- `hasRecipePreviewImage(recipeSlug, fallbackImages)` - Check if preview exists

## Migration from External URLs

### Option 1: Keep External URLs as Fallbacks
- Add local images to the directory structure
- Keep existing `images` array in frontmatter as fallbacks
- Local images will be prioritized automatically

### Option 2: Full Migration
1. Download external images to local directories
2. Remove or comment out `images` array in MDX frontmatter
3. Local images will be used exclusively

## Examples

### Recipe with Local Images
```
public/images/recipes/breakfast/avocado-toast-egg/
├── overview/
│   ├── main.jpg        # Primary image
│   ├── 1.jpg          # Additional angle
│   └── final.jpg      # Plated result
└── steps/
    ├── step-1.jpg     # Mashing avocado
    ├── step-2.jpg     # Toasting bread
    └── step-3.jpg     # Final assembly
```

### MDX Usage
```mdx
---
title: "Avocado Toast with Egg"
description: "A quick, nutritious breakfast"
# images array now acts as fallback only
images:
  - "https://example.com/fallback.jpg"
---

## Instructions

1. Mash the avocado
2. Toast the bread  
3. Assemble the toast

<RecipeStepImages recipeSlug="breakfast/avocado-toast-egg" alt="Avocado toast steps" />
```

## Performance Notes

- Images are detected at build time for optimal performance
- Client-side detection is used as fallback for dynamic content
- Images are automatically optimized by Next.js Image component
- Carousel uses Keen Slider for smooth performance

## Troubleshooting

### Images Not Appearing
1. Check file paths match the naming conventions
2. Verify image formats are supported
3. Ensure recipe slug matches directory name
4. Check browser console for loading errors

### Build Errors
1. Verify all image files are properly formatted
2. Check that directories exist before adding images
3. Ensure MDX frontmatter is valid

### Performance Issues
1. Optimize image sizes (recommended: overview 800px max width, steps 600px max width)
2. Use modern formats like WebP when possible
3. Consider lazy loading for pages with many images
