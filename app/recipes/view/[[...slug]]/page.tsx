import { source } from '@/lib/source';
import { DocsPage, DocsBody } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getMDXComponents } from '@/mdx-components';
import { RecipeTitle, RecipeDescription } from '@/components/RecipeTitleDescription';
import { RecipeMeta } from '@/components/RecipeMeta';
import { RecipeImageCarousel } from '@/components/RecipeImageCarousel';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <RecipeTitle>{page.data.title}</RecipeTitle>
      {page.data.images && page.data.images.length > 0 ? (
        <RecipeImageCarousel images={page.data.images} alt={page.data.title} />
      ) : null}
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
          components={getMDXComponents({
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
