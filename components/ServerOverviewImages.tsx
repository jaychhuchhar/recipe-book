import React from 'react';
import { getRecipeImages } from '@/lib/recipe-images';
import { RecipeImageManager } from './RecipeImageManager';

interface ServerOverviewImagesProps {
  recipeSlug: string;
  fallbackImages?: string[];
  alt?: string;
  className?: string;
}

/**
 * Server-side component that auto-detects overview images for a recipe
 * and renders them using RecipeImageManager
 */
export function ServerOverviewImages({ 
  recipeSlug, 
  fallbackImages = [], 
  alt = "Recipe overview",
  className 
}: ServerOverviewImagesProps) {

  // Get local overview images from the file system
  const overviewImages = getRecipeImages(recipeSlug, 'overview');

  return (
    <div className={className}>
      <RecipeImageManager
        type="overview"
        localImages={overviewImages}
        fallbackImages={fallbackImages}
        alt={alt}
      />
    </div>
  );
}
