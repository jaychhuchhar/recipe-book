import React from 'react';
import { RecipeImageManager } from './RecipeImageManager';
import { getRecipeImages } from '@/lib/recipe-images';

interface RecipeStepImagesProps {
  recipeSlug?: string;
  stepImages?: string[];
  alt?: string;
}

export function RecipeStepImages({ recipeSlug, stepImages = [], alt = "Recipe step" }: RecipeStepImagesProps) {
  // If no recipeSlug provided, use only the provided step images
  if (!recipeSlug) {
    if (stepImages.length === 0) return null;
    
    return (
      <div className="recipe-step-images my-6">
        <RecipeImageManager 
          type="steps"
          localImages={[]}
          fallbackImages={stepImages}
          alt={alt}
        />
      </div>
    );
  }
  
  // Get local step images
  const localStepImages = getRecipeImages(recipeSlug, 'steps');
  
  return (
    <div className="recipe-step-images my-6">
      <RecipeImageManager 
        type="steps"
        localImages={localStepImages}
        fallbackImages={stepImages}
        alt={alt}
      />
    </div>
  );
}
