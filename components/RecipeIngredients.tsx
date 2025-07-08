"use client";

import React, { useState } from 'react';

interface RecipeIngredientsProps {
  children?: React.ReactNode;
  categories?: Array<{
    title: string;
    ingredients: string[];
  }>;
}

interface IngredientCategoryProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const IngredientCategory: React.FC<IngredientCategoryProps> = ({ 
  title, 
  children, 
  defaultExpanded = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div 
      className="ingredient-category-box" 
      style={{ 
        marginBottom: '1.5rem', 
        border: '1px solid var(--border)', 
        borderRadius: '0.5rem', 
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      <button
        ref={buttonRef}
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          background: 'var(--muted)',
          border: 'none',
          borderBottom: isExpanded ? '1px solid var(--border)' : 'none',
          textAlign: 'left',
          fontSize: '1rem',
          fontWeight: '600',
          color: 'var(--foreground)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--accent-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--muted)';
        }}
        onTouchStart={(e) => {
          e.currentTarget.style.background = 'var(--accent-hover)';
        }}
        onTouchEnd={() => {
          // Small delay to prevent flicker, then reset with null check
          setTimeout(() => {
            if (buttonRef.current) {
              buttonRef.current.style.background = 'var(--muted)';
            }
          }, 100);
        }}
        onBlur={(e) => {
          e.currentTarget.style.background = 'var(--muted)';
        }}
      >
        <span>{title}</span>
        <span style={{ 
          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
          fontSize: '0.8rem'
        }}>
          ▶
        </span>
      </button>
      {isExpanded && (
        <div style={{ padding: '1rem' }}>
          <div className="recipe-ingredients-grid">
            {React.Children.map(children, (child, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '0.75rem',
                marginBottom: '0.75rem'
              }}>
                <span style={{
                  minWidth: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--bullet-bg)',
                  flexShrink: 0,
                  marginTop: '8px',
                  boxShadow: '0 2px 4px var(--bullet-shadow)'
                }} />
                <div style={{ 
                  flex: 1, 
                  paddingTop: '0px', 
                  lineHeight: 1.7,
                  fontSize: '0.95rem',
                  color: 'var(--foreground)'
                }}>
                  {child}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const RecipeIngredients: React.FC<RecipeIngredientsProps> = ({ children, categories }) => {
  // Add theme-aware styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --primary: #3b82f6;
        --muted: #f8fafc;
        --accent: #f1f5f9;
        --accent-hover: #e2e8f0;
        --border: #e2e8f0;
        --foreground: #1e293b;
        --bullet-bg-light: #64748b;
        --bullet-bg-dark: #94a3b8;
        --bullet-shadow-light: rgba(100, 116, 139, 0.2);
        --bullet-shadow-dark: rgba(148, 163, 184, 0.2);
      }
      html.dark {
        --primary: #60a5fa;
        --muted: #1e293b;
        --accent: #334155;
        --accent-hover: #475569;
        --border: #475569;
        --foreground: #f1f5f9;
        --bullet-bg: var(--bullet-bg-dark);
        --bullet-shadow: var(--bullet-shadow-dark);
      }
      html:not(.dark) {
        --bullet-bg: var(--bullet-bg-light);
        --bullet-shadow: var(--bullet-shadow-light);
      }
      
      .recipe-ingredients-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 0.75rem;
      }
      
      .recipe-ingredients-grid.category-boxes {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }
      
      @media (max-width: 768px) {
        .recipe-ingredients-grid {
          grid-template-columns: 1fr;
          gap: 0.5rem;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // If categories prop is provided, use that instead of parsing children
  if (categories && categories.length > 0) {
    return (
      <div className="recipe-ingredients recipe-ingredients-container">
        {categories.map((category, index) => (
          <IngredientCategory key={index} title={category.title}>
            {category.ingredients.map((ingredient, idx) => (
              <span key={idx}>{ingredient}</span>
            ))}
          </IngredientCategory>
        ))}
      </div>
    );
  }

  // Check if children contain IngredientCategory components
  const hasCategories = React.Children.toArray(children).some(
    child => React.isValidElement(child) && child.type === IngredientCategory
  );

  if (hasCategories) {
    // Render categorized ingredients in single column for boxes, 2-column inside
    return (
      <div className="recipe-ingredients recipe-ingredients-container">
        {children}
      </div>
    );
  }

  // Fallback to clean layout for non-categorized ingredients (like RecipeNotes)
  return (
    <div className="recipe-ingredients recipe-ingredients-container" style={{ 
      margin: '2rem 0', 
      padding: 0, 
      borderRadius: '0.75rem', 
      background: 'none', 
      color: 'inherit' 
    }}>
      <div style={{ padding: 0 }}>
        <div className="recipe-ingredients-grid">
          {React.Children.map(children, (child, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '0.75rem',
              padding: '0.5rem 0'
            }}>
              <span style={{
                minWidth: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--bullet-bg)',
                flexShrink: 0,
                marginTop: '8px',
                boxShadow: '0 2px 4px var(--bullet-shadow)'
              }} />
              <div style={{ 
                flex: 1, 
                paddingTop: '0px', 
                lineHeight: 1.7,
                fontSize: '0.95rem',
                fontWeight: '400',
                color: 'var(--foreground)'
              }}>
                {child}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeIngredients;
