'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQuantity } from '@/store/shopSlice';
import { FaShoppingCart, FaFire, FaPlayCircle, FaArrowLeft, FaCheck } from 'react-icons/fa';

export default function ProductClient({ product }) {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.shop);
  const [playingVideo, setPlayingVideo] = useState(false);

  const cartItem = cart.find(x => x.product === product._id);
  const qty = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      price: product.actualPrice,
      image: product.image,
      quantity: 1
    }));
  };

  const handleQuantityChange = (newQty) => {
    dispatch(updateQuantity({
      id: product._id,
      quantity: newQty,
      itemDetails: {
        product: product._id,
        name: product.name,
        price: product.actualPrice,
        image: product.image
      }
    }));
  };

  return (
    <div className="bg-surface min-h-screen flex flex-col">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 pt-32 pb-20 w-full flex-1">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-medium">
          <Link href="/" className="hover:text-accent transition">Home</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/categories/${product.category.slug}`} className="hover:text-accent transition">{product.category.name}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-white">{product.name}</span>
        </div>

        <div className="bg-[#16161a] border border-white/5 rounded-3xl p-6 lg:p-10 shadow-2xl flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          {/* Image & Video Section */}
          <div className="lg:w-1/2 flex flex-col gap-4">
            <div className="relative aspect-square bg-[#22222a] rounded-2xl flex items-center justify-center p-6 border border-white/5 overflow-hidden group">
              {product.mrp > product.actualPrice && (
                <div className="absolute top-4 left-4 bg-[#ff5500] text-white text-sm font-black px-4 py-1.5 rounded-full z-20 shadow-lg flex items-center gap-1">
                  <FaFire className="text-yellow-300" />
                  {Math.round(((product.mrp - product.actualPrice) / product.mrp) * 100)}% OFF
                </div>
              )}
              
              {!playingVideo ? (
                <>
                  <img
                    src={product.image || 'https://placehold.co/600x600/1A1A1A/FFFFFF?text=Leo'}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </>
              ) : (
                <div className="absolute inset-0 w-full h-full z-30">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${product.youtubeId}?autoplay=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <h1 className="text-3xl lg:text-5xl font-heading font-black text-white leading-tight mb-4">{product.name}</h1>
            
            <div className="flex items-end gap-4 mb-6">
              <span className="text-4xl lg:text-5xl font-black text-accent tracking-tight">₹{product.actualPrice}</span>
              {product.mrp > product.actualPrice && (
                <span className="text-xl text-gray-500 line-through font-bold mb-1">₹{product.mrp}</span>
              )}
            </div>

            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              {product.description || 'Premium quality fireworks manufactured in Sivakasi. Safe and highly entertaining for all your festive needs.'}
            </p>

            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"><FaCheck className="text-green-500 text-xs" /></div>
                100% Authentic Sivakasi Crackers
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"><FaCheck className="text-green-500 text-xs" /></div>
                Safe and Premium Quality
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"><FaCheck className="text-green-500 text-xs" /></div>
                Fast & Secure Delivery
              </div>
            </div>

            {/* Cart Actions */}
            <div className="mt-auto flex flex-col sm:flex-row items-center gap-4">
              {qty === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto btn-fire text-lg px-12 py-4 flex items-center justify-center gap-3 shadow-primary hover:shadow-primary-lg"
                >
                  <FaShoppingCart />
                  ADD TO CART
                </button>
              ) : (
                <div className="flex items-center gap-4 bg-[#22222a] p-2 rounded-2xl w-fit border border-white/5">
                  <button
                    onClick={() => handleQuantityChange(qty - 1)}
                    className="w-12 h-12 flex items-center justify-center bg-[#16161a] text-white rounded-xl hover:bg-white/10 transition-colors font-bold text-xl"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-xl font-bold text-white">{qty}</span>
                  <button
                    onClick={() => handleQuantityChange(qty + 1)}
                    className="w-12 h-12 flex items-center justify-center bg-[#16161a] text-white rounded-xl hover:bg-white/10 transition-colors font-bold text-xl"
                  >
                    +
                  </button>
                </div>
              )}
              
              {product.youtubeId && !playingVideo && (
                <button
                  onClick={() => setPlayingVideo(true)}
                  className="w-full sm:w-auto bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/30 font-bold text-lg px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg"
                >
                  <FaPlayCircle /> WATCH VIDEO
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
