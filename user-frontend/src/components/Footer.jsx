import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => (
  <footer className="relative mt-20 border-t border-border bg-surface/80 backdrop-blur-md pt-12 pb-6">
    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />

    <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
      {/* Brand */}
      <div>
        <h3 className="text-2xl font-heading font-black flex items-center mb-3">
          <img src="/assets/lion-logo.png" alt="Leo Crackers Logo" className="w-8 h-8 mr-2 rounded-full grayscale opacity-80" />
          <span className="text-white">LEO</span><span className="text-primary font-light">CRACKERS</span>
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          The finest fireworks for every celebration. Light up your moments with joy and prosperity.
        </p>
      </div>

      {/* Contact */}
      <div>
        <h4 className="font-heading font-bold text-lg text-primary mb-4">Contact Us</h4>
        <ul className="space-y-3 text-sm text-text-secondary">
          <li className="flex items-center gap-2 hover:text-white transition-colors"><FaPhone className="text-primary" /> +91 98765 43210</li>
          <li className="flex items-center gap-2 hover:text-white transition-colors"><FaEnvelope className="text-primary" /> leo@crackers.com</li>
          <li className="flex items-center gap-2 hover:text-white transition-colors"><FaMapMarkerAlt className="text-primary" /> Sivakasi, Tamil Nadu</li>
        </ul>
      </div>

      {/* Policy */}
      <div>
        <h4 className="font-heading font-bold text-lg text-primary mb-4">Quick Info</h4>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li>Minimum order value: <span className="text-white font-bold">₹3,000</span></li>
          <li>Orders processed within 24hrs</li>
          <li>All prices are inclusive of taxes</li>
          <li>Subject to availability</li>
        </ul>
      </div>
    </div>

    {/* Center Deity & Copyright */}
    <div className="relative z-10 flex flex-col items-center justify-center border-t border-white/5 pt-8">
      <img
        src="/assets/hero-deity.jpeg"
        alt="Deity Blessing"
        className="w-20 h-20 object-contain mb-4 filter drop-shadow-[0_0_10px_rgba(255,204,51,0.3)] animate-pulse-glow"
      />
      <h4 className="text-xl font-heading text-white font-bold tracking-widest mb-1">LEO CRACKERS</h4>
      <p className="text-primary font-medium text-sm mb-6 uppercase tracking-widest">Lighting Happiness</p>

      <div className="text-center text-text-secondary/50 text-xs tracking-wider">
        © {new Date().getFullYear()} Leo Crackers. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;