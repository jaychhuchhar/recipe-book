"use client";

import React from 'react';
import Image from 'next/image';

interface RecipeStepImageProps {
  src: string;
  alt: string;
  caption?: string;
  size?: 'small' | 'medium' | 'large';
}

export function RecipeStepImage({ src, alt, caption, size = 'medium' }: RecipeStepImageProps) {
  const sizeStyles = {
    small: { maxWidth: '300px', width: '100%' },
    medium: { maxWidth: '450px', width: '100%' },
    large: { maxWidth: '600px', width: '100%' }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '1.5rem auto',
      gap: '0.5rem'
    }}>
      <div style={{
        ...sizeStyles[size],
        position: 'relative',
        aspectRatio: '4/3',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <Image
          src={src}
          alt={alt}
          fill
          style={{
            objectFit: 'cover'
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      {caption && (
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          margin: 0,
          fontStyle: 'italic'
        }}>
          {caption}
        </p>
      )}
    </div>
  );
}
