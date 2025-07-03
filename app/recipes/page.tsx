import * as React from 'react';
import Image from 'next/image';
import OverviewDynamic from '@/components/OverviewDynamic';
import HeroSection from '@/components/HeroSection';
import { source } from '@/lib/source';

function serializeRecipeData(data: unknown) {
  // Ensure all frontmatter fields are included, especially images
  return JSON.parse(JSON.stringify(data));
}

export default function RecipesIndexPage() {
  // Fetch recipes on the server and serialize for client
  const recipes = source.getPages().map(page => ({
    slugs: page.slugs,
    url: page.url,
    // Pass all frontmatter fields, including images
    ...serializeRecipeData(page.data),
  }));

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      <HeroSection />
      <OverviewDynamic recipes={recipes} />
    </div>
  );
}
