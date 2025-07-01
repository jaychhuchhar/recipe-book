import * as React from 'react';
import Image from 'next/image';
import OverviewDynamic from '@/components/OverviewDynamic';
import { source } from '@/lib/source';

function serializeRecipeData(data: unknown) {
  const { /* remove */ ...rest } = data as Record<string, unknown>;
  // Remove any functions or modules from nested fields if needed
  return JSON.parse(JSON.stringify(rest));
}

export default function RecipesIndexPage() {
  // Fetch recipes on the server and serialize for client
  const recipes = source.getPages().map(page => ({
    slugs: page.slugs,
    url: page.url,
    data: serializeRecipeData(page.data),
  }));
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', background: '#f8fafc', padding: '2rem 1rem', borderRadius: '1.5rem', boxShadow: '0 2px 8px #0001' }}>
        <Image src="/logo.png" alt="Recipe Book Logo" width={96} height={96} style={{ borderRadius: '1rem', background: '#fff' }} />
        <div>
          <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700 }}>Recipe Book</h1>
          <p style={{ margin: 0, fontSize: '1.25rem', color: '#555' }}>Discover, cook, and enjoy curated recipes with rich details and beautiful images.</p>
        </div>
      </div>
      <OverviewDynamic recipes={recipes.map(r => r.data)} />
    </div>
  );
}
