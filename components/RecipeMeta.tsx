"use client";

import React from 'react';

export function RecipeMeta({
  rating,
  author,
  date,
  category,
  cuisine,
  difficulty,
  servings,
  prepTime,
  cookTime,
  totalTime,
  calories,
  dietary,
  allergens,
  cost,
  tags,
  source,
}: {
  rating?: string | number;
  author?: string;
  date?: string;
  category?: string;
  cuisine?: string;
  difficulty?: string;
  servings?: string | number;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  calories?: string | number;
  dietary?: string;
  allergens?: string;
  cost?: string;
  tags?: string[];
  source?: string;
}) {
  const hasDetails = category || cuisine || difficulty || dietary || source || cost || allergens;
  const hasTags = tags && tags.length > 0;
  const [showDetails, setShowDetails] = React.useState(false);

  // Debug log for all metadata fields (after hasDetails/hasTags are defined)
  // console.debug('[RecipeMeta] props', {
  //   rating,
  //   author,
  //   date,
  //   prepTime,
  //   cookTime,
  //   totalTime,
  //   servings,
  //   calories,
  //   category,
  //   cuisine,
  //   difficulty,
  //   dietary,
  //   tags,
  //   source,
  //   cost,
  //   allergens,
  //   hasDetails,
  //   hasTags
  // });

  return (
    <section style={{ margin: '0.2rem 0 2rem 0', background: 'none', color: 'inherit' }}>
      {/* Ratings, author, date row */}
      {(rating || author || date) && (
        <div style={{ color: 'inherit', fontSize: '0.98rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1.2em', flexWrap: 'wrap', background: 'none' }}>
          {rating && (
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
              {rating}★
            </span>
          )}
          {author && <span>By <span style={{ fontWeight: 500 }}>{author}</span></span>}
          {date && <span>{date}</span>}
        </div>
      )}
      {/* Times and servings row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '1rem', color: 'inherit', marginBottom: '0.5rem', background: 'none' }}>
        {prepTime && <div><strong>Prep:</strong> {prepTime}</div>}
        {cookTime && <div><strong>Cook:</strong> {cookTime}</div>}
        {totalTime && <div><strong>Total:</strong> {totalTime}</div>}
        {servings && <div><strong>Servings:</strong> {servings}</div>}
      </div>
      {/* Nutrition facts row */}
      {calories && (
        <div style={{ fontSize: '0.98rem', color: 'var(--heading)', marginBottom: '0.5rem', background: 'none' }}>
          <strong>Calories:</strong> {calories} per serving
        </div>
      )}
      {/* Tags row - moved above details */}
      {hasTags && (
        <div style={{ fontWeight: 600, margin: '0.7em 0 0.3em 0', fontSize: '1.02em', color: 'inherit', background: 'none' }}>Tags</div>
      )}
      {hasTags && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5em 0.5em', alignItems: 'center', marginBottom: '0.5em', background: 'none' }}>
          {tags.map((tag, i) => (
            <span key={i} style={{ background: 'none', color: 'inherit', borderRadius: '0.5em', padding: '0.15em 0.7em', fontSize: '0.95em', marginRight: '0.3em', display: 'inline-block' }}>{tag}</span>
          ))}
        </div>
      )}
      {/* Additional Details section - collapsible, no background */}
      {hasDetails && (
        <div style={{ margin: '1.2em 0 0.3em 0', background: 'none' }}>
          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--heading)',
              fontWeight: 600,
              fontSize: '1.02em',
              cursor: 'pointer',
              padding: 0,
              marginBottom: '0.3em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5em',
            }}
            aria-expanded={showDetails}
          >
            {showDetails ? 'Hide' : 'Show'} Additional Details
            <span style={{ fontSize: '0.9em' }}>{showDetails ? '▲' : '▼'}</span>
          </button>
          {showDetails && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem 2rem', alignItems: 'start', marginTop: '0.5em', background: 'none', color: 'inherit' }}>
              {category && <div><strong>Category:</strong> {category}</div>}
              {cuisine && <div><strong>Cuisine:</strong> {cuisine}</div>}
              {difficulty && <div><strong>Difficulty:</strong> {difficulty}</div>}
              {dietary && <div><strong>Dietary:</strong> {dietary}</div>}
              {source && <div><strong>Source:</strong> {source}</div>}
              {cost && <div><strong>Cost:</strong> {cost}</div>}
              {allergens && <div><strong>Allergens:</strong> {allergens}</div>}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
