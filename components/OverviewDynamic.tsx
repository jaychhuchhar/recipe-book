"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import type { Recipe } from '@/types/recipe';

// Deterministic Recipe of the Day based on date
function getRecipeOfTheDay<T>(arr: T[]): T | null {
  if (!arr.length) return null;
  // Use current date (YYYY-MM-DD) as seed
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return arr[seed % arr.length];
}

// Add a helper to get the slug from the file name (info.path)
function getSlugFromRecipe(recipe: Recipe & { _path?: string, url?: string }): string {
  // Use the canonical url if present (from source.getPages())
  if (recipe.url) return recipe.url.replace(/^\//, '');
  if (recipe._path) return recipe._path.replace(/\.mdx?$/, '');
  // fallback: slugify title (should not be needed if all recipes have _path)
  return recipe.title.toLowerCase().replace(/\s+/g, '-');
}

function getVisibleCount() {
  if (typeof window === 'undefined') return 1;
  if (window.innerWidth >= 1200) return 4;
  if (window.innerWidth >= 900) return 3;
  if (window.innerWidth >= 600) return 2;
  return 1;
}

export default function OverviewDynamic({ recipes }: { recipes: Recipe[] }) {
  // Sort by date descending, fallback to title
  const featured = recipes
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.date || '1970-01-01');
      const dateB = new Date(b.date || '1970-01-01');
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 10); // Show up to 10 featured recipes

  // Responsive carousel state
  const [visibleCount, setVisibleCount] = useState(1); // Always 1 on server, update on client
  const [hasMounted, setHasMounted] = useState(false);
  const total = featured.length;

  // Keen slider setup
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: visibleCount,
      spacing: 32,
    },
    breakpoints: {
      '(min-width:1200px)': { slides: { perView: 4, spacing: 32 } },
      '(min-width:900px)': { slides: { perView: 3, spacing: 32 } },
      '(min-width:600px)': { slides: { perView: 2, spacing: 32 } },
      '(max-width:599px)': { slides: { perView: 1, spacing: 16 } },
    },
    initial: 0,
    loop: true, // Enable looping for auto-scroll
  }, [
    // Conditional auto-scroll plugin - only when content overflows
    (slider) => {
      let timeout: ReturnType<typeof setTimeout>;
      let mouseOver = false;
      
      function clearNextTimeout() {
        clearTimeout(timeout);
      }
      
      function nextTimeout() {
        clearTimeout(timeout);
        if (mouseOver) return;
        
        // Auto-scroll if there are more than 2 recipes to ensure it works on all screen sizes
        if (total <= 2) return; // Only disable if very few recipes
        
        timeout = setTimeout(() => {
          slider.next();
        }, 5000); // 5 seconds for featured recipes (longer than image carousel)
      }
      
      slider.on("created", () => {
        slider.container.addEventListener("mouseover", () => {
          mouseOver = true;
          clearNextTimeout();
        });
        slider.container.addEventListener("mouseout", () => {
          mouseOver = false;
          nextTimeout();
        });
        nextTimeout();
      });
      
      slider.on("dragStarted", clearNextTimeout);
      slider.on("animationEnded", nextTimeout);
      slider.on("updated", nextTimeout);
    },
  ]);

  React.useEffect(() => {
    setHasMounted(true);
    function handleResize() {
      setVisibleCount(getVisibleCount());
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use page-based navigation to always show full sets, never partial cards
  const pageCount = Math.ceil(total / visibleCount);

  React.useEffect(() => {
    // setPage((p: number) => Math.min(p, Math.max(pageCount - 1, 0)));
    // No-op: setPage removed as it is not defined or used
  }, [visibleCount, total, pageCount]);

  // Random Recipe of the Day (deterministic for hydration safety)
  const recipeOfTheDay = getRecipeOfTheDay(recipes);

  return (
    <>
      {/* Responsive global styles for mobile and dark mode */}
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
        /* Force all headings, meta labels, toggle/details links, and buttons to use heading color */
        h1, h2, h3, h4, h5, h6,
        .meta-heading, .recipe-meta-label, .recipe-details-label, .calories-label,
        .toggle-details, .show-details, .hide-details, .meta-link, .recipe-meta-link,
        .recipe-meta a, .meta a, .details-toggle, .details-link,
        .recipe-meta button, .meta button, .details-toggle button, .details-link button,
        .recipe-meta summary, .meta summary, .details-toggle summary, .details-link summary,
        button.toggle-details, button.show-details, button.hide-details,
        summary.toggle-details, summary.show-details, summary.hide-details {
          color: var(--heading) !important;
        }
        a, button, summary {
          color: var(--heading) !important;
        }
        
        /* Ensure Keen Slider cards fit properly */
        .keen-slider__slide {
          overflow: visible !important;
        }
        .keen-slider__slide > * {
          width: 100% !important;
          box-sizing: border-box !important;
        }
        
        /* Override inline Tailwind blue-600 color for calories/details */
        [style*="color:#2563eb"], [style*="color: #2563eb"] {
          color: var(--heading) !important;
        }
        /* Force override of any inline color property */
        [style*="color:"] {
          color: var(--heading) !important;
        }
        @media (max-width: 900px) {
          body, html {
            overflow-x: hidden !important;
          }
          .recipe-of-day-flex,
          .keen-slider,
          .keen-slider__slide,
          .recipe-book-glance-flex {
            flex-wrap: wrap !important;
            flex-direction: column !important;
            align-items: stretch !important;
            min-width: 0 !important;
            max-width: 100vw !important;
            box-sizing: border-box;
          }
          .keen-slider__slide {
            min-width: 0 !important;
            max-width: 100vw !important;
          }
        }
        @media (max-width: 600px) {
          .recipe-of-day-flex {
            flex-wrap: wrap !important;
            flex-direction: column !important;
            align-items: stretch !important;
          }
        }
        html.dark body, html[data-theme='dark'] body {
          background: #18181b !important;
          color: var(--text-dark) !important;
        }
        html.dark .recipe-of-the-day-flex,
        html.dark .keen-slider__slide,
        html.dark .app-features-list,
        html.dark .recipe-book-glance {
          background: var(--card-bg-dark) !important;
          color: var(--text-dark) !important;
          border-color: #333 !important;
        }
        html.dark .recipe-book-glance-flex {
          background: none !important;
        }
        html.dark h1, html.dark h2, html.dark h3, html.dark h4, html.dark h5, html.dark h6 {
          color: var(--heading-dark) !important;
        }
        html.dark .hero-section h1,
        html.dark .recipe-of-day-flex .recipe-of-day-title,
        html.dark .glance-card-number,
        html.dark .featured-section-title,
        html.dark .app-features-title,
        html.dark .glance-section-title {
          color: var(--heading-dark) !important;
        }
        html.dark .recipe-of-day-flex .recipe-of-day-accent {
          color: var(--accent-dark) !important;
        }
        html.dark .recipe-of-day-flex .recipe-of-day-description,
        html.dark .glance-card-label {
          color: var(--text-dark) !important;
        }
        html:not(.dark) h1, html:not(.dark) h2, html:not(.dark) h3, html:not(.dark) h4, html:not(.dark) h5, html:not(.dark) h6 {
          color: var(--heading-light) !important;
        }
        html:not(.dark) .hero-section h1,
        html:not(.dark) .recipe-of-day-flex .recipe-of-day-title,
        html:not(.dark) .glance-card-number,
        html:not(.dark) .featured-section-title,
        html:not(.dark) .app-features-title,
        html:not(.dark) .glance-section-title {
          color: var(--heading-light) !important;
        }
        html:not(.dark) .recipe-of-day-flex .recipe-of-day-accent {
          color: var(--accent-light) !important;
        }
        html:not(.dark) .recipe-of-day-flex .recipe-of-day-description,
        html:not(.dark) .glance-card-label {
          color: var(--text-light) !important;
        }
      `}</style>

      {/* Recipe of the Day */}
      {recipeOfTheDay && (
        <div
          style={{
            margin: '1.2rem auto 1.2rem auto', // Reduced space above and below
            background: 'var(--card-bg)',
            borderRadius: '1rem',
            boxShadow: '0 1px 6px #0001',
            padding: '1.2rem 0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
            flexWrap: 'nowrap',
            maxWidth: 600,
            justifyContent: 'center',
          }}
          className="recipe-of-day-flex"
        >
          <Image
            src={recipeOfTheDay.previewImage || '/logo.png'}
            alt={recipeOfTheDay.title}
            width={56}
            height={56}
            style={{
              objectFit: (recipeOfTheDay.previewImage || '/logo.png') !== '/logo.png' ? 'cover' : 'contain',
              borderRadius: '0.75rem',
              width: 56,
              height: 56,
              display: 'block',
              flexShrink: 0,
              minWidth: 56,
              minHeight: 56,
              background: 'var(--card-bg)',
            }}
          />
          <div>
            <div className="recipe-of-day-accent" style={{ fontWeight: 700, marginBottom: 4 }}>Recipe of the Day</div>
            <Link className="recipe-of-day-title" href={`/${getSlugFromRecipe(recipeOfTheDay)}`} style={{ fontSize: '1.25rem', fontWeight: 600, textDecoration: 'none' }}>{recipeOfTheDay.title}</Link>
            <div className="recipe-of-day-description" style={{ marginTop: 4 }}>{recipeOfTheDay.description}</div>
          </div>
        </div>
      )}

      <h2 className="featured-section-title" style={{ marginTop: '2.5rem', fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Featured Recipes</h2>
      {hasMounted ? (
        <div style={{ position: 'relative', width: '100%', margin: '0 auto 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflowX: 'auto' }}>
          <button
            onClick={() => instanceRef.current?.prev()}
            aria-label="Previous"
            style={{ 
              zIndex: 2, 
              background: 'var(--card-bg)', 
              color: 'var(--heading)',
              border: '1px solid var(--accent)', 
              borderRadius: '50%', 
              width: 36, 
              height: 36, 
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', 
              cursor: 'pointer', 
              marginRight: 16,
              fontSize: '18px',
              fontWeight: 'bold',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
            }}
          >&lt;</button>
          <div ref={sliderRef} className="keen-slider" style={{ width: '100%', borderRadius: '1rem', height: 340, overflow: 'hidden', flex: 1, minWidth: 0 }}>
            {featured.map((page) => (
              <div className="keen-slider__slide" key={page.title} style={{ height: 340, display: 'flex', alignItems: 'stretch' }}>
                <Link
                  href={`/${getSlugFromRecipe(page)}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    width: '100%',
                    height: 340,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '1rem',
                    background: 'var(--card-bg)',
                    border: '1.5px solid var(--accent)',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.boxShadow = '0 4px 18px rgba(0, 0, 0, 0.15)')}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.1)')}
                >
                  <Image 
                    src={page.previewImage || '/logo.png'} 
                    alt={page.title} 
                    width={320} 
                    height={200} 
                    style={{ 
                      objectFit: (page.previewImage || '/logo.png') !== '/logo.png' ? 'cover' : 'contain', 
                      width: '100%', 
                      height: 200, 
                      flexShrink: 0,
                      backgroundColor: (page.previewImage || '/logo.png') !== '/logo.png' ? 'transparent' : 'var(--card-bg)'
                    }} 
                  />
                  <div style={{ padding: '1.25rem', minHeight: 120, boxSizing: 'border-box', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{page.title}</h3>
                    <p style={{ margin: '0.5rem 0 0', color: 'var(--text)', flex: 1 }}>{page.description}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <button
            onClick={() => instanceRef.current?.next()}
            aria-label="Next"
            style={{ 
              zIndex: 2, 
              background: 'var(--card-bg)', 
              color: 'var(--heading)',
              border: '1px solid var(--accent)', 
              borderRadius: '50%', 
              width: 36, 
              height: 36, 
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', 
              cursor: 'pointer', 
              marginLeft: 16,
              fontSize: '18px',
              fontWeight: 'bold',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
            }}
          >&gt;</button>
        </div>
      ) : (
        <div style={{ width: '100%', margin: '0 auto 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 340, overflowX: 'auto' }}>
          {featured.slice(0, 1).map((page) => (
            <Link
              key={page.title}
              href={`/recipes/view/${getSlugFromRecipe(page)}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                width: '100%',
                maxWidth: 340,
                height: 340,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '1rem',
                background: 'var(--card-bg)',
                border: '1.5px solid var(--accent)',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s, transform 0.2s',
                boxSizing: 'border-box',
                margin: '0 auto',
              }}
            >
              <Image 
                src={page.previewImage || '/logo.png'} 
                alt={page.title} 
                width={320} 
                height={200} 
                style={{ 
                  objectFit: (page.previewImage || '/logo.png') !== '/logo.png' ? 'cover' : 'contain', 
                  width: '100%', 
                  height: 200, 
                  flexShrink: 0,
                  backgroundColor: (page.previewImage || '/logo.png') !== '/logo.png' ? 'transparent' : 'var(--card-bg)'
                }} 
              />
              <div style={{ padding: '1.25rem', minHeight: 120, boxSizing: 'border-box', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{page.title}</h3>
                <p style={{ margin: '0.5rem 0 0', color: 'var(--text)', flex: 1 }}>{page.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <h2 className="app-features-title" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>App Features</h2>
      <ul style={{ fontSize: '1.1rem', marginBottom: '2.5rem', paddingLeft: '1.5rem', lineHeight: 1.7 }}>
        <li>Modern, grouped recipe metadata and beautiful visuals</li>
        <li>Image carousel for recipes with multiple images</li>
        <li>Consistent metadata: rating, author, time, servings, calories, dietary, and more</li>
        <li>Modern, responsive UI</li>
      </ul>

      <h2 className="glance-section-title" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Recipe Book at a Glance</h2>
      <div className="recipe-book-glance-flex" style={{
        display: 'flex',
        gap: '1.2rem',
        flexWrap: 'wrap',
        marginBottom: '2rem',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'none', // Remove any wrapper background
      }}>
        <div style={{ 
          background: 'var(--card-bg)',
          borderRadius: '1rem', 
          boxShadow: '0 1px 6px #0001', 
          padding: '1rem 1.2rem', 
          minWidth: 140, 
          maxWidth: 180, 
          textAlign: 'center', 
          flex: '1 1 140px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <strong className="glance-card-number" style={{ fontSize: '1.5rem', lineHeight: 1 }}>{recipes.length}</strong>
          <div className="glance-card-label" style={{ marginTop: '0.3rem', fontSize: '1rem' }}>Total Recipes</div>
        </div>
        <div style={{ 
          background: 'var(--card-bg)',
          borderRadius: '1rem', 
          boxShadow: '0 1px 6px #0001', 
          padding: '1rem 1.2rem', 
          minWidth: 140, 
          maxWidth: 180, 
          textAlign: 'center', 
          flex: '1 1 140px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <strong className="glance-card-number" style={{ fontSize: '1.5rem', lineHeight: 1 }}>{Array.from(new Set(recipes.map(r => r.category).filter(Boolean))).length}</strong>
          <div className="glance-card-label" style={{ marginTop: '0.3rem', fontSize: '1rem' }}>Categories</div>
        </div>
        <div style={{ 
          background: 'var(--card-bg)',
          borderRadius: '1rem', 
          boxShadow: '0 1px 6px #0001', 
          padding: '1rem 1.2rem', 
          minWidth: 140, 
          maxWidth: 180, 
          textAlign: 'center', 
          flex: '1 1 140px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <strong className="glance-card-number" style={{ fontSize: '1.5rem', lineHeight: 1 }}>{Array.from(new Set(recipes.flatMap(r => r.tags || []))).length}</strong>
          <div className="glance-card-label" style={{ marginTop: '0.3rem', fontSize: '1rem' }}>Tags</div>
        </div>
      </div>
      <blockquote>Start exploring and enjoy your cooking journey!</blockquote>

      {/* Responsive fix for Recipe of the Day and Hero section layout */}
      <style jsx global>{`
        /* Make hero and recipe of the day full width on all screens */
        .hero-section,
        .recipe-of-day-flex {
          max-width: none !important;
          width: 100% !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
        @media (max-width: 900px) {
          .recipe-book-glance-flex {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            gap: 1.5rem;
          }
          .recipe-of-day-flex {
            flex-direction: row !important;
            align-items: center !important;
            justify-content: flex-start !important;
            gap: 1.2rem !important;
          }
        }
        @media (max-width: 600px) {
          .recipe-book-glance-flex {
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 1.2rem !important;
          }
          .recipe-of-day-flex {
            flex-direction: row !important;
            align-items: flex-start !important;
            justify-content: flex-start !important;
            gap: 1.2rem !important;
          }
          .recipe-of-day-flex > div {
            flex: 1 1 0%;
            min-width: 0;
          }
        }
        /* Ensure Recipe of the Day stays row on all screens */
        .recipe-of-day-flex {
          flex-direction: row !important;
          align-items: center !important;
          justify-content: flex-start !important;
          gap: 1.2rem !important;
        }
      `}</style>
    </>
  );
}
