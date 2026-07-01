import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../features/shop/shopSlice';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';

const Cart = () => {
  const { cart } = useSelector((state) => state.shop);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const MIN_ORDER_VALUE = 3000;
  const remaining = MIN_ORDER_VALUE - totalAmount;
  const progress = Math.min((totalAmount / MIN_ORDER_VALUE) * 100, 100);

  return (
    <div className="bg-surface min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-12 flex-1 w-full">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="text-white hover:text-primary transition bg-[#16161a] p-3 rounded-full border border-white/10">
            <FaArrowLeft />
          </Link>
          <h1 className="text-3xl font-heading font-black text-white">Your Cart</h1>
          {cart.length > 0 && (
            <span className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">{cart.length} items</span>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-24 bg-[#16161a] border border-white/5 rounded-2xl">
            <FaShoppingBag className="text-6xl text-white/20 mx-auto mb-4" />
            <h2 className="text-2xl font-heading font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Browse our collection and add some crackers!</p>
            <Link to="/" className="inline-block bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-3 px-10 rounded-xl hover:shadow-[0_0_15px_rgba(255,102,0,0.4)] transition">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row gap-6 items-start">
            {/* Cart Items */}
            <div className="flex-1 bg-[#16161a] border border-white/5 rounded-xl overflow-hidden w-full shadow-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full whitespace-nowrap">
                  <thead className="bg-fire-gradient text-white text-xs uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-6 py-4 text-left">Product</th>
                      <th className="px-6 py-4 text-center">Price</th>
                      <th className="px-6 py-4 text-center">Qty</th>
                      <th className="px-6 py-4 text-right">Total</th>
                      <th className="px-6 py-4 text-center">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {cart.map((item, i) => (
                      <tr key={item.product} className={`${i % 2 === 0 ? 'bg-[#1e1e24]' : 'bg-[#16161a]'} hover:bg-white/5 transition`}>
                        <td className="px-6 py-5 font-bold text-white">{item.name}</td>
                        <td className="px-6 py-5 text-center">
                          <div className="flex flex-col items-center justify-center">
                            {item.mrp && item.mrp > item.price && (
                              <span className="text-[10px] font-medium line-through text-text-secondary mb-0.5">₹{item.mrp}</span>
                            )}
                            <span className="text-accent font-black">₹{item.price}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="flex items-center justify-between border border-white/5 rounded-lg p-0.5 bg-[#22222a] w-24 mx-auto shrink-0">
                            <button
                              onClick={() => dispatch(updateQuantity({ id: item.product, quantity: item.quantity - 1 }))}
                              className="w-8 h-8 flex items-center justify-center rounded text-text-secondary hover:text-white hover:bg-white/5 transition-colors font-medium text-lg"
                            >
                              -
                            </button>
                            <span className="font-medium text-sm text-white w-6 text-center select-none">{item.quantity}</span>
                            <button
                              onClick={() => dispatch(updateQuantity({ id: item.product, quantity: item.quantity + 1 }))}
                              className="w-8 h-8 flex items-center justify-center rounded text-text-secondary hover:text-white hover:bg-white/5 transition-colors font-medium text-lg"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right font-black text-accent text-lg">₹{item.price * item.quantity}</td>
                        <td className="px-6 py-5 text-center">
                          <button
                            onClick={() => dispatch(removeFromCart(item.product))}
                            className="text-gray-400 hover:text-white transition transform hover:scale-125"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="w-full xl:w-[400px] shrink-0">
              <div className="bg-[#16161a] border border-white/5 rounded-xl p-6 sticky top-24 shadow-lg">
                <h2 className="text-xl font-heading font-bold text-red-600 border-b border-white/10 pb-4 mb-4">Order Summary</h2>
                <div className="flex justify-between mb-2 text-gray-400">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-bold text-gray-300">₹{totalAmount}</span>
                </div>

                {/* Min order progress */}
                <div className="mt-4 mb-5">
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-gray-500">Min. order progress</span>
                    <span className={remaining > 0 ? 'text-red-500' : 'text-green-500'}>
                      {remaining > 0 ? `₹${remaining} more needed` : '✓ Ready to checkout'}
                    </span>
                  </div>
                  <div className="w-full bg-[#2a2a35] rounded-full h-2 overflow-hidden border border-white/5">
                    <div
                      className="h-2 rounded-full bg-fire-gradient transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 mb-6 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-xl text-red-600">Total</span>
                    <span className="font-black text-2xl text-orange-500 tracking-wide">₹{totalAmount}</span>
                  </div>
                </div>

                <button
                  disabled={totalAmount < MIN_ORDER_VALUE}
                  onClick={() => navigate('/checkout')}
                  className={`w-full py-4 px-4 rounded-xl font-bold text-white transition-all duration-200 text-base flex justify-center items-center gap-2 ${
                    totalAmount >= MIN_ORDER_VALUE
                      ? 'bg-fire-gradient hover:shadow-[0_0_20px_rgba(255,102,0,0.4)]'
                      : 'bg-gray-800 cursor-not-allowed text-gray-500 border border-white/10'
                  }`}
                >
                  {totalAmount >= MIN_ORDER_VALUE ? 'Proceed to Checkout →' : `Add ₹${remaining} more`}
                </button>

                <Link to="/" className="block text-center mt-5 text-orange-500 hover:text-orange-400 text-sm font-semibold transition">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;