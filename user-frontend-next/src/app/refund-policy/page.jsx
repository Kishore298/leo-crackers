import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: "Cancellation & Refund Policy | Leo Crackers",
  description: "Cancellation and refund policy for Leo Crackers orders.",
};

const RefundPolicy = () => {
  return (
    <div className="bg-surface min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-24 sm:py-32 flex-1 w-full text-text">
        <h1 className="text-4xl sm:text-5xl font-heading font-black text-primary mb-8 animate-fade-in-up">Cancellation & Refund Policy</h1>
        
        <div className="glass-panel p-6 sm:p-10 space-y-6 animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
          <p>At <strong>Leo Crackers</strong>, we strive to ensure that our customers are completely satisfied with their purchases. Please read our cancellation and refund policy carefully.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Order Cancellations</h2>
          <p>You may cancel your order only if it has not yet been processed or dispatched from our warehouse. To cancel an order, please contact our customer support immediately at <strong>+91 95972 03949</strong> or <strong>+91 91595 33949</strong>. Once an order is dispatched, it cannot be cancelled.</p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Returns</h2>
          <p>Due to the nature of fireworks and safety regulations, <strong>we do not accept returns</strong> once the products have been delivered. Please ensure you double-check your order before making a payment.</p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Damaged or Defective Items</h2>
          <p>If you receive damaged, defective, or incorrect items, please notify us within 24 hours of delivery. We will require photographic evidence of the damaged goods. Upon verification, we will process a replacement or a proportionate refund for the damaged items.</p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Refunds</h2>
          <p>If your order is cancelled before dispatch, or if a refund is approved for damaged goods, the refund will be processed to your original method of payment within 5-7 business days.</p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Contact Support</h2>
          <p>For any cancellation or refund queries, reach out to us at:</p>
          <p className="mt-2 text-primary font-bold">Phone: +91 95972 03949, +91 91595 33949<br/>Email: leocrackershop@gmail.com</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
