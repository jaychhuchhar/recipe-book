import React from 'react';

export function RecipeTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-4xl font-bold mb-2 text-primary">{children}</h1>
  );
}

export function RecipeDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-lg text-muted-foreground mb-4">{children}</p>
  );
}
