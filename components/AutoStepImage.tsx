"use client";

import React from 'react';
import { RecipeStepImage } from './RecipeStepImage';

interface AutoStepImageProps {
  recipeSlug: string;
  stepNumber: number | string; // Support both 1 and "1.1", "1.2" etc
  alt?: string;
  caption?: string;
  size?: 'small' | 'medium' | 'large';
  fallbackSrc?: string;
}

export function AutoStepImage({ 
  recipeSlug, 
  stepNumber, 
  alt, 
  caption, 
  size = 'medium',
  fallbackSrc 
}: AutoStepImageProps) {
  // Convert stepNumber to string for consistent matching
  const stepStr = stepNumber.toString();
  
  // Try to find the first existing image
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Generate possible image paths for this step
    const imagePaths = [
      `/images/recipes/${recipeSlug}/steps/${stepStr}.jpg`,
      `/images/recipes/${recipeSlug}/steps/${stepStr}.jpeg`,
      `/images/recipes/${recipeSlug}/steps/${stepStr}.png`,
      `/images/recipes/${recipeSlug}/steps/${stepStr}.webp`,
      `/images/recipes/${recipeSlug}/steps/${stepStr}.avif`,
    ];

    async function findImage() {
      setIsLoading(true);
      
      for (const path of imagePaths) {
        try {
          const response = await fetch(path, { method: 'HEAD' });
          if (response.ok) {
            setImageSrc(path);
            setIsLoading(false);
            return;
          }
        } catch {
          // Continue to next path
        }
      }
      
      // No image found, use fallback or don't render
      setImageSrc(fallbackSrc || null);
      setIsLoading(false);
    }

    findImage();
  }, [recipeSlug, stepNumber, stepStr, fallbackSrc]);

  if (isLoading) {
    return null; // or a loading placeholder
  }

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
