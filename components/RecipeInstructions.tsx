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

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div style={{ marginBottom: '1.5rem' }}>
    <h4 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '1rem 0 0.5rem 0' }}>{title}</h4>
    <ol style={{ paddingLeft: '1.5em', margin: 0 }}>
      {React.Children.map(children, (child, idx) => (
        <li key={idx} style={{ marginBottom: '0.75rem', lineHeight: 1.7 }}>{child}</li>
      ))}
    </ol>
  </div>
);

const Step: React.FC<StepProps> = ({ children }) => <>{children}</>;

export const RecipeInstructions: React.FC<RecipeInstructionsProps> & {
  Section: typeof Section;
  Step: typeof Step;
} = ({ children }) => (
  <section style={{ margin: '2rem 0', padding: 0, borderRadius: '0.75rem' }}>
    {children}
  </section>
);

RecipeInstructions.Section = Section;
RecipeInstructions.Step = Step;

export default RecipeInstructions;
