import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: "Terms & Conditions | Leo Crackers",
  description: "Terms and conditions for purchasing from Leo Crackers.",
};

const TermsConditions = () => {
  return (
    <div className="bg-surface min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-24 sm:py-32 flex-1 w-full text-text">
        <h1 className="text-4xl sm:text-5xl font-heading font-black text-primary mb-8 animate-fade-in-up">Terms & Conditions</h1>
        
        <div className="glass-panel p-6 sm:p-10 space-y-6 animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
          <p>Welcome to <strong>Leo Crackers</strong>. By accessing our website and placing an order, you agree to comply with and be bound by the following terms and conditions.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. General</h2>
          <p>The content of the pages of this website is for your general information and use only. It is subject to change without notice.</p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Minimum Order Value</h2>
          <p>We require a minimum order value of <strong>₹3,000</strong> to process and ship any orders. Orders below this threshold will not proceed to checkout.</p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Pricing and Availability</h2>
          <p>All prices are inclusive of taxes unless stated otherwise. We reserve the right to change prices at any time. Product availability is subject to change, and we will notify you if an item you ordered is out of stock.</p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Legal Age</h2>
          <p>By placing an order for fireworks on this website, you confirm that you are of legal age to purchase fireworks in your jurisdiction. It is the responsibility of the buyer to ensure compliance with local laws regarding the purchase and use of fireworks.</p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Delivery</h2>
          <p>Delivery timelines are estimates and not guarantees. We are not liable for any delays caused by external logistics partners, weather conditions, or unforeseen circumstances.</p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Liability</h2>
          <p>Leo Crackers is not responsible for any injury, damage, or loss caused by the improper use of our products. Please read and follow all safety instructions provided on the packaging before use.</p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Sivakasi, Tamil Nadu.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsConditions;
