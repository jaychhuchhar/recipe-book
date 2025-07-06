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
        // Sort numerically if files are numbered
        const aNum = parseInt(a.match(/(\d+)/)?.[1] || '0');
        const bNum = parseInt(b.match(/(\d+)/)?.[1] || '0');
        return aNum - bNum;
      })
      .map(file => `/images/recipes/${recipeSlug}/${type}/${file}`);
    
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
      .filter(item => {
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
