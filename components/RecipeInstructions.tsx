"use client";

import React from 'react';

interface RecipeInstructionsProps {
  children: React.ReactNode;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

interface StepProps {
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  // Add theme-aware styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --step-number-bg-light: #f8fafc;
        --step-number-text-light: #1e293b;
        --step-number-bg-dark: #334155;
        --step-number-text-dark: #f1f5f9;
        --step-number-border-light: #cbd5e1;
        --step-number-border-dark: #64748b;
      }
      html.dark {
        --step-number-bg: var(--step-number-bg-dark);
        --step-number-text: var(--step-number-text-dark);
        --step-number-border: var(--step-number-border-dark);
      }
      html:not(.dark) {
        --step-number-bg: var(--step-number-bg-light);
        --step-number-text: var(--step-number-text-light);
        --step-number-border: var(--step-number-border-light);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h4 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '1rem 0 0.5rem 0' }}>{title}</h4>
      <div style={{ paddingLeft: '0.5em' }}>
        {React.Children.map(children, (child, idx) => {
          if (React.isValidElement(child) && child.type === Step) {
            // This is a step - render with step number
            const stepNumber = React.Children.toArray(children)
              .slice(0, idx + 1)
              .filter(c => React.isValidElement(c) && c.type === Step).length;
            
            return (
              <div key={idx} style={{ 
                display: 'flex', 
                marginBottom: '20px', 
                lineHeight: 1.6,
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <span style={{ 
                  minWidth: '28px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--step-number-bg)',
                  color: 'var(--step-number-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                  border: '2px solid var(--step-number-border)',
                  flexShrink: 0,
                  marginTop: '0px'
                }}>
                  {stepNumber}
                </span>
                <div style={{ flex: 1, paddingTop: '0px' }}>
                  {child}
                </div>
              </div>
            );
          } else {
            // This is other content (like images) - render without numbering
            return (
              <div key={idx} style={{ marginBottom: '1rem', marginLeft: '0' }}>
                {child}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

const Step: React.FC<StepProps> = ({ children }) => <>{children}</>;

const RecipeInstructions: React.FC<RecipeInstructionsProps> & {
  Section: typeof Section;
  Step: typeof Step;
} = ({ children }) => (
  <section style={{ margin: '2rem 0', padding: 0, borderRadius: '0.75rem' }}>
    {children}
  </section>
);

RecipeInstructions.Section = Section;
RecipeInstructions.Step = Step;

export { RecipeInstructions, Section, Step };
export default RecipeInstructions;
