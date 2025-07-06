import { source } from '@/lib/source';
import { DocsPage, DocsBody } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getMDXComponentsWithRecipeSlug } from '@/mdx-components';
import { RecipeTitle, RecipeDescription } from '@/components/RecipeTitleDescription';
import { RecipeMeta } from '@/components/RecipeMeta';
import { RecipeImageManager } from '@/components/RecipeImageManager';
import { getRecipeImages } from '@/lib/recipe-images';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  
  // Extract recipe slug from file path - use only the filename, not the category folder
  const recipeSlug = page.slugs?.length > 0 ? page.slugs[page.slugs.length - 1] : page.data.title.toLowerCase().replace(/\s+/g, '-');
  
  // Get local images for this recipe
  const localOverviewImages = getRecipeImages(recipeSlug, 'overview');
  
  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <RecipeTitle>{page.data.title}</RecipeTitle>
      
      {/* Recipe overview images - only show if local images exist */}
      <RecipeImageManager 
        type="overview"
        localImages={localOverviewImages}
        fallbackImages={[]}
        alt={page.data.title}
      />
      
      <RecipeMeta
        rating={page.data.rating}
        author={page.data.author}
        date={page.data.date}
        category={page.data.category}
        cuisine={page.data.cuisine}
        difficulty={page.data.difficulty}
        servings={page.data.servings}
        prepTime={page.data.prepTime}
        cookTime={page.data.cookTime}
        totalTime={page.data.totalTime}
        calories={page.data.calories}
        dietary={page.data.dietary}
        allergens={page.data.allergens}
        cost={page.data.cost}
        tags={page.data.tags}
        source={page.data.source}
      />
      <RecipeDescription>{page.data.description}</RecipeDescription>
      <DocsBody>
        <MDXContent
          components={getMDXComponentsWithRecipeSlug(recipeSlug, {
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
