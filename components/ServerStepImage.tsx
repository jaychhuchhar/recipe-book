import React from 'react';
import { RecipeStepImage } from './RecipeStepImage';
import { getRecipeImages } from '@/lib/recipe-images';

interface ServerStepImageProps {
  recipeSlug: string;
  stepNumber: number | string; // Support both 1 and "1.1", "1.2" etc
  alt?: string;
  caption?: string;
  size?: 'small' | 'medium' | 'large';
  fallbackSrc?: string;
}

export function ServerStepImage({ 
  recipeSlug, 
  stepNumber, 
  alt, 
  caption, 
  size = 'medium',
  fallbackSrc 
}: ServerStepImageProps) {
  // Get all step images for this recipe
  const stepImages = getRecipeImages(recipeSlug, 'steps');
  
  // Convert stepNumber to string for consistent matching
  const stepStr = stepNumber.toString();
  
  // Find the image for this specific step
  const stepImage = stepImages.find(img => {
    const filename = img.split('/').pop() || '';
    const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|webp|avif)$/i, '');
    
    return (
      nameWithoutExt === stepStr ||           // Exact match: "1.jpg" -> "1"
      nameWithoutExt === `${stepStr}.0` ||    // "1.0.jpg" -> "1"
      filename.startsWith(`${stepStr}.`)      // "1.1.jpg", "1.2.jpg" etc -> "1.1", "1.2"
    );
  });

  const imageSrc = stepImage || fallbackSrc;

  if (!imageSrc) {
    return null; // No image available
  }

  return (
    <RecipeStepImage
      src={imageSrc}
      alt={alt || `Step ${stepNumber}`}
      caption={caption}
      size={size}
    />
  );
}
