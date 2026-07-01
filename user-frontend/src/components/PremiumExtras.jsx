import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaArrowUp, FaInstagram, FaYoutube, FaFacebook, FaChevronRight, FaChevronLeft } from 'react-icons/fa';

const PremiumExtras = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showSocialSidebar, setShowSocialSidebar] = useState(true);
  const [hasAutoClosed, setHasAutoClosed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;

      setScrollProgress(scroll);
      setShowBackToTop(totalScroll > 300);

      // Auto close social on mobile when scrolled 1 screen down
      if (totalScroll > document.documentElement.clientHeight && !hasAutoClosed) {
        setShowSocialSidebar(false);
        setHasAutoClosed(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAutoClosed]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const dummyWhatsAppNumber = "+919159533949";

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-transparent">
        <div
          className="h-full bg-primary shadow-[0_0_10px_#ff6600]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Social Icons (Left) */}
      <div className="fixed bottom-6 left-0 z-[90] flex items-end">
        {/* Mobile Toggle Button (Visible when closed) */}
        <button
          onClick={() => setShowSocialSidebar(true)}
          className={`md:hidden absolute left-0 bottom-4 p-2 bg-surface-2/90 backdrop-blur border border-l-0 border-white/10 rounded-r-xl text-primary shadow-lg transition-transform duration-300 z-0 ${showSocialSidebar ? '-translate-x-full' : 'translate-x-0'}`}
          aria-label="Open social links"
        >
          <FaChevronRight className="text-xs" />
        </button>

        {/* Social Icons Container */}
        <div className={`flex flex-col gap-2 md:gap-4 p-2 md:p-0 md:left-6 md:relative md:translate-x-0 transition-transform duration-300 z-10 ${showSocialSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Close button for mobile */}
          <button
            onClick={() => setShowSocialSidebar(false)}
            className="md:hidden p-2 mx-auto rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors mb-1"
            aria-label="Close social links"
          >
            <FaChevronLeft className="text-sm" />
          </button>

          <a href="https://www.instagram.com/leo_crackers_sivakasi?igsh=eDBwcG5jcXd5c3Rs&utm_source=qr" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-[0_0_15px_rgba(220,39,67,0.4)] hover:shadow-[0_0_20px_rgba(220,39,67,0.7)] transition-all duration-300 hover:scale-110 flex items-center justify-center" aria-label="Instagram">
            <FaInstagram className="text-xl md:text-2xl" />
          </a>
          <a href="https://youtube.com/@leocrackers-sivakasi?si=mQ6IhVeWEWq8pQEN" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-[#FF0000] text-white shadow-[0_0_15px_rgba(255,0,0,0.4)] hover:shadow-[0_0_20px_rgba(255,0,0,0.7)] transition-all duration-300 hover:scale-110 flex items-center justify-center" aria-label="YouTube">
            <FaYoutube className="text-xl md:text-2xl" />
          </a>
          <a href="https://www.facebook.com/share/1Cfww3EkBU/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-[#1877F2] text-white shadow-[0_0_15px_rgba(24,119,242,0.4)] hover:shadow-[0_0_20px_rgba(24,119,242,0.7)] transition-all duration-300 hover:scale-110 flex items-center justify-center" aria-label="Facebook">
            <FaFacebook className="text-xl md:text-2xl" />
          </a>
        </div>
      </div>

      {/* Floating Buttons Container (Right) */}
      <div className="fixed bottom-6 right-2 md:right-6 z-[90] flex flex-col gap-3 md:gap-4">
        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className={`flex items-center justify-center p-3 rounded-full bg-surface-2 border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-golden ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
          aria-label="Back to top"
        >
          <FaArrowUp />
        </button>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${dummyWhatsAppNumber}`}
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
