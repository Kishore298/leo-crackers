import React from 'react';
import { FaFire, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-primary-dark text-white mt-16">
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* Brand */}
      <div>
        <h3 className="text-2xl font-heading font-black flex items-center gap-2 mb-3">
          <FaFire className="text-primary animate-bounce-subtle" />
          LEO<span className="text-primary-light font-light">CRACKERS</span>
        </h3>
        <p className="text-white/60 text-sm leading-relaxed">
          The finest crackers for every celebration. Light up your moments with Leo Crackers!
        </p>
      </div>

      {/* Contact */}
      <div>
        <h4 className="font-heading font-bold text-lg text-primary-light mb-4">Contact Us</h4>
        <ul className="space-y-3 text-sm text-white/70">
          <li className="flex items-center gap-2"><FaPhone className="text-primary" /> +91 98765 43210</li>
          <li className="flex items-center gap-2"><FaEnvelope className="text-primary" /> leo@crackers.com</li>
          <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-primary" /> Sivakasi, Tamil Nadu</li>
        </ul>
      </div>

      {/* Policy */}
      <div>
        <h4 className="font-heading font-bold text-lg text-primary-light mb-4">Quick Info</h4>
        <ul className="space-y-2 text-sm text-white/70">
          <li>Minimum order value: <span className="text-white font-bold">₹3,000</span></li>
          <li>Orders processed within 24hrs</li>
          <li>All prices are inclusive of taxes</li>
          <li>Subject to availability</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-white/10 py-4 text-center text-white/40 text-xs">
      © {new Date().getFullYear()} Leo Crackers. All rights reserved.
    </div>
  </footer>
);

export default Footer;