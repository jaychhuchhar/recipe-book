import fs from 'fs';
import path from 'path';

// Common image extensions to check for
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif'];

// Get the public directory path
const getPublicPath = () => path.join(process.cwd(), 'public');

// Get recipe images directory
const getRecipeImagesPath = (recipeSlug: string) => 
  path.join(getPublicPath(), 'images', 'recipes', recipeSlug);

/**
 * Get all available images for a recipe
 */
export function getRecipeImages(recipeSlug: string, type: 'overview' | 'steps'): string[] {
  try {
    const recipePath = getRecipeImagesPath(recipeSlug);
    const typePath = path.join(recipePath, type);
    
    // Check if directory exists
    if (!fs.existsSync(typePath)) {
      return [];
    }
    
    // Read all files in the directory
    const files = fs.readdirSync(typePath);
    
    // Filter for image files and sort them
    const imageFiles = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase().slice(1);
        return IMAGE_EXTENSIONS.includes(ext);
      })
      .sort((a, b) => {
        // Special handling for overview images - prioritize certain names
        if (type === 'overview') {
          const priorityOrder = ['main', 'hero', 'final'];
          const aName = path.basename(a, path.extname(a)).toLowerCase();
          const bName = path.basename(b, path.extname(b)).toLowerCase();
          
          const aPriority = priorityOrder.indexOf(aName);
          const bPriority = priorityOrder.indexOf(bName);
          
          // If both have priority, sort by priority order
          if (aPriority !== -1 && bPriority !== -1) {
            return aPriority - bPriority;
          }
          
          // If only one has priority, it comes first
          if (aPriority !== -1) return -1;
          if (bPriority !== -1) return 1;
        }
        
        // Enhanced sorting to handle multiple step image naming patterns:
        // - 1.jpg, 2.jpg, 3.jpg (non-padded)
        // - 01.jpg, 02.jpg, 03.jpg (zero-padded)
        // - 1.1.jpg, 1.2.jpg (sub-steps with dots, non-padded)
        // - 01.1.jpg, 01.2.jpg (sub-steps with dots, zero-padded)
        // - 15-1.jpg, 15-2.jpg (sub-steps with dashes)
        // - step-1.jpg, step-01.jpg (legacy with prefix)
        const aMatch = a.match(/(?:step-)?0*(\d+)(?:[-.]0*(\d+))?/i);
        const bMatch = b.match(/(?:step-)?0*(\d+)(?:[-.]0*(\d+))?/i);
        
        if (aMatch && bMatch) {
          const aMain = parseInt(aMatch[1]);
          const bMain = parseInt(bMatch[1]);
          
          // Compare main step numbers
          if (aMain !== bMain) {
            return aMain - bMain;
          }
          
          // If main numbers are equal, compare sub-step numbers
          const aSub = parseInt(aMatch[2] || '0');
          const bSub = parseInt(bMatch[2] || '0');
          return aSub - bSub;
        }
        
        // Fallback to alphabetical sorting if no numbers found
        return a.localeCompare(b);
      })
      .map((file: string) => `/images/recipes/${recipeSlug}/${type}/${file}`);
    
    return imageFiles;
  } catch (error) {
    console.warn(`Failed to read recipe images for ${recipeSlug}/${type}:`, error);
    return [];
  }
}

/**
 * Check if a recipe has any images
 */
export function hasRecipeImages(recipeSlug: string, type?: 'overview' | 'steps'): boolean {
  if (type) {
    return getRecipeImages(recipeSlug, type).length > 0;
  }
  
  // Check both overview and steps
  return getRecipeImages(recipeSlug, 'overview').length > 0 || 
         getRecipeImages(recipeSlug, 'steps').length > 0;
}

/**
 * Get all recipe slugs that have images
 */
export function getRecipesWithImages(): string[] {
  try {
    const recipesPath = path.join(getPublicPath(), 'images', 'recipes');
    
    if (!fs.existsSync(recipesPath)) {
      return [];
    }
    
    return fs.readdirSync(recipesPath)
      .filter((item: string) => {
        const itemPath = path.join(recipesPath, item);
        return fs.statSync(itemPath).isDirectory();
      });
  } catch (error) {
    console.warn('Failed to read recipes directory:', error);
    return [];
  }
}

/**
 * Create directory structure for a recipe
 */
export function createRecipeImageDirectories(recipeSlug: string): void {
  try {
    const recipePath = getRecipeImagesPath(recipeSlug);
    const overviewPath = path.join(recipePath, 'overview');
    const stepsPath = path.join(recipePath, 'steps');
    
    fs.mkdirSync(overviewPath, { recursive: true });
    fs.mkdirSync(stepsPath, { recursive: true });
    
    console.log(`Created image directories for recipe: ${recipeSlug}`);
  } catch (error) {
    console.error(`Failed to create directories for recipe ${recipeSlug}:`, error);
  }
}

/**
 * Get the best available image source with WebP support and fallbacks
 */
export function getOptimizedImageSrc(recipeSlug: string, type: 'overview' | 'steps', filename: string): {
  webp?: string;
  fallback: string;
  sources: Array<{ srcSet: string; type: string; }>;
} {
  const basePath = `/images/recipes/${recipeSlug}/${type}`;
  const nameWithoutExt = path.basename(filename, path.extname(filename));
  
  // Check what formats are available
  const webpPath = `${basePath}/${nameWithoutExt}.webp`;
  const jpegPath = `${basePath}/${nameWithoutExt}.jpg`;
  const pngPath = `${basePath}/${nameWithoutExt}.png`;
  
  const publicDir = getPublicPath();
  const webpExists = fs.existsSync(path.join(publicDir, webpPath));
  const jpegExists = fs.existsSync(path.join(publicDir, jpegPath));
  const pngExists = fs.existsSync(path.join(publicDir, pngPath));
  
  // Build sources array for picture element (most optimal first)
  const sources: Array<{ srcSet: string; type: string; }> = [];
  
  if (webpExists) {
    sources.push({ srcSet: webpPath, type: 'image/webp' });
  }
  
  // Determine the best fallback format
  let fallback: string;
  if (jpegExists) {
    fallback = jpegPath;
    if (!webpExists) {
      sources.push({ srcSet: jpegPath, type: 'image/jpeg' });
    }
  } else if (pngExists) {
    fallback = pngPath;
    if (!webpExists) {
      sources.push({ srcSet: pngPath, type: 'image/png' });
    }
  } else {
    // Fallback to original filename if optimized versions don't exist
    fallback = `${basePath}/${filename}`;
    const ext = path.extname(filename).toLowerCase();
    const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
    sources.push({ srcSet: fallback, type: mimeType });
  }
  
  return {
    webp: webpExists ? webpPath : undefined,
    fallback,
    sources
  };
}
