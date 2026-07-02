import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: "Privacy Policy | Leo Crackers",
  description: "Privacy policy for Leo Crackers. Learn how we collect, use, and protect your data.",
};

const PrivacyPolicy = () => {
  return (
    <div className="bg-surface min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-24 sm:py-32 flex-1 w-full text-text">
        <h1 className="text-4xl sm:text-5xl font-heading font-black text-primary mb-8 animate-fade-in-up">Privacy Policy</h1>
        
        <div className="glass-panel p-6 sm:p-10 space-y-6 animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
          <p>At <strong>Leo Crackers</strong>, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and protect your data when you use our website.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Information We Collect</h2>
          <p>We may collect the following types of information when you place an order or create an account:</p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>Personal identification information (Name, Email Address, Phone Number)</li>
            <li>Shipping and billing addresses</li>
            <li>Order history and preferences</li>
            <li>Technical data (IP address, browser type, cookies) for analytics</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. How We Use Your Information</h2>
          <p>The information we collect is used to:</p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>Process and deliver your orders accurately</li>
            <li>Communicate with you regarding order status and updates</li>
            <li>Improve our website functionality and user experience</li>
            <li>Send promotional offers (only if you have opted in)</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Data Security</h2>
          <p>We implement strict security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction. Your data is stored securely on our servers and we do not sell or share your personal information with third parties for marketing purposes.</p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Cookies</h2>
          <p>Our website uses cookies to enhance your browsing experience. Cookies help us remember your cart items and understand how you interact with our website. You can choose to disable cookies through your browser settings, but some features of our website may not function properly.</p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Contact Us</h2>
          <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
          <p className="mt-2 text-primary font-bold">Email: admin@leocrackers.com<br/>Phone: +91 91595 33949</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
