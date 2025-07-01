import { source } from '@/lib/source';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function RecipesFilterPage({ searchParams }: { searchParams?: { tag?: string; category?: string } }) {
  const tag = searchParams?.tag;
  const category = searchParams?.category;

  let recipes = source.getPages();
  if (tag) {
    recipes = recipes.filter(r => (r.data.tags || []).includes(tag));
  }
  if (category) {
    recipes = recipes.filter(r => r.data.category === category);
  }

  if (!recipes) notFound();

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        {tag ? `Recipes tagged “${tag}”` : category ? `Recipes in “${category}”` : 'All Recipes'}
      </h1>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/recipes" style={{ display: 'inline-block', background: '#2d7a46', color: '#fff', borderRadius: '999px', padding: '0.6em 1.5em', fontWeight: 600, fontSize: '1.1rem', textDecoration: 'none', boxShadow: '0 1px 6px #0001' }}>Back to Overview</Link>
      </div>
      {recipes.length === 0 && <div>No recipes found.</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        {recipes.map(page => (
          <Link key={page.slugs?.join('-') || page.url} href={`/recipes/view/${page.slugs?.join('/') || page.url}`} style={{ textDecoration: 'none', color: 'inherit', width: 320, background: '#fff', borderRadius: '1rem', boxShadow: '0 1px 6px #0001', overflow: 'hidden', display: 'block' }}>
            <Image src={page.data.images?.[0] || '/logo.png'} alt={page.data.title} width={320} height={200} style={{ objectFit: 'cover' }} />
            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: 0 }}>{page.data.title}</h3>
              <p style={{ margin: '0.5rem 0 0', color: '#666' }}>{page.data.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
