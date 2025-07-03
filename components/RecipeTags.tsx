import React from 'react';

interface RecipeTagsProps {
  children: React.ReactNode;
}

export const RecipeTags: React.FC<RecipeTagsProps> = ({ children }) => {
  return (
    <section className="recipe-tags" style={{ margin: '2rem 0', padding: 0, borderRadius: '0.75rem', background: 'none', color: 'inherit' }}>
      <ul style={{ listStyle: 'disc inside', paddingLeft: '1.5em', margin: 0 }}>
        {React.Children.map(children, (child, idx) => (
          <li key={idx} style={{ marginBottom: '0.5rem', lineHeight: 1.7, paddingLeft: 0 }}>{child}</li>
        ))}
      </ul>
    </section>
  );
};

export default RecipeTags;
