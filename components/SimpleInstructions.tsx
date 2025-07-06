"use client";

import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

interface StepProps {
  children: React.ReactNode;
  stepNumber?: number;
}

// Add theme-aware styles once globally
const addGlobalStyles = (() => {
  let added = false;
  return () => {
    if (added) return;
    added = true;
    
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --step-number-light: #1e293b;
        --step-number-dark: #f1f5f9;
        --step-number-bg-light: #f8fafc;
        --step-number-bg-dark: #334155;
        --step-number-border-light: #cbd5e1;
        --step-number-border-dark: #64748b;
      }
      html.dark {
        --step-number: var(--step-number-dark);
        --step-number-bg: var(--step-number-bg-dark);
        --step-number-border: var(--step-number-border-dark);
      }
      html:not(.dark) {
        --step-number: var(--step-number-light);
        --step-number-bg: var(--step-number-bg-light);
        --step-number-border: var(--step-number-border-light);
      }
    `;
    document.head.appendChild(style);
  };
})();

export const InstructionsSection: React.FC<SectionProps> = ({ title, children }) => {
  React.useEffect(() => {
    addGlobalStyles();
  }, []);

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h4 style={{ 
        fontSize: '1.25rem', 
        fontWeight: '600', 
        margin: '1.5rem 0 1rem 0',
        color: 'var(--fg-default)'
      }}>
        {title}
      </h4>
      <div style={{ 
        paddingLeft: '0.5rem',
        position: 'relative'
      }}>
        {children}
      </div>
    </div>
  );
};

export const InstructionStep: React.FC<StepProps> = ({ children, stepNumber }) => {
  return (
    <div style={{ 
      display: 'flex', 
      marginBottom: '20px', 
      lineHeight: 1.5,
      alignItems: 'center',
      gap: '12px'
    }}>
      {stepNumber && (
        <div style={{
          minWidth: '28px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: 'var(--step-number-bg)',
          color: 'var(--step-number)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: '700',
          flexShrink: 0,
          marginTop: '0px',
          border: '2px solid var(--step-number-border)'
        }}>
          {stepNumber}
        </div>
      )}
      <div style={{ 
        flex: 1,
        paddingTop: '0px',
        display: 'flex',
        alignItems: 'center',
        minHeight: '28px'
      }}>
        {children}
      </div>
    </div>
  );
};

export const InstructionsContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <section style={{ margin: '2rem 0', padding: 0, borderRadius: '0.75rem' }}>
    {children}
  </section>
);
