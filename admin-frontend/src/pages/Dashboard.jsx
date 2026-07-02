import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaShoppingBag, FaBoxOpen, FaTags, FaChartLine, FaFire } from 'react-icons/fa';

const API = process.env.REACT_APP_API_URL + '';

const StatCard = ({ icon, label, value, sub, gradient }) => (
  <div className="glass-panel relative overflow-hidden flex items-center group transition-transform duration-300 hover:-translate-y-1 p-2 gap-2 sm:p-4 sm:gap-3 md:p-5 md:gap-4 lg:p-6 lg:gap-5 rounded-lg sm:rounded-xl md:rounded-2xl">
    <div className={`absolute -right-5 -bottom-5 sm:-right-8 sm:-bottom-8 lg:-right-10 lg:-bottom-10 rounded-full blur-2xl sm:blur-3xl opacity-20 ${gradient} w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32`}></div>
    <div className={`relative z-10 flex items-center justify-center text-white shadow-md sm:shadow-lg ${gradient} w-8 h-8 text-sm rounded-md sm:w-10 sm:h-10 sm:text-lg sm:rounded-lg md:w-12 md:h-12 md:text-xl md:rounded-xl lg:w-14 lg:h-14 lg:text-2xl`}>
      {icon}
    </div>
    <div className="relative z-10">
      <p className="text-text-secondary font-bold uppercase tracking-wider mb-0.5 text-[9px] sm:text-[10px] md:text-xs">{label}</p>
      <p className="font-black text-white text-lg sm:text-xl md:text-2xl lg:text-3xl leading-none">{value}</p>
      {sub && <p className="text-primary font-semibold text-[8px] sm:text-[9px] md:text-xs mt-0.5 leading-none">{sub}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const { admin } = useSelector((state) => state.auth);
  const config = { headers: { Authorization: `Bearer ${admin?.token}` } };

  const [stats, setStats] = useState({ orders: 0, products: 0, categories: 0, revenue: 0, pending: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, prodRes, catRes] = await Promise.all([
          axios.get(`${API}/orders/dashboard/stats`, config),
          axios.get(`${API}/products?limit=1`, config),
          axios.get(`${API}/categories?limit=1`, config),
        ]);
        
        const data = statsRes.data;
        
        setStats({
          orders: data.totalOrders || 0,
          products: prodRes.data.total || 0,
          categories: catRes.data.total || 0,
          revenue: data.totalRevenue || 0,
          pending: data.pendingOrders || 0,
        });
        setRecentOrders(data.recentOrders || []);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const STATUS_COLORS = { 
    PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', 
    APPROVED: 'bg-green-500/10 text-green-500 border-green-500/20', 
    REJECTED: 'bg-red-500/10 text-red-500 border-red-500/20' 
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-black text-primary flex items-center gap-3">
          <FaFire className="text-primary animate-bounce-subtle" /> Dashboard
        </h1>
        <p className="text-text-secondary mt-1">Welcome back, {admin?.username || 'Admin'}!</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-primary animate-pulse text-xl font-bold">Loading stats...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mb-10">
            <StatCard icon={<FaShoppingBag />} label="Total Orders" value={stats.orders} sub={`${stats.pending} pending`} gradient="bg-fire-gradient" />
            <StatCard icon={<FaBoxOpen />} label="Products" value={stats.products} gradient="bg-gradient-to-br from-primary-dark to-primary" />
            <StatCard icon={<FaTags />} label="Categories" value={stats.categories} gradient="bg-gradient-to-br from-primary to-accent-light" />
            <StatCard icon={<FaChartLine />} label="Revenue (Approved)" value={`₹${stats.revenue.toLocaleString()}`} gradient="bg-gradient-to-br from-green-600 to-green-400" />
          </div>

          <div className="glass-panel overflow-hidden">
            <div className="bg-surface-2 border-b border-border px-6 py-4">
              <h2 className="text-lg font-heading font-bold text-white">Recent Orders</h2>
            </div>
            <table className="min-w-full">
              <thead className="bg-surface-2 text-xs uppercase text-text-secondary tracking-wider border-b border-border">
                <tr>
                  <th className="px-5 py-4 text-left">Order #</th>
                  <th className="px-5 py-4 text-left">Customer</th>
                  <th className="px-5 py-4 text-right">Amount</th>
                  <th className="px-5 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-8 text-text-secondary">No recent orders.</td></tr>
                ) : recentOrders.map((order, i) => (
                  <tr key={order._id} className={`${i % 2 === 0 ? 'bg-surface' : 'bg-surface-2'} hover:bg-white/5 transition-colors`}>
                    <td className="px-5 py-4 border-b border-border text-sm font-bold text-white font-mono">{order.orderNumber}</td>
                    <td className="px-5 py-4 border-b border-border text-sm font-semibold text-text">{order.customer?.customerName}</td>
                    <td className="px-5 py-4 border-b border-border text-right font-black text-primary">₹{order.finalAmount}</td>
                    <td className="px-5 py-4 border-b border-border text-center">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${STATUS_COLORS[order.status] || 'bg-surface-2 text-text-secondary border-border'}`}>{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;