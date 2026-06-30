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
      <div className="max-w-7xl mx-auto px-4 py-12 flex-1 w-full">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="text-primary hover:text-primary-dark transition">
            <FaArrowLeft />
          </Link>
          <h1 className="text-3xl font-heading font-black text-primary-dark">Your Cart</h1>
          {cart.length > 0 && (
            <span className="bg-fire-gradient text-white text-xs font-bold px-2 py-1 rounded-full">{cart.length} items</span>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl shadow-primary border border-border">
            <FaShoppingBag className="text-6xl text-primary/20 mx-auto mb-4" />
            <h2 className="text-2xl font-heading font-bold text-primary-dark mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Browse our collection and add some crackers!</p>
            <Link to="/" className="inline-block bg-fire-gradient text-white font-bold py-3 px-10 rounded-xl hover:shadow-primary-lg transition shadow-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 bg-white rounded-2xl shadow-primary overflow-x-auto border border-border w-full">
              <table className="min-w-full">
                <thead className="bg-fire-gradient text-white text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 text-left">Product</th>
                    <th className="px-6 py-4 text-center">Price</th>
                    <th className="px-6 py-4 text-center">Qty</th>
                    <th className="px-6 py-4 text-right">Total</th>
                    <th className="px-6 py-4 text-center">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {cart.map((item, i) => (
                    <tr key={item.product} className={`${i % 2 === 0 ? 'bg-white' : 'bg-surface'} hover:bg-surface-2 transition`}>
                      <td className="px-6 py-4 font-semibold text-primary-dark">{item.name}</td>
                      <td className="px-6 py-4 text-center text-gray-700">₹{item.price}</td>
                      <td className="px-6 py-4 text-center font-bold text-gray-800">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => dispatch(updateQuantity({ id: item.product, quantity: item.quantity - 1 }))}
                            className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-bold text-lg"
                          >
                            -
                          </button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => dispatch(updateQuantity({ id: item.product, quantity: item.quantity + 1 }))}
                            className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-bold text-lg"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-primary">₹{item.price * item.quantity}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => dispatch(removeFromCart(item.product))}
                          className="text-gray-400 hover:text-red-500 transition transform hover:scale-125"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="w-full lg:w-96 shrink-0">
              <div className="bg-white rounded-2xl shadow-primary p-6 border border-border sticky top-4">
                <h2 className="text-xl font-heading font-bold text-primary-dark border-b border-border pb-4 mb-4">Order Summary</h2>
                <div className="flex justify-between mb-2 text-gray-600">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-bold text-gray-800">₹{totalAmount}</span>
                </div>

                {/* Min order progress */}
                <div className="mt-4 mb-5">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-500">Min. order progress</span>
                    <span className={remaining > 0 ? 'text-red-500' : 'text-green-600'}>
                      {remaining > 0 ? `₹${remaining} more needed` : '✓ Ready to checkout'}
                    </span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full bg-fire-gradient transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-lg text-primary-dark">Total</span>
                    <span className="font-black text-2xl text-primary">₹{totalAmount}</span>
                  </div>
                </div>

                <button
                  disabled={totalAmount < MIN_ORDER_VALUE}
                  onClick={() => navigate('/checkout')}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-white transition-all duration-200 text-base ${
                    totalAmount >= MIN_ORDER_VALUE
                      ? 'bg-fire-gradient shadow-primary hover:shadow-primary-lg'
                      : 'bg-gray-200 cursor-not-allowed text-gray-400'
                  }`}
                >
                  {totalAmount >= MIN_ORDER_VALUE ? 'Proceed to Checkout →' : `Add ₹${remaining} more`}
                </button>

                <Link to="/" className="block text-center mt-3 text-primary hover:text-primary-dark text-sm font-semibold transition">
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