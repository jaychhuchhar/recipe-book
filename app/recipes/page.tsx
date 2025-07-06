import * as React from 'react';
import HeroSection from '@/components/HeroSection';
import OverviewDynamic from '@/components/OverviewDynamic';
import { source } from '@/lib/source';
import { getRecipeImages } from '@/lib/recipe-images';

function serializeRecipeData(data: unknown) {
  // Ensure all frontmatter fields are included, especially images
  return JSON.parse(JSON.stringify(data));
}

export default function RecipesIndexPage() {
  // Fetch recipes on the server and serialize for client
  const recipes = source.getPages().map(page => {
    // Extract recipe slug (same logic as in recipe view page)
    const recipeSlug = page.slugs?.length > 0 ? page.slugs[page.slugs.length - 1] : page.data.title.toLowerCase().replace(/\s+/g, '-');
    
    // Get local images on server-side
    const localOverviewImages = getRecipeImages(recipeSlug, 'overview');
    const previewImage = localOverviewImages.length > 0 ? localOverviewImages[0] : '/logo.png';
    
    return {
      slugs: page.slugs,
      url: page.url,
      previewImage, // Add the preview image
      // Pass all frontmatter fields
      ...serializeRecipeData(page.data),
    };
  });

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      <HeroSection />
      <OverviewDynamic recipes={recipes} />
    </div>
  );
}
