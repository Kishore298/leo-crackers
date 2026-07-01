import ProductClient from './ProductClient';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/products/${slug}`, { cache: 'no-store' });
    if (!res.ok) return { title: 'Product Not Found | Leo Crackers' };
    
    const product = await res.json();
    
    if (product.message === 'Product not found') {
      return { title: 'Product Not Found | Leo Crackers' };
    }

    return {
      title: `${product.name} - Buy Online | Leo Crackers`,
      description: `Buy ${product.name} at the best price of ₹${product.actualPrice}. Premium fireworks from Sivakasi.`,
      openGraph: {
        title: `${product.name} | Leo Crackers`,
        description: `Buy ${product.name} at the best price of ₹${product.actualPrice}.`,
        images: [product.image || '/leo-crackers-logo.png'],
      }
    };
  } catch (error) {
    return { title: 'Product | Leo Crackers' };
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/products/${slug}`, { cache: 'no-store' });
    
    if (!res.ok) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface text-white">
          <h1 className="text-3xl font-bold text-red-500">Product Not Found</h1>
        </div>
      );
    }

    const product = await res.json();

    if (product.message === 'Product not found') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface text-white">
          <h1 className="text-3xl font-bold text-red-500">Product Not Found</h1>
        </div>
      );
    }

    return <ProductClient product={product} />;
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-white">
        <h1 className="text-3xl font-bold text-red-500">Error loading product</h1>
      </div>
    );
  }
}
