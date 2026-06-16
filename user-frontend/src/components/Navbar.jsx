import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaShoppingCart, FaFire } from 'react-icons/fa';

const Navbar = () => {
  const { cart } = useSelector((state) => state.shop);

  return (
    <nav className="bg-white shadow-primary sticky top-0 z-50 border-b-4 border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-2xl font-black text-primary-dark">
              <FaFire className="mr-2 text-primary animate-bounce-subtle" />
              LEO<span className="text-primary-light font-light">CRACKERS</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link to="/cart" className="flex items-center text-primary-dark hover:text-primary transition">
              <div className="relative">
                <FaShoppingCart className="text-2xl" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-fire-gradient text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-primary">
                    {cart.length}
                  </span>
                )}
              </div>
              <span className="ml-2 font-medium hidden sm:block">Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;