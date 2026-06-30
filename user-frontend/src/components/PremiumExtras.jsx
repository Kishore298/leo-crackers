import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaArrowUp } from 'react-icons/fa';

const PremiumExtras = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleScroll = () => {
    const totalScroll = document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scroll = `${(totalScroll / windowHeight) * 100}`;

    setScrollProgress(scroll);
    setShowBackToTop(totalScroll > 300);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const dummyWhatsAppNumber = "+919876543210";

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-transparent">
        <div 
          className="h-full bg-primary shadow-[0_0_10px_#ff6600]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Buttons Container */}
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col gap-4">
        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className={`p-3 rounded-full bg-surface-2 border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-golden ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
          aria-label="Back to top"
        >
          <FaArrowUp />
        </button>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${dummyWhatsAppNumber}?text=Hello%20Leo%20Crackers!`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 md:p-4 rounded-full bg-[#25D366] text-white shadow-[0_0_15px_rgba(37,211,102,0.5)] hover:shadow-[0_0_25px_rgba(37,211,102,0.8)] transition-all duration-300 hover:scale-110 flex items-center justify-center animate-bounce-subtle"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp className="text-2xl md:text-3xl" />
        </a>
      </div>
    </>
  );
};

export default PremiumExtras;
