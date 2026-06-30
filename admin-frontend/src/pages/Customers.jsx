import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaSearch } from 'react-icons/fa';

const API = 'http://localhost:5000/api/customers';

const Customers = () => {
  const { admin } = useSelector((state) => state.auth);
  const config = { headers: { Authorization: `Bearer ${admin?.token}` } };

  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, page, limit: 15 });
      const { data } = await axios.get(`${API}?${params}`, config);
      setCustomers(data.customers);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { 
    fetchCustomers(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black text-primary flex items-center gap-3">
            Customers
          </h1>
          <p className="text-text-secondary text-sm mt-1">{total} customers total</p>
        </div>
      </div>

      <div className="glass-panel p-4 mb-4 flex gap-3 items-center">
        <FaSearch className="text-primary hidden md:block" />
        <input
          type="text"
          placeholder="Search by name, mobile, email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 outline-none text-text bg-transparent"
        />
      </div>

      <div className="glass-panel overflow-x-auto w-full">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-fire-gradient text-white text-xs uppercase tracking-wider">
              <th className="px-5 py-4 text-left">Name</th>
              <th className="px-5 py-4 text-left">Mobile</th>
              <th className="px-5 py-4 text-left">Email</th>
              <th className="px-5 py-4 text-left">City</th>
              <th className="px-5 py-4 text-left">Address</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="py-10 text-center text-text-secondary text-lg animate-pulse">Loading...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan="5" className="py-10 text-center text-text-secondary">No customers found.</td></tr>
            ) : customers.map((c, i) => (
              <tr key={c._id} className={`${i % 2 === 0 ? 'bg-surface' : 'bg-surface-2'} hover:bg-white/5 transition-colors`}>
                <td className="px-5 py-4 border-b border-border text-sm font-bold text-white">{c.customerName}</td>
                <td className="px-5 py-4 border-b border-border text-sm text-text-secondary">{c.mobileNumber}</td>
                <td className="px-5 py-4 border-b border-border text-sm text-text-secondary">{c.email || '—'}</td>
                <td className="px-5 py-4 border-b border-border text-sm font-semibold text-text">{c.city}</td>
                <td className="px-5 py-4 border-b border-border text-sm text-text-secondary max-w-xs truncate">{c.address}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {pages > 1 && (
          <div className="flex justify-center items-center gap-2 py-4 border-t border-border bg-surface-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-full font-bold text-sm transition ${p === page ? 'bg-fire-gradient text-white shadow-[0_0_15px_rgba(255,102,0,0.4)]' : 'bg-surface border border-border hover:border-primary text-text-secondary'}`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Customers;