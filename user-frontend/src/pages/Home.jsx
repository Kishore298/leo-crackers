import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeData, updateQuantity } from '../features/shop/shopSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFire, FaChevronDown, FaChevronUp, FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Home = () => {
  const dispatch = useDispatch();
  const { banners, categories, cart, isLoading } = useSelector((state) => state.shop);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  useEffect(() => {
    if (categories.length > 0 && Object.keys(expandedCategories).length === 0) {
      setExpandedCategories({ [categories[0]._id]: true });
    }
  }, [categories, expandedCategories]);

  const toggleCategory = (id) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleQuantityChange = (product, newQuantity) => {
    if (newQuantity < 0) return;

    const cartItem = cart.find(x => x.product === product._id);
    const oldQuantity = cartItem ? cartItem.quantity : 0;

    dispatch(updateQuantity({
      id: product._id,
      quantity: newQuantity,
      itemDetails: {
        product: product._id,
        name: product.name,
        price: product.actualPrice,
        image: product.image
      }
    }));

    if (oldQuantity === 0 && newQuantity === 1) {
      toast.success(`${product.name} added to cart!`, {
        autoClose: 1500,
        style: { background: '#fff8f5', color: '#D90429', fontWeight: 700 }
      });
    } else if (newQuantity === 0 && oldQuantity > 0) {
      toast.info(`${product.name} removed from cart`, {
        autoClose: 1500,
      });
    }
  };

  const downloadPriceList = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(217, 4, 41); // Primary Red
    doc.text('Leo Crackers', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Premium Quality Crackers | Sivakasi', 105, 28, { align: 'center' });
    doc.text('www.leocrackers.com | Phone: +91 9876543210', 105, 33, { align: 'center' });

    doc.setDrawColor(217, 4, 41);
    doc.line(14, 38, 196, 38);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Product Price List', 14, 48);

    const tableData = [];
    let sNo = 1;

    categories.forEach(category => {
      if (category.products && category.products.length > 0) {
        // Category Header Row
        tableData.push([
          { content: category.name.toUpperCase(), colSpan: 4, styles: { fillColor: [243, 244, 246], textColor: [217, 4, 41], fontStyle: 'bold', halign: 'center' } }
        ]);

        category.products.forEach(product => {
          tableData.push([
            sNo++,
            product.name,
            '1', // Base quantity representation
            `Rs. ${product.actualPrice}`
          ]);
        });
      }
    });

    autoTable(doc, {
      startY: 52,
      head: [['S.No', 'Product Name', 'Quantity', 'Price']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [217, 4, 41], textColor: [255, 255, 255] },
      styles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      margin: { top: 52 }
    });

    const finalY = doc.lastAutoTable.finalY || 52;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Thank You for shopping with Leo Crackers!', 105, finalY + 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Have a safe and happy celebration.', 105, finalY + 20, { align: 'center' });

    doc.save('Leo_Crackers_Price_List.pdf');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,204,51,0.15)_0%,rgba(5,5,5,1)_70%)]" />
        <div className="relative z-10 flex flex-col items-center">
          <img
            src="/assets/lion-logo.png"
            alt="Loading..."
            className="w-24 h-24 rounded-full mb-6 filter drop-shadow-[0_0_20px_rgba(255,204,51,0.6)] animate-pulse-glow"
          />
          <p className="text-white font-heading font-bold text-2xl tracking-widest animate-pulse">
            LOADING<span className="text-primary">...</span>
          </p>
        </div>
      </div>
    );
  }

  const activeBanner = banners && banners.length > 0 ? banners[0] : null;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-transparent">
      <Navbar />

      {/* Hero Section */}
      <div className="w-full pt-32 pb-16 relative flex flex-col items-center justify-center text-center min-h-[70vh]">
        {/* Deity Image */}
        <div className="mb-6 animate-fade-zoom relative z-10">
          <img
            src="/assets/hero-deity.jpeg"
            alt="Deity"
            className="w-48 h-48 md:w-64 md:h-64 object-contain filter drop-shadow-[0_0_20px_rgba(255,204,51,0.5)] animate-bounce-subtle mx-auto"
          />
        </div>

        {/* Text Content */}
        <div className="relative z-10 animate-fade-in-up flex flex-col items-center">
          <div className="flex items-center justify-center mb-4">
            <img src="/assets/lion-logo.png" alt="Leo Crackers Logo" className="w-12 h-12 mr-3 rounded-full" />
            <h1 className="text-5xl md:text-7xl font-heading font-black text-white tracking-tight">
              Welcome to <span className="fire-gradient-text">Leo Crackers</span>
            </h1>
          </div>
          <p className="text-text-secondary text-lg md:text-xl font-medium mt-4 mb-8 max-w-2xl tracking-wide">
            Premium Quality Fireworks Since 1995. Light up your celebrations with joy and prosperity.
          </p>
          <button
            onClick={() => window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' })}
            className="btn-fire text-lg px-8 py-3"
          >
            Explore Collection
          </button>
        </div>
      </div>

      {/* Categories & Products */}
      <div className="max-w-7xl mx-auto px-4 py-10 flex-1 w-full">
        {/* Actions Row */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:max-w-lg">
            <input
              type="text"
              placeholder="Search for crackers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-fire bg-surface/80 rounded-full py-3 text-white pl-5 pr-12 border-border focus:border-primary backdrop-blur-sm"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary">
              <FaFire className="text-sm" />
            </div>
          </div>
          <button
            onClick={downloadPriceList}
            className="btn-outline-fire flex items-center gap-2 rounded-full"
          >
            <FaFilePdf /> Download Price List
          </button>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-20 glass-panel">
            <FaFire className="text-5xl text-primary/30 mx-auto mb-4" />
            <p className="text-text-secondary text-xl font-semibold">No products available right now.</p>
          </div>
        ) : categories.map(category => {
          const filteredProducts = category.products?.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
          );

          if (!filteredProducts || filteredProducts.length === 0) return null;

          const isExpanded = expandedCategories[category._id];

          return (
            <div key={category._id} className="mb-6 glass-panel overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {/* Accordion Header */}
              <button
                onClick={() => toggleCategory(category._id)}
                className="w-full flex items-center justify-between p-5 md:p-6 bg-surface/50 hover:bg-surface transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-8 w-1.5 bg-primary rounded-full shadow-golden" />
                  <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide">
                    {category.name}
                  </h2>
                </div>
                <div className="text-text-secondary">
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </button>

              {/* Accordion Content */}
              <div
                className={`transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100 p-6' : 'max-h-0 opacity-0 overflow-hidden'}`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map(product => {
                    const cartItem = cart.find(x => x.product === product._id);
                    const qty = cartItem ? cartItem.quantity : 0;

                    return (
                      <div
                        key={product._id}
                        className="glass-panel hover:shadow-golden-hover hover:border-primary/50 transition-all duration-300 flex flex-col group overflow-hidden relative"
                      >
                        {/* Shine Effect */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shine_1s_ease-in-out] z-10 pointer-events-none" />

                        {/* Image */}
                        <div className="relative overflow-hidden bg-surface-2/50 h-48 flex items-center justify-center p-4">
                          <img
                            src={product.image || 'https://placehold.co/300x200/1A1A1A/ff6600?text=Leo'}
                            alt={product.name}
                            className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>

                        {/* Info */}
                        <div className="p-5 flex-1 flex flex-col relative z-20">
                          <h3 className="text-lg font-bold text-white mb-1 leading-snug">
                            {product.name}
                          </h3>
                          {product.description && (
                            <p className="text-sm text-text-secondary mb-4 line-clamp-2 leading-relaxed">
                              {product.description}
                            </p>
                          )}
                          <div className="mt-auto flex flex-col gap-3">
                            <span className="text-2xl font-black text-primary drop-shadow-[0_0_8px_rgba(255,102,0,0.4)]">₹{product.actualPrice}</span>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between border border-border rounded-lg p-1 bg-surface-2">
                              <button
                                onClick={() => handleQuantityChange(product, qty - 1)}
                                className="w-10 h-10 flex items-center justify-center rounded bg-surface border border-border text-text hover:text-primary transition-colors font-bold text-xl"
                                disabled={qty === 0}
                              >
                                -
                              </button>
                              <span className="font-bold text-lg text-white w-12 text-center select-none">
                                {qty}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(product, qty + 1)}
                                className="w-10 h-10 flex items-center justify-center rounded bg-primary text-white hover:bg-primary-dark transition-colors font-bold text-xl shadow-fire"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Footer />
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Home;