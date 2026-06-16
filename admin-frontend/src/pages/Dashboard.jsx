import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaShoppingBag, FaBoxOpen, FaTags, FaChartLine, FaFire } from 'react-icons/fa';

const API = 'http://localhost:5000/api';

const StatCard = ({ icon, label, value, sub, gradient }) => (
  <div className={`rounded-2xl p-6 text-white shadow-primary-lg flex items-center gap-5 ${gradient}`}>
    <div className="bg-white/20 rounded-xl p-4 text-3xl">{icon}</div>
    <div>
      <p className="text-white/70 text-sm font-semibold uppercase tracking-wide">{label}</p>
      <p className="text-4xl font-black mt-1">{value}</p>
      {sub && <p className="text-white/60 text-xs mt-1">{sub}</p>}
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
        const [ordRes, prodRes, catRes] = await Promise.all([
          axios.get(`${API}/orders?limit=5&sortBy=createdAt&order=desc`, config),
          axios.get(`${API}/products?limit=1`, config),
          axios.get(`${API}/categories?limit=1`, config),
        ]);
        const orders = ordRes.data;
        const revenue = orders.orders?.reduce((acc, o) => o.status === 'APPROVED' ? acc + (o.finalAmount || 0) : acc, 0) || 0;
        const pending = orders.orders?.filter(o => o.status === 'PENDING').length || 0;
        setStats({
          orders: orders.total || 0,
          products: prodRes.data.total || 0,
          categories: catRes.data.total || 0,
          revenue,
          pending,
        });
        setRecentOrders(orders.orders || []);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const STATUS_COLORS = { PENDING: 'bg-yellow-100 text-yellow-700', APPROVED: 'bg-green-100 text-green-700', REJECTED: 'bg-red-100 text-red-700' };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-black text-primary-dark flex items-center gap-3">
          <FaFire className="text-primary animate-bounce-subtle" /> Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Welcome back, {admin?.username || 'Admin'}!</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-primary animate-pulse text-xl font-bold">Loading stats...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            <StatCard icon={<FaShoppingBag />} label="Total Orders" value={stats.orders} sub={`${stats.pending} pending`} gradient="bg-fire-gradient" />
            <StatCard icon={<FaBoxOpen />} label="Products" value={stats.products} gradient="bg-gradient-to-br from-primary-dark to-primary" />
            <StatCard icon={<FaTags />} label="Categories" value={stats.categories} gradient="bg-gradient-to-br from-primary to-accent-light" />
            <StatCard icon={<FaChartLine />} label="Revenue (Approved)" value={`₹${stats.revenue.toLocaleString()}`} gradient="bg-gradient-to-br from-green-600 to-green-400" />
          </div>

          <div className="bg-white rounded-2xl shadow-primary border border-border overflow-hidden">
            <div className="bg-fire-gradient px-6 py-4">
              <h2 className="text-lg font-heading font-bold text-white">Recent Orders</h2>
            </div>
            <table className="min-w-full">
              <thead className="bg-surface text-xs uppercase text-primary-dark tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left">Order #</th>
                  <th className="px-5 py-3 text-left">Customer</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-8 text-gray-400">No recent orders.</td></tr>
                ) : recentOrders.map((order, i) => (
                  <tr key={order._id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-surface'} hover:bg-surface-2 transition`}>
                    <td className="px-5 py-4 border-b border-border text-sm font-bold text-primary-dark font-mono">{order.orderNumber}</td>
                    <td className="px-5 py-4 border-b border-border text-sm font-semibold text-gray-800">{order.customer?.customerName}</td>
                    <td className="px-5 py-4 border-b border-border text-right font-black text-primary">₹{order.finalAmount}</td>
                    <td className="px-5 py-4 border-b border-border text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
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