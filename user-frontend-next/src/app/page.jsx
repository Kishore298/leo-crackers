'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeData, updateQuantity } from '@/store/shopSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFire, FaChevronDown, FaChevronUp, FaFilePdf, FaYoutube, FaTimes, FaPlayCircle } from 'react-icons/fa';

const Home = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { banners, categories, cart, isLoading } = useSelector((state) => state.shop);
  const [searchTerm, setSearchTerm] = useState('');

  const [playingVideoId, setPlayingVideoId] = useState(null);
  const scrollRestoredRef = useRef(false);

  // Save scroll position safely
  useEffect(() => {
    const interval = setInterval(() => {
      // Only save if we are actually at a non-zero scroll OR if we just loaded
      sessionStorage.setItem('homeScrollY', window.scrollY.toString());
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Restore scroll position after data loads
  useEffect(() => {
    if (!scrollRestoredRef.current && !isLoading && categories.length > 0) {
      const savedY = sessionStorage.getItem('homeScrollY');
      if (savedY) {
        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedY, 10), behavior: 'instant' });
        }, 150); // increased timeout to allow accordion to render
      }
      scrollRestoredRef.current = true;
    }
  }, [isLoading, categories]);

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    if (categories.length > 0) {
      const saved = sessionStorage.getItem('expandedCategories');
      if (saved) {
        setExpandedCategories(JSON.parse(saved));
      } else {
        const initial = {};
        categories.forEach(c => initial[c._id] = true);
        setExpandedCategories(initial);
      }
    }
  }, [categories]);

  const toggleCategory = (id) => {
    setExpandedCategories(prev => {
      const isCurrentlyExpanded = prev[id] !== false; // Defaults to true if undefined
      const newState = { ...prev, [id]: !isCurrentlyExpanded };
      sessionStorage.setItem('expandedCategories', JSON.stringify(newState));
      return newState;
    });
  };

  const handleQuantityChange = (product, newQuantity) => {
    if (newQuantity < 0) return;

    const cartItem = cart.find(x => x.product === product._id);
    const oldQuantity = cartItem ? cartItem.quantity : 0;

    dispatch(updateQuantity({
      id: product._id,
      quantity: newQuantity,
      itemDetails: {
        product: product._id,
        name: product.name,
        price: product.actualPrice,
        mrp: product.mrp,
        image: product.image
      }
    }));

    if (oldQuantity === 0 && newQuantity === 1) {
      toast.success(`${product.name} added to cart!`, {
        autoClose: 1500,
        style: { background: '#fff8f5', color: '#D90429', fontWeight: 700 }
      });
    } else if (newQuantity === 0 && oldQuantity > 0) {
      toast.info(`${product.name} removed from cart`, {
        autoClose: 1500,
      });
    }
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,204,51,0.15)_0%,rgba(5,5,5,1)_70%)]" />
        <div className="relative z-10 flex flex-col items-center">
          <img
            src="/assets/leo-logo.png"
            alt="Loading..."
            className="w-24 h-24 rounded-full mb-6 filter drop-shadow-[0_0_20px_rgba(255,204,51,0.6)] animate-pulse-glow bg-white p-2 object-contain"
          />
          <p className="text-white font-heading font-bold text-2xl tracking-widest animate-pulse">
            LOADING<span className="text-primary">...</span>
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col font-sans bg-transparent">
      <Navbar />

      {/* Hero Section */}
      <div className="w-full pt-20 md:pt-32 pb-4 md:pb-8 relative flex flex-col items-center justify-center text-center min-h-[70vh]">
        {/* Deity Image */}
        <div className="mb-3 md:mb-6 animate-fade-zoom relative z-10">
          <img
            src="/assets/hero-deity.jpeg"
            alt="Deity"
            className="w-28 h-28 md:w-40 md:h-40 object-contain filter drop-shadow-[0_0_20px_rgba(255,204,51,0.5)] mx-auto"
          />
        </div>

        {/* Text Content */}
        <div className="relative z-10 animate-fade-in-up flex flex-col items-center">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-3xl md:text-5xl font-heading font-black text-white tracking-tight">
              Welcome to <span className="fire-gradient-text font-brand tracking-[1.5px]">Leo Crackers</span>
            </h1>
          </div>
          <p className="text-text-secondary text-md md:text-xl font-medium mt-4 mb-8 max-w-2xl tracking-wide">
            Premium Quality Fireworks Since 2009. Light up your celebrations with joy and prosperity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={() => window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' })}
              className="btn-fire text-lg px-8 py-3"
            >
              Explore Collection
            </button>
            <button
              onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/public/price-list`, '_blank')}
              className="btn-outline-fire text-lg px-8 py-3 flex items-center gap-2"
            >
              <FaFilePdf /> Download Price List
            </button>
          </div>
        </div>
      </div>

      {/* Categories & Products */}
      <div className="max-w-[100%] lg:max-w-7xl mx-auto px-2 md:px-4 py-10 flex-1 w-full">
        {/* Actions Row */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:max-w-lg">
            <input
              type="text"
              placeholder="Search for crackers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-fire bg-surface/80 rounded-full py-3 text-white pl-5 pr-12 border-border focus:border-primary backdrop-blur-sm"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary">
              <FaFire className="text-sm" />
            </div>
          </div>
          <button
            onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/public/price-list`, '_blank')}
            className="btn-outline-fire flex items-center gap-2 rounded-full"
          >
            <FaFilePdf /> Download Price List
          </button>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-20 glass-panel">
            <FaFire className="text-5xl text-primary/30 mx-auto mb-4" />
            <p className="text-text-secondary text-xl font-semibold">No products available right now.</p>
          </div>
        ) : categories.map(category => {
          const filteredProducts = category.products?.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
          );

          if (!filteredProducts || filteredProducts.length === 0) return null;

          const isExpanded = expandedCategories[category._id] !== false; // defaults to true

          return (
            <div key={category._id} className="mb-6 glass-panel overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {/* Accordion Header */}
              <div className="w-full flex items-center justify-between py-4 md:py-6 px-2 md:px-8 bg-transparent">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1.5 bg-accent rounded-full" />
                  <Link href={`/categories/${category.slug}`} className="hover:text-accent transition-colors">
                    <h2 className="text-lg md:text-xl font-bold text-white tracking-wider">
                      {category.name}
                    </h2>
                  </Link>
                </div>
                <button
                  onClick={() => toggleCategory(category._id)}
                  className="text-accent text-sm p-2 hover:bg-white/5 rounded-full transition-colors flex items-center gap-2"
                >
                  <span className="text-gray-400 hidden sm:inline">{isExpanded ? 'Hide' : 'Show All'}</span>
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>

              {/* Accordion Content */}
              <div
                className={`transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100 py-2' : 'max-h-0 opacity-0 overflow-hidden'}`}
              >
                <div className="flex flex-col gap-3">
                  {filteredProducts.map(product => {
                    const cartItem = cart.find(x => x.product === product._id);
                    const qty = cartItem ? cartItem.quantity : 0;

                    return (
                      <div
                        key={product._id}
                        className="bg-[#16161a] border border-white/5 rounded-xl hover:bg-[#1e1e24] transition-colors duration-300 p-3 md:p-4 flex flex-row items-center gap-4 relative"
                      >
                        {/* Image */}
                        <Link href={`/products/${product.slug}`} className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 bg-[#22222a] rounded-lg overflow-visible flex items-center justify-center p-1 group">
                          {product.mrp > product.actualPrice && (
                            <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 bg-[#ff5500] text-white text-[8px] md:text-[9px] font-bold px-2.5 py-0.5 rounded-full z-20 whitespace-nowrap shadow-lg">
                              {Math.round(((product.mrp - product.actualPrice) / product.mrp) * 100)}% OFF
                            </div>
                          )}
                          <img
                            src={product.image || 'https://placehold.co/300x200/1A1A1A/FFFFFF?text=Leo'}
                            alt={product.name}
                            className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform"
                          />
                        </Link>

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-center min-w-0 py-1">
                          <Link href={`/products/${product.slug}`} className="hover:text-accent transition-colors w-fit">
                            <h3 className="text-sm md:text-base font-bold text-white leading-snug text-wrap">
                              {product.name}
                            </h3>
                          </Link>
                        </div>

                        {/* Pricing & Actions */}
                        <div className="flex items-center gap-2 md:gap-8 lg:gap-12 shrink-0">
                          {/* Pricing */}
                          <div className="flex flex-col items-end justify-center">
                            {product.mrp > product.actualPrice && (
                              <span className="text-[9px] md:text-[10px] font-medium line-through text-text-secondary mb-0.5">₹{product.mrp}</span>
                            )}
                            <span className="text-sm md:text-lg font-black text-accent">₹{product.actualPrice}</span>
                          </div>

                          {/* YouTube Icon */}
                          {product.youtubeId && (
                            <button
                              onClick={() => setPlayingVideoId(product.youtubeId)}
                              className="text-[#FF0000] hover:text-white transition-colors flex-shrink-0"
                              title="Watch Video"
                            >
                              <FaYoutube className="text-3xl md:text-5xl" />
                            </button>
                          )}

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between border border-white/5 rounded-lg p-0.5 bg-[#22222a] w-20 md:w-24 shrink-0 md:ml-10 lg:ml-16">
                            <button
                              onClick={() => handleQuantityChange(product, qty - 1)}
                              className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded text-text-secondary hover:text-white hover:bg-white/5 transition-colors font-medium text-lg"
                              disabled={qty === 0}
                            >
                              -
                            </button>
                            <span className="font-medium text-xs md:text-sm text-white w-6 text-center select-none">
                              {qty}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(product, qty + 1)}
                              className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded text-text-secondary hover:text-white hover:bg-white/5 transition-colors font-medium text-lg"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Player Modal */}
      {playingVideoId && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-zoom">
          <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-[0_0_40px_rgba(255,102,0,0.3)] border border-white/10">
            <button
              onClick={() => setPlayingVideoId(null)}
              className="absolute -top-12 right-0 md:top-4 md:right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
            <div className="relative pt-[56.25%]">
              <iframe
                src={`https://www.youtube.com/embed/${playingVideoId}?autoplay=1&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Home;