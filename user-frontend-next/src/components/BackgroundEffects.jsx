'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RocketCracker = () => (
  <div className="relative">
    {/* Rocket Body */}
    <svg width="60" height="120" viewBox="0 0 60 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
      {/* Stick */}
      <rect x="28" y="70" width="4" height="50" fill="#D2B48C" />
      {/* Main Cylinder */}
      <rect x="15" y="30" width="30" height="40" fill="#ff6600" />
      {/* Top Cone */}
      <polygon points="15,30 45,30 30,0" fill="#ffcc33" />
      {/* Base Cap */}
      <rect x="15" y="70" width="30" height="5" fill="#8b0000" />
      {/* Details / Stripes */}
      <rect x="15" y="40" width="30" height="5" fill="#ffcc33" />
      <rect x="15" y="55" width="30" height="5" fill="#ffcc33" />
    </svg>

    {/* Fire Sparks (Tail) */}
    <motion.div 
      className="absolute left-1/2 bottom-[-20px] w-4 h-16 rounded-full blur-[2px] opacity-80"
      style={{ 
        background: 'linear-gradient(to bottom, #ffffff, #ffcc33, #ff6600, transparent)',
        transform: 'translateX(-50%)'
      }}
      animate={{ 
        height: ['40px', '70px', '40px'],
        opacity: [0.6, 1, 0.6]
      }}
      transition={{ duration: 0.15, repeat: Infinity }}
    />
  </div>
);

const BackgroundEffects = () => {
  const [showRockets, setShowRockets] = useState(true);

  useEffect(() => {
    // Hide the rockets after the animation completes
    const timer = setTimeout(() => {
      setShowRockets(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_center,rgba(255,102,0,0.1)_0%,rgba(5,5,5,1)_100%)] pointer-events-none" />
      
      <AnimatePresence>
        {showRockets && (
          <>
            {/* Rocket 1 (Bottom Left to Top Right) */}
            <motion.div
              className="fixed z-[100] pointer-events-none drop-shadow-[0_0_15px_rgba(255,102,0,0.8)]"
              initial={{ x: '-10vw', y: '110vh', rotate: 45, scale: 0.8 }}
              animate={{ x: '110vw', y: '-10vh' }}
              transition={{ duration: 2.2, ease: "easeIn" }}
              exit={{ opacity: 0 }}
            >
              <RocketCracker />
            </motion.div>

            {/* Rocket 2 (Bottom Right to Top Left) */}
            <motion.div
              className="fixed z-[100] pointer-events-none drop-shadow-[0_0_15px_rgba(255,102,0,0.8)]"
              initial={{ x: '110vw', y: '110vh', rotate: -45, scale: 0.7 }}
              animate={{ x: '-10vw', y: '-10vh' }}
              transition={{ duration: 2.5, ease: "easeIn", delay: 0.4 }}
              exit={{ opacity: 0 }}
            >
              <RocketCracker />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default BackgroundEffects;
