"use client";

import React from 'react';
import { KeenSliderImageCarousel } from './KeenSliderImageCarousel';

interface RecipeImageManagerProps {
  type: 'overview' | 'steps';
  localImages?: string[]; // Pre-fetched local images from server
  fallbackImages?: string[];
  alt: string;
}

export function RecipeImageManager({ 
  type, 
  localImages = [], 
  fallbackImages = [], 
  alt 
}: RecipeImageManagerProps) {
  
  // Prioritize local images, then fallback images
  const imagesToShow = localImages.length > 0 ? localImages : fallbackImages;

  // Don't render anything if no images are found
  if (imagesToShow.length === 0) {
    return null;
  }

  return (
    <div className="recipe-images">
      <KeenSliderImageCarousel 
        images={imagesToShow} 
        alt={alt}
      />
      {localImages.length > 0 && (
        <p style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginTop: '0.5rem',
          fontStyle: 'italic'
        }}>
          {type === 'overview' ? 'Recipe photos' : 'Step-by-step photos'}
        </p>
      )}
    </div>
  );
}
