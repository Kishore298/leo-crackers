'use client';

import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { dancingScript } from '@/app/fonts';

const getCloudinaryUrl = (url, width) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  // Cloudinary URL format usually: https://res.cloudinary.com/cloudname/image/upload/v12345/filename.jpg
  return url.replace('/upload/', `/upload/c_scale,w_${width}/q_auto,f_auto/`);
};

const BannerCarousel = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // 5 seconds autoplay
    return () => clearInterval(interval);
  }, [banners]);

  if (!banners || banners.length === 0) {
    // Fallback if no banners are available
    return (
      <div className="w-full pt-20 md:pt-32 pb-4 md:pb-8 relative flex flex-col items-center justify-center text-center min-h-[50vh] md:min-h-[70vh]">
        <div className="relative z-10 animate-fade-in-up flex flex-col items-center">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-3xl md:text-5xl font-heading font-medium text-text tracking-tight">
              Welcome to <span className="fire-gradient-text font-brand font-bold tracking-[1.5px]">Leo Crackers</span>
            </h1>
          </div>
          <p className="text-text-secondary text-md md:text-xl font-medium mt-4 max-w-2xl tracking-wide">
            Premium Quality Fireworks Since 2009. Light up your celebrations with joy and prosperity.
          </p>
        </div>
      </div>
    );
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-glass border border-border/20 bg-surface-2 flex items-center justify-center">
      {banners.map((banner, index) => (
        <div
          key={banner._id || index}
          className={`w-full transition-opacity duration-1000 ease-in-out flex items-center justify-center ${
            index === currentIndex ? 'relative opacity-100 z-10' : 'absolute inset-0 opacity-0 z-0'
          } ${!banner.image ? 'min-h-[200px] md:min-h-[300px]' : ''}`}
        >
          {/* Background Image with Responsive Resizing */}
          {banner.image && (
            <picture className="w-full h-auto block">
              <source media="(max-width: 640px)" srcSet={getCloudinaryUrl(banner.image, 640)} />
              <source media="(max-width: 1024px)" srcSet={getCloudinaryUrl(banner.image, 1024)} />
              <img
                src={getCloudinaryUrl(banner.image, 1920)}
                alt={banner.title || 'Leo Crackers Banner'}
                className="w-full h-auto object-contain block opacity-100"
              />
            </picture>
          )}

          {/* Text Overlay for 'text' type banners */}
          {banner.type === 'text' && banner.text && (
            <div
              className="absolute z-20 font-brand"
              style={{
                left: banner.posX || '50%',
                top: banner.posY || '50%',
                transform: 'translate(-50%, -50%)',
                color: banner.textColor || '#ffffff',
                fontSize: banner.fontSize || '32px',
                fontWeight: banner.fontWeight || 'bold',
                textAlign: banner.textAlign || 'center',
                textShadow: '0px 2px 8px rgba(0,0,0,0.7)',
                width: '90%',
                maxWidth: '800px',
                whiteSpace: 'pre-wrap',
                fontFamily: banner.text.toLowerCase().includes('leo') ? dancingScript.style.fontFamily : 'inherit'
              }}
            >
              {banner.text}
            </div>
          )}
        </div>
      ))}

      {/* Navigation Controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 md:left-4 z-30 p-2 md:p-3 rounded-full bg-black/30 hover:bg-black/60 text-white transition-colors border border-white/20"
          >
            <FaChevronLeft className="text-sm md:text-xl" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 md:right-4 z-30 p-2 md:p-3 rounded-full bg-black/30 hover:bg-black/60 text-white transition-colors border border-white/20"
          >
            <FaChevronRight className="text-sm md:text-xl" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 z-30 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-primary scale-125' : 'bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BannerCarousel;
