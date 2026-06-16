import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeft, FaCheckCircle, FaFire } from 'react-icons/fa';
import { clearCart } from '../features/shop/shopSlice';

const Checkout = () => {
  const { cart } = useSelector((state) => state.shop);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [formData, setFormData] = useState({
    customerName: '', mobileNumber: '', email: '', address: '', city: '', pincode: ''
  });

  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/orders', {
        customerData: formData,
        orderItems: cart,
        subtotal: totalAmount,
        finalAmount: totalAmount,
      });
      setOrderNumber(data.orderNumber);
      setOrderPlaced(true);
      dispatch(clearCart());
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    }
    setLoading(false);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="bg-white rounded-2xl shadow-primary-lg border border-border p-12 text-center max-w-md w-full animate-fade-in-up">
            <div className="flex justify-center mb-5">
              <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-5xl text-green-500" />
              </div>
            </div>
            <h2 className="text-3xl font-heading font-black text-primary-dark mb-2">Order Placed!</h2>
            <p className="text-gray-500 mb-4">Thank you for your order. Our team will review and confirm it shortly.</p>
            <div className="bg-surface-2 border border-border rounded-xl px-6 py-4 mb-6 inline-block">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Your Order Number</p>
              <p className="text-2xl font-black text-primary font-mono">{orderNumber}</p>
            </div>
            <p className="text-xs text-gray-400 mb-8">Save this number to track your order status.</p>
            <Link to="/" className="inline-block bg-fire-gradient text-white font-bold py-3 px-10 rounded-xl shadow-primary hover:shadow-primary-lg transition">
              <FaFire className="inline mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="bg-surface min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12 w-full flex-1">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/cart" className="text-primary hover:text-primary-dark transition"><FaArrowLeft /></Link>
          <h1 className="text-3xl font-heading font-black text-primary-dark">Checkout</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-primary border border-border p-8">
              <h2 className="text-xl font-heading font-bold text-primary-dark mb-6 flex items-center gap-2">
                <span className="bg-fire-gradient text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">1</span>
                Delivery Details
              </h2>
              <form id="checkout-form" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-primary-dark mb-1.5">Full Name *</label>
                    <input required type="text" name="customerName" onChange={onChange}
                      className="w-full px-4 py-3 border border-border bg-surface-2 rounded-xl focus:ring-2 focus:ring-primary outline-none text-gray-800 placeholder-gray-400"
                      placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary-dark mb-1.5">Mobile Number *</label>
                    <input required type="tel" name="mobileNumber" onChange={onChange}
                      pattern="[6-9][0-9]{9}"
                      className="w-full px-4 py-3 border border-border bg-surface-2 rounded-xl focus:ring-2 focus:ring-primary outline-none text-gray-800 placeholder-gray-400"
                      placeholder="10-digit mobile number" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-primary-dark mb-1.5">Email Address</label>
                    <input type="email" name="email" onChange={onChange}
                      className="w-full px-4 py-3 border border-border bg-surface-2 rounded-xl focus:ring-2 focus:ring-primary outline-none text-gray-800 placeholder-gray-400"
                      placeholder="optional" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-primary-dark mb-1.5">Delivery Address *</label>
                    <textarea required name="address" onChange={onChange} rows="3"
                      className="w-full px-4 py-3 border border-border bg-surface-2 rounded-xl focus:ring-2 focus:ring-primary outline-none text-gray-800 placeholder-gray-400"
                      placeholder="Street, area, landmark..." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary-dark mb-1.5">City *</label>
                    <input required type="text" name="city" onChange={onChange}
                      className="w-full px-4 py-3 border border-border bg-surface-2 rounded-xl focus:ring-2 focus:ring-primary outline-none text-gray-800 placeholder-gray-400"
                      placeholder="City name" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary-dark mb-1.5">Pincode *</label>
                    <input required type="text" name="pincode" onChange={onChange}
                      pattern="[0-9]{6}"
                      className="w-full px-4 py-3 border border-border bg-surface-2 rounded-xl focus:ring-2 focus:ring-primary outline-none text-gray-800 placeholder-gray-400"
                      placeholder="6-digit pincode" />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl shadow-primary border border-border p-6 sticky top-4">
              <h2 className="text-xl font-heading font-bold text-primary-dark mb-4 flex items-center gap-2">
                <span className="bg-fire-gradient text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">2</span>
                Order Summary
              </h2>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div key={item.product} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                    <span className="text-gray-700 truncate max-w-[60%]">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                    <span className="font-bold text-primary shrink-0">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="bg-surface-2 rounded-xl p-4 border border-border mb-5 text-center">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Total Amount</p>
                <p className="text-3xl font-black text-primary">₹{totalAmount}</p>
              </div>
              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full bg-fire-gradient text-white font-black py-4 rounded-xl hover:shadow-primary-lg transition shadow-primary text-base uppercase tracking-wide"
              >
                {loading ? 'Placing Order...' : '🔥 Confirm Order'}
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
                By confirming, our team will review and contact you
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Checkout;