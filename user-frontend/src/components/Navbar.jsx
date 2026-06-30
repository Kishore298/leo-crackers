import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
  const { cart } = useSelector((state) => state.shop);

  return (
    <nav className="fixed top-4 left-4 right-4 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 glass-navbar rounded-2xl flex justify-between items-center transition-all duration-300">
        <div className="flex items-center">
          <Link to="/" className="flex items-center group">
            <img 
              src="/assets/lion-logo.png" 
              alt="Leo Crackers Logo" 
              className="h-10 w-10 mr-2 sm:mr-3 rounded-full object-cover border border-primary/30 group-hover:border-primary transition-colors"
            />
            <span className="text-lg sm:text-2xl font-black text-white tracking-wide">
              LEO<span className="text-primary font-light">CRACKERS</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center">
          <Link to="/cart" className="flex items-center text-text hover:text-primary transition group">
            <div className="relative">
              <FaShoppingCart className="text-2xl group-hover:scale-110 transition-transform" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-golden">
                  {cart.length}
                </span>
              )}
            </div>
            <span className="ml-3 font-medium hidden sm:block group-hover:text-primary transition-colors">Cart</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;