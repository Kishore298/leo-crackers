import CategoryClient from './CategoryClient';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/categories/${slug}`, { cache: 'no-store' });
    if (!res.ok) return { title: 'Category Not Found | Leo Crackers' };
    
    const data = await res.json();
    
    if (data.message === 'Category not found') {
      return { title: 'Category Not Found | Leo Crackers' };
    }

    const { category } = data;

    return {
      title: `Buy ${category.name} Crackers Online | Leo Crackers`,
      description: category.description || `Explore our wide range of ${category.name} fireworks from Sivakasi. Buy premium quality crackers online at Leo Crackers.`,
      openGraph: {
        title: `${category.name} | Leo Crackers`,
        description: category.description || `Explore our wide range of ${category.name} fireworks from Sivakasi.`,
        images: [category.image || '/leo-crackers-logo.png'],
      }
    };
  } catch (error) {
    return { title: 'Category | Leo Crackers' };
  }
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/categories/${slug}`, { cache: 'no-store' });
    
    if (!res.ok) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface text-white">
          <h1 className="text-3xl font-bold text-red-500">Category Not Found</h1>
        </div>
      );
    }

    const data = await res.json();

    if (data.message === 'Category not found') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface text-white">
          <h1 className="text-3xl font-bold text-red-500">Category Not Found</h1>
        </div>
      );
    }

    return <CategoryClient category={data.category} products={data.products} />;
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-white">
        <h1 className="text-3xl font-bold text-red-500">Error loading category</h1>
      </div>
    );
  }
}
