"use client";
import React from 'react';
import Image from 'next/image';

export function RecipeImage({ src, alt }: { src: string; alt: string }) {
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [isSmall, setIsSmall] = React.useState(false);

  React.useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    function handleLoad() {
      if (img && (img.naturalWidth < 400 || img.naturalHeight < 300)) {
        setIsSmall(true);
      } else {
        setIsSmall(false);
      }
    }
    img.addEventListener('load', handleLoad);
    if (img.complete) handleLoad();
    return () => img.removeEventListener('load', handleLoad);
  }, [src]);

  return (
    <Image
      ref={imgRef}
      src={src}
      alt={alt}
      style={{
        width: isSmall ? imgRef.current?.naturalWidth || 'auto' : '100%',
        maxWidth: isSmall ? imgRef.current?.naturalWidth || 230 : 480,
        height: 'auto',
        display: 'block',
        margin: '1.2em auto',
        borderRadius: '0.7em',
        boxShadow: '0 2px 12px #0001',
        objectFit: isSmall ? 'contain' : 'cover',
        background: isSmall ? '#f3f4f6' : undefined,
        padding: isSmall ? 16 : 0,
      }}
    />
  );
}
