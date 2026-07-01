import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaEye, FaTimes } from 'react-icons/fa';

const API = 'http://localhost:5000/api/orders';
const STATUS_COLORS = { 
  PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', 
  APPROVED: 'bg-green-500/10 text-green-500 border-green-500/20', 
  REJECTED: 'bg-red-500/10 text-red-500 border-red-500/20', 
  REJECTED_OUT_OF_STOCK: 'bg-red-500/10 text-red-500 border-red-500/20' 
};
const PAYMENT_COLORS = { 
  PENDING: 'bg-surface-2 text-text-secondary border-border', 
  PAID_ONLINE: 'bg-blue-500/10 text-blue-400 border-blue-500/20', 
  CASH: 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
};

const Orders = () => {
  const { admin } = useSelector((state) => state.auth);
  const config = { headers: { Authorization: `Bearer ${admin?.token}` } };

  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, page, limit: 15, ...(filterStatus && { status: filterStatus }), ...(filterPayment && { paymentStatus: filterPayment }) });
      const { data } = await axios.get(`${API}?${params}`, config);
      setOrders(data.orders);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { 
    fetchOrders(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, filterStatus, filterPayment]);

  const updateStatus = async (id, field, value) => {
    try {
      await axios.put(`${API}/${id}`, { [field]: value }, config);
      fetchOrders();
      if (viewOrder?._id === id) setViewOrder(prev => ({ ...prev, [field]: value }));
      toast.success('Order updated successfully!');
    } catch (err) { toast.error('Error updating order'); }
  };

  return (
    <>
      <div className="animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black text-primary">Orders</h1>
          <p className="text-text-secondary text-sm mt-1">{total} orders total</p>
        </div>
      </div>

      <div className="glass-panel p-4 mb-4 flex flex-col md:flex-row gap-3">
        <input type="text" placeholder="Search by order # or customer..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 border border-border rounded-lg px-3 py-2 bg-surface-2 focus:outline-none focus:ring-1 focus:ring-primary text-text" />
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="border border-border rounded-lg px-3 py-2 bg-surface-2 focus:outline-none focus:ring-1 focus:ring-primary text-text">
          <option value="">All Status</option>
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="REJECTED_OUT_OF_STOCK">OUT OF STOCK</option>
        </select>
        <select value={filterPayment} onChange={(e) => { setFilterPayment(e.target.value); setPage(1); }}
          className="border border-border rounded-lg px-3 py-2 bg-surface-2 focus:outline-none focus:ring-1 focus:ring-primary text-text">
          <option value="">All Payment</option>
          <option value="PENDING">PENDING</option>
          <option value="PAID_ONLINE">PAID ONLINE</option>
          <option value="CASH">CASH</option>
        </select>
      </div>

      <div className="glass-panel overflow-x-auto w-full">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-fire-gradient text-white text-xs uppercase tracking-wider">
              <th className="px-5 py-4 text-left">Order #</th>
              <th className="px-5 py-4 text-left">Customer</th>
              <th className="px-5 py-4 text-right">Amount</th>
              <th className="px-5 py-4 text-center">Status</th>
              <th className="px-5 py-4 text-center">Payment</th>
              <th className="px-5 py-4 text-center">Update</th>
              <th className="px-5 py-4 text-center">Detail</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="py-10 text-center text-text-secondary animate-pulse">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="7" className="py-10 text-center text-text-secondary">No orders found.</td></tr>
            ) : orders.map((order, i) => (
              <tr key={order._id} className={`${i % 2 === 0 ? 'bg-surface' : 'bg-surface-2'} hover:bg-white/5 transition-colors`}>
                <td className="px-5 py-4 border-b border-border text-sm font-bold text-white font-mono">{order.orderNumber}</td>
                <td className="px-5 py-4 border-b border-border text-sm">
                  <div className="font-semibold text-text">{order.customer?.customerName}</div>
                  <div className="text-xs text-text-secondary">{order.customer?.mobileNumber}</div>
                </td>
                <td className="px-5 py-4 border-b border-border text-right font-black text-primary">₹{order.finalAmount}</td>
                <td className="px-5 py-4 border-b border-border text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[order.status] || 'bg-surface-2 text-text-secondary border-border'}`}>{order.status}</span>
                </td>
                <td className="px-5 py-4 border-b border-border text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold border ${PAYMENT_COLORS[order.paymentStatus] || 'bg-surface-2 text-text-secondary border-border'}`}>{order.paymentStatus}</span>
                </td>
                <td className="px-5 py-4 border-b border-border text-center">
                  <select value={order.status} onChange={(e) => updateStatus(order._id, 'status', e.target.value)}
                    className="border border-border rounded-lg px-2 py-1 text-xs bg-surface focus:outline-none focus:ring-1 focus:ring-primary text-text">
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="REJECTED_OUT_OF_STOCK">OUT OF STOCK</option>
                  </select>
                </td>
                <td className="px-5 py-4 border-b border-border text-center">
                  <button onClick={() => setViewOrder(order)} className="text-primary hover:text-white transition"><FaEye /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pages > 1 && (
          <div className="flex justify-center gap-2 py-4 border-t border-border bg-surface-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-full font-bold text-sm transition ${p === page ? 'bg-fire-gradient text-white shadow-primary' : 'bg-surface border border-border hover:border-primary text-text-secondary'}`}>{p}</button>
            ))}
          </div>
        )}
      </div>

      </div>

      {viewOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="glass-panel w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col border border-white/10 animate-fade-in-up">
            <div className="bg-fire-gradient px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-heading font-bold text-white">Order: {viewOrder.orderNumber}</h2>
              <button onClick={() => setViewOrder(null)} className="text-white/80 hover:text-white text-xl transition-colors"><FaTimes /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="bg-surface-2 rounded-xl p-4 border border-border">
                <h3 className="font-bold text-primary mb-2 text-xs uppercase tracking-wide">Customer</h3>
                <p className="font-semibold text-white">{viewOrder.customer?.customerName}</p>
                <p className="text-sm text-text-secondary">{viewOrder.customer?.mobileNumber} · {viewOrder.customer?.email}</p>
                <p className="text-sm text-text-secondary mt-1">{viewOrder.customer?.address}, {viewOrder.customer?.city} - {viewOrder.customer?.pincode}</p>
              </div>
              <div className="bg-surface-2 rounded-xl p-4 border border-border">
                <h3 className="font-bold text-primary mb-3 text-xs uppercase tracking-wide">Items</h3>
                {viewOrder.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1">
                    <span className="text-text">{item.product?.name || item.name} × {item.quantity}</span>
                    <span className="font-bold text-primary">₹{(item.priceAtPurchase || 0) * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-border mt-3 pt-3 flex justify-between font-black">
                  <span className="text-white">Total</span>
                  <span className="text-primary text-lg">₹{viewOrder.finalAmount}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-primary mb-1">Order Status</label>
                  <select value={viewOrder.status} onChange={(e) => updateStatus(viewOrder._id, 'status', e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 bg-surface focus:outline-none focus:ring-1 focus:ring-primary text-sm text-text">
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="REJECTED_OUT_OF_STOCK">OUT OF STOCK</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-primary mb-1">Payment Status</label>
                  <select value={viewOrder.paymentStatus} onChange={(e) => updateStatus(viewOrder._id, 'paymentStatus', e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 bg-surface focus:outline-none focus:ring-1 focus:ring-primary text-sm text-text">
                    <option value="PENDING">PENDING</option>
                    <option value="PAID_ONLINE">PAID ONLINE</option>
                    <option value="CASH">CASH</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Orders;