"use client";

import React from 'react';

interface RecipeNotesProps {
  children: React.ReactNode;
}

export const RecipeNotes: React.FC<RecipeNotesProps> = ({ children }) => {
  // Add theme-aware styles for better bullet points
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --bullet-bg-light: #64748b;
        --bullet-bg-dark: #94a3b8;
        --bullet-shadow-light: rgba(100, 116, 139, 0.2);
        --bullet-shadow-dark: rgba(148, 163, 184, 0.2);
      }
      html.dark {
        --bullet-bg: var(--bullet-bg-dark);
        --bullet-shadow: var(--bullet-shadow-dark);
      }
      html:not(.dark) {
        --bullet-bg: var(--bullet-bg-light);
        --bullet-shadow: var(--bullet-shadow-light);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <section className="recipe-notes" style={{ margin: '2rem 0', padding: 0, borderRadius: '0.75rem', background: 'none', color: 'inherit' }}>
      <div style={{ padding: 0 }}>
        {React.Children.map(children, (child, idx) => (
          <div key={idx} style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            marginBottom: '0.75rem',
            gap: '0.75rem'
          }}>
            <span style={{
              minWidth: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--bullet-bg)',
              flexShrink: 0,
              marginTop: '8px',
              boxShadow: '0 2px 4px var(--bullet-shadow)'
            }}>
            </span>
            <div style={{ flex: 1, paddingTop: '0px', lineHeight: 1.7 }}>
              {child}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecipeNotes;
