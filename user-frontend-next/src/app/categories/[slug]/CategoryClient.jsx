'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQuantity } from '@/store/shopSlice';
import { FaShoppingCart, FaFire, FaPlayCircle, FaYoutube } from 'react-icons/fa';

export default function CategoryClient({ category, products }) {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.shop);
  const [playingVideoId, setPlayingVideoId] = useState(null);

  return (
    <div className="bg-surface min-h-screen flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 w-full flex-1">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 font-medium">
          <Link href="/" className="hover:text-accent transition">Home</Link>
          <span>/</span>
          <span className="text-white">{category.name}</span>
        </div>

        {/* Category Header */}
        <div className="bg-[#16161a] border border-white/5 rounded-3xl p-8 mb-10 shadow-lg relative overflow-hidden flex items-center gap-6">
          {category.image && (
            <img src={category.image} alt={category.name} className="w-24 h-24 rounded-full object-cover border-2 border-accent" />
          )}
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-2">{category.name}</h1>
            {category.description && (
              <p className="text-gray-400 max-w-2xl">{category.description}</p>
            )}
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => {
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
              <div
                key={product._id}
                className="bg-[#16161a] border border-white/5 rounded-2xl hover:bg-[#1e1e24] transition-colors duration-300 p-5 flex flex-col gap-4 relative group"
              >
                {/* Image */}
                <Link href={`/products/${product.slug}`} className="relative aspect-video bg-[#22222a] rounded-xl overflow-hidden flex items-center justify-center w-full">
                  {product.mrp > product.actualPrice && (
                    <div className="absolute top-2 left-2 bg-[#ff5500] text-white text-[10px] font-bold px-2 py-1 rounded-full z-20">
                      {Math.round(((product.mrp - product.actualPrice) / product.mrp) * 100)}% OFF
                    </div>
                  )}
                  <img
                    src={product.image || 'https://placehold.co/300x200/1A1A1A/FFFFFF?text=Leo'}
                    alt={product.name}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 flex flex-col">
                  <Link href={`/products/${product.slug}`} className="hover:text-accent transition-colors">
                    <h3 className="text-lg font-bold text-white leading-tight mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-end gap-4 mt-auto mb-4">
                    <div className="flex items-end gap-2">
                      <span className="text-xl font-black text-accent tracking-tight">₹{product.actualPrice}</span>
                      {product.mrp > product.actualPrice && (
                        <span className="text-sm text-gray-500 line-through font-bold mb-0.5">₹{product.mrp}</span>
                      )}
                    </div>
                    {product.youtubeId && (
                      <button
                        onClick={(e) => { e.preventDefault(); setPlayingVideoId(product.youtubeId); }}
                        className="text-[#FF0000] hover:text-white transition-colors"
                        title="Watch Video"
                      >
                        <FaYoutube className="text-3xl" />
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  {qty === 0 ? (
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-[#22222a] hover:bg-fire-gradient hover:text-white text-gray-300 font-bold py-3 rounded-xl transition-all duration-300 border border-white/5 shadow-sm text-sm"
                    >
                      ADD TO CART
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-[#22222a] p-1.5 rounded-xl border border-white/5">
                      <button
                        onClick={() => handleQuantityChange(qty - 1)}
                        className="w-10 h-10 flex items-center justify-center bg-[#16161a] text-white rounded-lg hover:bg-white/10 transition-colors font-bold"
                      >
                        -
                      </button>
                      <span className="font-bold text-white">{qty}</span>
                      <button
                        onClick={() => handleQuantityChange(qty + 1)}
                        className="w-10 h-10 flex items-center justify-center bg-[#16161a] text-white rounded-lg hover:bg-white/10 transition-colors font-bold"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Modal */}
      {playingVideoId && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <button 
              onClick={() => setPlayingVideoId(null)}
              className="absolute -top-12 right-0 text-white hover:text-accent p-2"
            >
              Close
            </button>
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${playingVideoId}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
