"use client";

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  sizes?: string;
  fill?: boolean;
  onLoad?: () => void;
  webpSrc?: string; // WebP version if available
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  style,
  sizes,
  fill = false,
  onLoad,
  webpSrc,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Check if style contains background-related properties that could conflict
  const hasBackgroundStyle = style && (
    'background' in style || 
    'backgroundColor' in style || 
    'backgroundImage' in style
  );

  // Fallback/placeholder image data URL (tiny gray placeholder)
  const placeholderSrc = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLDSyM3bCIpbWpNZGNA6LMhBN7nY1hY0bhhWltSH/2Q==";

  if (hasError) {
    return (
      <div
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '0.875rem',
          ...(fill ? { position: 'absolute', inset: 0 } : { width, height })
        }}
        className={className}
      >
        Image failed to load
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', ...(fill ? { width: '100%', height: '100%' } : {}) }}>
      {webpSrc ? (
        // Use picture element for WebP with fallback
        <picture>
          <source srcSet={webpSrc} type="image/webp" sizes={sizes} />
          <Image
            src={src}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            placeholder={hasBackgroundStyle ? "empty" : "blur"}
            blurDataURL={hasBackgroundStyle ? undefined : placeholderSrc}
            className={className}
            style={{
              ...style,
              transition: 'opacity 0.3s ease',
              opacity: isLoading ? 0.5 : 1,
            }}
            sizes={sizes}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
          />
        </picture>
      ) : (
        // Fallback to regular Next.js Image
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          placeholder={hasBackgroundStyle ? "empty" : "blur"}
          blurDataURL={hasBackgroundStyle ? undefined : placeholderSrc}
          className={className}
          style={{
            ...style,
            transition: 'opacity 0.3s ease',
            opacity: isLoading ? 0.5 : 1,
          }}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'inherit',
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              border: '2px solid #ddd',
              borderTop: '2px solid #666',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      )}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
