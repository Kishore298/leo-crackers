import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeData, addToCart } from '../features/shop/shopSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFire, FaShoppingCart } from 'react-icons/fa';

const Home = () => {
  const dispatch = useDispatch();
  const { banners, categories, isLoading } = useSelector((state) => state.shop);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      price: product.actualPrice,
      quantity: 1,
      image: product.image,
    }));
    toast.success(`${product.name} added to cart!`, {
      autoClose: 1500,
      style: { background: '#fff8f5', color: '#8b0000', fontWeight: 700 }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <FaFire className="text-6xl text-primary animate-bounce-subtle mb-4" />
        <p className="text-primary-dark font-heading font-bold text-2xl animate-pulse">Loading crackers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      {/* Hero Banner */}
      <div className="w-full bg-surface-2 py-6 border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          {banners.length > 0 ? (
            <div className="rounded-2xl overflow-hidden shadow-primary-lg border border-border">
              <img
                src={banners[0].image}
                alt={banners[0].title}
                className="w-full h-72 object-cover"
              />
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden shadow-primary-lg bg-fire-gradient text-white h-72 flex flex-col items-center justify-center text-center px-4">
              <FaFire className="text-6xl mb-4 animate-bounce-subtle opacity-80" />
              <h2 className="text-4xl md:text-5xl font-heading font-black animate-fade-in-up">
                Mega Diwali Sale!
              </h2>
              <p className="text-white/70 mt-2 text-lg">The biggest cracker sale of the season</p>
            </div>
          )}
        </div>
      </div>

      {/* Categories & Products */}
      <div className="max-w-7xl mx-auto px-4 py-10 flex-1">
        {/* Search Bar */}
        <div className="mb-10 flex justify-center">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search for crackers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-5 pr-12 py-4 rounded-full border-2 border-primary/20 focus:border-primary focus:outline-none shadow-sm focus:shadow-primary transition-all text-gray-700 bg-white"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full">
              <FaFire className="text-sm" />
            </div>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-20">
            <FaFire className="text-5xl text-primary/30 mx-auto mb-4" />
            <p className="text-gray-400 text-xl font-semibold">No products available right now.</p>
          </div>
        ) : categories.map(category => {
          // Filter products based on search term
          const filteredProducts = category.products?.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
          );

          if (!filteredProducts || filteredProducts.length === 0) return null;

          return (
            <div key={category._id} className="mb-16 animate-fade-in-up">
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-1.5 bg-fire-gradient rounded-full" />
                <h2 className="text-3xl font-heading font-black text-primary-dark uppercase tracking-wide">
                  {category.name}
                </h2>
                <div className="flex-1 h-px bg-border ml-2 hidden md:block" />
                {category.description && (
                  <p className="text-gray-400 text-sm hidden md:block">{category.description}</p>
                )}
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl shadow-primary hover:shadow-primary-lg transition-all duration-300 border border-border flex flex-col group overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden bg-surface-2 h-48 flex items-center justify-center">
                      <img
                        src={product.image || 'https://placehold.co/300x200/FFF0E8/8b0000?text=🎆'}
                        alt={product.name}
                        className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300 p-2"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-fire-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    </div>

                    {/* Info */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-base font-bold text-primary-dark mb-1 font-sans leading-snug">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between gap-2">
                        <span className="text-2xl font-black text-primary-dark">₹{product.actualPrice}</span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex items-center gap-1.5 bg-white border-2 border-primary text-primary font-bold py-2 px-3 rounded-xl hover:bg-fire-gradient hover:text-white hover:border-transparent transition-all duration-200 shadow-sm text-sm"
                        >
                          <FaShoppingCart className="text-xs" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Footer />
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Home;