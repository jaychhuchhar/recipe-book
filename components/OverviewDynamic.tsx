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
function getSlugFromRecipe(recipe: Recipe & { _path?: string }): string {
  // If _path is provided, use it (without extension), else fallback to slugify title
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
    loop: false,
  });

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
      {/* Recipe of the Day */}
      {recipeOfTheDay && (
        <div
          style={{
            margin: '2rem 0',
            background: '#fffbe6',
            borderRadius: '1rem',
            boxShadow: '0 1px 6px #0001',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'nowrap',
          }}
          className="recipe-of-day-flex"
        >
          <Image
            src={recipeOfTheDay.images?.[0] || '/logo.png'}
            alt={recipeOfTheDay.title}
            width={120}
            height={90}
            style={{
              objectFit: 'cover',
              borderRadius: '0.75rem',
              width: 120,
              height: 90,
              display: 'block',
              flexShrink: 0,
            }}
          />
          <div style={{ minWidth: 200 }}>
            <div style={{ fontWeight: 700, color: '#b8860b', marginBottom: 4 }}>Recipe of the Day</div>
            <Link href={`/recipes/view/${getSlugFromRecipe(recipeOfTheDay)}`} style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2d7a46', textDecoration: 'none' }}>{recipeOfTheDay.title}</Link>
            <div style={{ color: '#555', marginTop: 4 }}>{recipeOfTheDay.description}</div>
          </div>
        </div>
      )}

      <h2 style={{ marginTop: '2.5rem', fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Featured Recipes</h2>
      {hasMounted ? (
        <div style={{ position: 'relative', width: '100%', margin: '0 auto 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button
            onClick={() => instanceRef.current?.prev()}
            aria-label="Previous"
            style={{ zIndex: 2, background: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, boxShadow: '0 1px 6px #0001', cursor: 'pointer', marginRight: 16 }}
          >&lt;</button>
          <div ref={sliderRef} className="keen-slider" style={{ width: '100%', borderRadius: '1rem', height: 340, overflow: 'hidden', flex: 1 }}>
            {featured.map((page) => (
              <div className="keen-slider__slide" key={page.title} style={{ height: 340, display: 'flex', alignItems: 'stretch' }}>
                <Link
                  href={`/recipes/view/${getSlugFromRecipe(page)}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    width: '100%',
                    minWidth: 220,
                    maxWidth: 340,
                    height: 340,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '1rem',
                    background: '#fff',
                    border: '1.5px solid #e2e8f0',
                    boxShadow: '0 2px 12px #0002',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.boxShadow = '0 4px 18px #0003')}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.boxShadow = '0 2px 12px #0002')}
                >
                  <Image src={page.images?.[0] || '/logo.png'} alt={page.title} width={320} height={200} style={{ objectFit: 'cover', width: '100%', height: 200, flexShrink: 0 }} />
                  <div style={{ padding: '1.25rem', minHeight: 120, boxSizing: 'border-box', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{page.title}</h3>
                    <p style={{ margin: '0.5rem 0 0', color: '#666', flex: 1 }}>{page.description}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <button
            onClick={() => instanceRef.current?.next()}
            aria-label="Next"
            style={{ zIndex: 2, background: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, boxShadow: '0 1px 6px #0001', cursor: 'pointer', marginLeft: 16 }}
          >&gt;</button>
        </div>
      ) : (
        <div style={{ width: '100%', margin: '0 auto 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 340 }}>
          {featured.slice(0, 1).map((page) => (
            <Link
              key={page.title}
              href={`/recipes/view/${getSlugFromRecipe(page)}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                width: '100%',
                minWidth: 220,
                maxWidth: 340,
                height: 340,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '1rem',
                background: '#fff',
                border: '1.5px solid #e2e8f0',
                boxShadow: '0 2px 12px #0002',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
            >
              <Image src={page.images?.[0] || '/logo.png'} alt={page.title} width={320} height={200} style={{ objectFit: 'cover', width: '100%', height: 200, flexShrink: 0 }} />
              <div style={{ padding: '1.25rem', minHeight: 120, boxSizing: 'border-box', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{page.title}</h3>
                <p style={{ margin: '0.5rem 0 0', color: '#666', flex: 1 }}>{page.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>App Features</h2>
      <ul style={{ fontSize: '1.1rem', marginBottom: '2.5rem', paddingLeft: '1.5rem', lineHeight: 1.7 }}>
        <li>Modern, grouped recipe metadata and beautiful visuals</li>
        <li>Image carousel for recipes with multiple images</li>
        <li>Consistent metadata: rating, author, time, servings, calories, dietary, and more</li>
        <li>Modern, responsive UI</li>
      </ul>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Recipe Book at a Glance</h2>
      <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 1px 6px #0001', padding: '1.5rem 2rem', minWidth: 200, textAlign: 'center' }}>
          <strong style={{ fontSize: '2rem', color: '#2d7a46' }}>{recipes.length}</strong>
          <div style={{ color: '#555', marginTop: '0.5rem' }}>Total Recipes</div>
        </div>
        <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 1px 6px #0001', padding: '1.5rem 2rem', minWidth: 200, textAlign: 'center' }}>
          <strong style={{ fontSize: '2rem', color: '#2d7a46' }}>{Array.from(new Set(recipes.map(r => r.category).filter(Boolean))).length}</strong>
          <div style={{ color: '#555', marginTop: '0.5rem' }}>Categories</div>
        </div>
        <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 1px 6px #0001', padding: '1.5rem 2rem', minWidth: 200, textAlign: 'center' }}>
          <strong style={{ fontSize: '2rem', color: '#2d7a46' }}>{Array.from(new Set(recipes.flatMap(r => r.tags || []))).length}</strong>
          <div style={{ color: '#555', marginTop: '0.5rem' }}>Tags</div>
        </div>
      </div>
      <blockquote>Start exploring and enjoy your cooking journey!</blockquote>

      {/* Responsive fix for Recipe of the Day flex layout */}
      <style jsx global>{`
        @media (max-width: 600px) {
          .recipe-of-day-flex {
            flex-wrap: wrap !important;
            flex-direction: column !important;
            align-items: stretch !important;
          }
        }
      `}</style>
    </>
  );
}
