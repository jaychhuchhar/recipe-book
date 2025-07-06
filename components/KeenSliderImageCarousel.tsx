"use client";
import React from "react";
import Image from "next/image";
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

export function KeenSliderImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);
  
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  if (!images || images.length === 0) return null;

  return (
    <div className="carousel-container" style={{ 
      position: "relative", 
      maxWidth: "480px",
      width: "100%",
      margin: "1.2em auto",
      padding: "0 1rem",
      // Ensure container never exceeds viewport width
      boxSizing: "border-box"
    }}>
      <style jsx global>{`
        :root {
          --card-bg-light: #fff;
          --card-bg-dark: #232329;
          --heading-light: #222;
          --heading-dark: #f3f3f3;
          --accent-light: #333;
          --accent-dark: #e0e0e0;
          --text-light: #555;
          --text-dark: #e0e0e0;
        }
        html.dark {
          --card-bg: var(--card-bg-dark);
          --heading: var(--heading-dark);
          --accent: var(--accent-dark);
          --text: var(--text-dark);
        }
        html:not(.dark) {
          --card-bg: var(--card-bg-light);
          --heading: var(--heading-light);
          --accent: var(--accent-light);
          --text: var(--text-light);
        }
        
        @media (max-width: 640px) {
          .carousel-container {
            padding: 0 0.5rem !important;
            margin: 1rem auto !important;
          }
          
          .carousel-slider {
            height: 240px !important;
          }
          
          .carousel-slide {
            height: 240px !important;
          }
        }
        
        @media (max-width: 480px) {
          .carousel-container {
            padding: 0 0.25rem !important;
            max-width: calc(100vw - 0.5rem) !important;
          }
          
          .carousel-slider {
            height: 200px !important;
          }
          
          .carousel-slide {
            height: 200px !important;
          }
        }
      `}</style>
      
      {/* Navigation wrapper with arrows outside the slider */}
      {loaded && instanceRef.current && images.length > 1 ? (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '16px'
        }}>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => instanceRef.current?.prev()}
            style={{
              background: "var(--card-bg)",
              color: "var(--heading)",
              border: "1px solid var(--accent)",
              borderRadius: "50%",
              width: 32,
              height: 32,
              cursor: "pointer",
              fontSize: 18,
              fontWeight: 700,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              transition: "all 0.2s ease",
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
            }}
          >
            ‹
          </button>
          
          <div 
            ref={sliderRef} 
            className="keen-slider carousel-slider" 
            style={{
              height: 320,
              borderRadius: "0.7em",
              overflow: "hidden",
              background: "var(--card-bg)",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
              width: "100%",
              flex: 1
            }}
          >
            {images.map((image, idx) => (
              <div key={idx} className="keen-slider__slide carousel-slide" style={{ height: 320 }}>
                <Image
                  src={image}
                  alt={`${alt} - Image ${idx + 1}`}
                  width={480}
                  height={320}
                  style={{
                    display: "block",
                    borderRadius: "0.7em",
                    background: "transparent",
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%'
                  }}
                />
              </div>
            ))}
          </div>
          
          <button
            type="button"
            aria-label="Next image"
            onClick={() => instanceRef.current?.next()}
            style={{
              background: "var(--card-bg)",
              color: "var(--heading)",
              border: "1px solid var(--accent)",
              borderRadius: "50%",
              width: 32,
              height: 32,
              cursor: "pointer",
              fontSize: 18,
              fontWeight: 700,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              transition: "all 0.2s ease",
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
            }}
          >
            ›
          </button>
        </div>
      ) : (
        <div 
          ref={sliderRef} 
          className="keen-slider carousel-slider" 
          style={{
            height: 320,
            borderRadius: "0.7em",
            overflow: "hidden",
            background: "var(--card-bg)",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
            width: "100%"
          }}
        >
          {images.map((image, idx) => (
            <div key={idx} className="keen-slider__slide carousel-slide" style={{ height: 320 }}>
              <Image
                src={image}
                alt={`${alt} - Image ${idx + 1}`}
                width={480}
                height={320}
                style={{
                  display: "block",
                  borderRadius: "0.7em",
                  background: "transparent",
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Dot indicators */}
      {loaded && instanceRef.current && images.length > 1 && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 6,
          marginTop: 12,
        }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => instanceRef.current?.moveToIdx(i)}
              style={{
                display: "inline-block",
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: i === currentSlide ? "#2563eb" : "#d1d5db",
                margin: "0 2px",
                transition: "background 0.2s",
                border: "none",
                cursor: "pointer",
              }}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
