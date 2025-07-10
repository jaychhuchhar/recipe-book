import React from 'react';
import { RecipeStepImage } from './RecipeStepImage';
import { getRecipeImages, getOptimizedImageSrc } from '@/lib/recipe-images';

interface ServerStepImageProps {
  stepNumber: number | string; // Support both 1 and "1.1", "1.2" etc
  alt?: string;
  caption?: string;
  size?: 'small' | 'medium' | 'large';
  fallbackSrc?: string;
  recipeSlug?: string; // Optional - will be injected by MDX wrapper if not provided
}

export function ServerStepImage({ 
  stepNumber, 
  alt, 
  caption, 
  size = 'medium',
  fallbackSrc,
  recipeSlug
}: ServerStepImageProps) {
  if (!recipeSlug) {
    console.warn('ServerStepImage: No recipeSlug provided. This should be automatically injected.');
    return null;
  }
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

  if (!stepImage && !fallbackSrc) {
    return null; // No image available
  }

  // Get optimized image sources (WebP + fallback)
  let imageSources;
  if (stepImage) {
    const filename = stepImage.split('/').pop() || '';
    imageSources = getOptimizedImageSrc(recipeSlug, 'steps', filename);
  }

  const finalSrc = stepImage || fallbackSrc;
  if (!finalSrc) {
    return null;
  }

  return (
    <RecipeStepImage
      src={imageSources?.fallback || finalSrc}
      webpSrc={imageSources?.webp}
      alt={alt || `Step ${stepNumber}`}
      caption={caption}
      size={size}
    />
  );
}
