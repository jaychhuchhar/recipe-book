"use client";
import React from "react";
import Image from "next/image";

export function RecipeImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = React.useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const touchStartX = React.useRef(0);
  const touchEndX = React.useRef(0);
  const numImages = images.length;

  React.useEffect(() => {
    if (numImages <= 1) return;
    timerRef.current = setTimeout(() => {
      setIndex((i: number) => (i + 1) % numImages);
    }, 3500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, numImages]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && numImages > 1) {
      setIndex((i) => (i + 1) % numImages);
    }
    if (isRightSwipe && numImages > 1) {
      setIndex((i) => (i - 1 + numImages) % numImages);
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <div 
      style={{ 
        position: "relative", 
        maxWidth: 480, 
        margin: "1.2em auto", 
        height: 320, 
        overflow: "hidden", 
        background: "#f3f4f6", 
        borderRadius: "0.7em", 
        boxShadow: "0 2px 12px #0001",
        touchAction: "pan-y pinch-zoom" // Allow vertical scrolling but capture horizontal swipes
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Image
        src={images[index]}
        alt={alt}
        width={480}
        height={320}
        style={{
          display: "block",
          borderRadius: "0.7em",
          background: "#f3f4f6",
          transition: "opacity 0.3s",
          objectFit: 'cover',
          width: '100%',
          height: '100%'
        }}
      />
      {numImages > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => setIndex((i) => (i - 1 + numImages) % numImages)}
            style={{
              position: "absolute",
              top: "50%",
              left: 8,
              transform: "translateY(-50%)",
              background: "#fff8",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              cursor: "pointer",
              fontSize: 18,
              fontWeight: 700,
              zIndex: 2,
              boxShadow: "0 1px 4px #0002",
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => setIndex((i) => (i + 1) % numImages)}
            style={{
              position: "absolute",
              top: "50%",
              right: 8,
              transform: "translateY(-50%)",
              background: "#fff8",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              cursor: "pointer",
              fontSize: 18,
              fontWeight: 700,
              zIndex: 2,
              boxShadow: "0 1px 4px #0002",
            }}
          >
            ›
          </button>
          <div style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 8,
            display: "flex",
            justifyContent: "center",
            gap: 6,
          }}>
            {images.map((_, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: i === index ? "#2563eb" : "#d1d5db",
                  margin: "0 2px",
                  transition: "background 0.2s",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
