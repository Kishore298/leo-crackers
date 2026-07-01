import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaTimes, FaFilter } from 'react-icons/fa';
import ConfirmDialog from '../components/ConfirmDialog';

const API = 'http://localhost:5000/api';
const initialForm = { name: '', mrp: '', category: '', youtubeUrl: '', isActive: true };

const Products = () => {
  const { admin } = useSelector((state) => state.auth);
  const config = { headers: { Authorization: `Bearer ${admin?.token}` } };

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, page, limit: 15, ...(filterCat && { category: filterCat }) });
      const { data } = await axios.get(`${API}/products?${params}`, config);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API}/categories?limit=100`, config);
      setCategories(data.categories || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { 
    fetchProducts(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, filterCat]);
  useEffect(() => { 
    fetchCategories(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAdd = () => { setEditId(null); setForm(initialForm); setImageFile(null); setShowModal(true); };
  const openEdit = (prod) => {
    setEditId(prod._id);
    setForm({ 
      name: prod.name, 
      mrp: prod.mrp || '', 
      category: prod.category?._id || prod.category || '', 
      youtubeUrl: prod.youtubeId ? `https://www.youtube.com/watch?v=${prod.youtubeId}` : '',
      isActive: prod.isActive 
    });
    setImageFile(null);
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditId(null); setForm(initialForm); setImageFile(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('mrp', form.mrp);
    formData.append('category', form.category);
    if (form.youtubeUrl) formData.append('youtubeUrl', form.youtubeUrl);
    formData.append('isActive', form.isActive);
    if (imageFile) formData.append('image', imageFile);

    const submitConfig = {
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      }
    };

    try {
      if (editId) {
        await axios.put(`${API}/products/${editId}`, formData, submitConfig);
      } else {
        await axios.post(`${API}/products`, formData, submitConfig);
      }
      closeModal();
      fetchProducts();
      toast.success(editId ? 'Product updated successfully!' : 'Product created successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    }
    setSaving(false);
  };

  const handleDelete = (id) => {
    setConfirmDelete({ isOpen: true, id });
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete.id) return;
    try {
      await axios.delete(`${API}/products/${confirmDelete.id}`, config);
      fetchProducts();
      toast.success('Product deleted successfully!');
    } catch (err) { toast.error('Error deleting product'); }
    setConfirmDelete({ isOpen: false, id: null });
  };

  return (
    <>
      <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black text-primary">Products</h1>
          <p className="text-text-secondary text-sm mt-1">{total} products total</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-fire-gradient text-white font-bold px-5 py-2.5 rounded-lg shadow-primary hover:shadow-primary-lg transition">
          <FaPlus /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 mb-4 flex flex-col md:flex-row gap-3 items-center">
        <FaSearch className="text-primary hidden md:block" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 outline-none text-text border border-border rounded-lg px-3 py-2 bg-surface-2 focus:ring-1 focus:ring-primary w-full md:w-auto"
        />
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FaFilter className="text-primary" />
          <select value={filterCat} onChange={(e) => { setFilterCat(e.target.value); setPage(1); }}
            className="border border-border rounded-lg px-3 py-2 bg-surface-2 focus:outline-none focus:ring-1 focus:ring-primary text-text w-full">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel overflow-x-auto w-full">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-fire-gradient text-white text-xs uppercase tracking-wider">
              <th className="px-5 py-4 text-center">Image</th>
              <th className="px-5 py-4 text-left">Name</th>
              <th className="px-5 py-4 text-left">Category</th>
              <th className="px-5 py-4 text-right">MRP</th>
              <th className="px-5 py-4 text-right">Offer Price</th>
              <th className="px-5 py-4 text-center">Status</th>
              <th className="px-5 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="py-10 text-center text-text-secondary text-lg animate-pulse">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="7" className="py-10 text-center text-text-secondary">No products found.</td></tr>
            ) : products.map((prod, i) => (
              <tr key={prod._id} className={`${i % 2 === 0 ? 'bg-surface' : 'bg-surface-2'} hover:bg-white/5 transition-colors`}>
                <td className="px-5 py-4 border-b border-border text-center">
                  {prod.image ? <img src={prod.image} alt={prod.name} className="w-12 h-12 object-cover rounded-lg mx-auto shadow-sm" /> : <div className="w-12 h-12 bg-surface-2 rounded-lg mx-auto flex items-center justify-center text-[10px] text-text-secondary font-bold border border-border">No Img</div>}
                </td>
                <td className="px-5 py-4 border-b border-border text-sm font-bold text-white">{prod.name}</td>
                <td className="px-5 py-4 border-b border-border text-sm">
                  <span className="bg-primary/10 text-primary border border-primary/20 font-semibold text-xs px-2 py-1 rounded-full">{prod.category?.name || '—'}</span>
                </td>
                <td className="px-5 py-4 border-b border-border text-sm font-black text-text-secondary text-right line-through">₹{prod.mrp}</td>
                <td className="px-5 py-4 border-b border-border text-sm font-black text-primary text-right">₹{prod.actualPrice}</td>
                <td className="px-5 py-4 border-b border-border text-center">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${prod.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-surface-2 text-text-secondary border-border'}`}>
                    {prod.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-5 py-4 border-b border-border text-center">
                  <button onClick={() => openEdit(prod)} className="text-primary hover:text-white mr-4 transition hover:scale-110 inline-block"><FaEdit /></button>
                  <button onClick={() => handleDelete(prod._id)} className="text-red-500 hover:text-red-400 transition hover:scale-110 inline-block"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="glass-panel w-full max-w-lg border border-white/10 flex flex-col max-h-[90vh] animate-fade-in-up">
            <div className="bg-fire-gradient px-6 py-4 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-heading font-bold text-white">{editId ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={closeModal} className="text-white/80 hover:text-white text-xl transition-colors"><FaTimes /></button>
            </div>
            <div className="overflow-y-auto p-6">
              <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-primary mb-1">Name *</label>
                  <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="input-fire" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">MRP (₹) *</label>
                  <input required type="number" value={form.mrp} onChange={e => setForm({ ...form, mrp: e.target.value })}
                    className="input-fire" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">Category *</label>
                  <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="input-fire">
                    <option value="">Select...</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                    <p className="text-xs text-text-secondary mb-1">Offer Price</p>
                    <p className="text-sm font-bold text-white">Autocalculated globally based on MRP.</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-primary mb-1">YouTube Video URL (Optional)</label>
                  <input type="url" value={form.youtubeUrl} onChange={e => setForm({ ...form, youtubeUrl: e.target.value })}
                    className="input-fire" placeholder="https://www.youtube.com/watch?v=..." />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-primary mb-1">Image (Optional)</label>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
                    className="input-fire file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="prodActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-5 h-5 accent-primary" />
                <label htmlFor="prodActive" className="text-sm font-bold text-white">Active</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 border border-border text-text-secondary font-bold py-2 rounded-lg hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-fire-gradient text-white font-bold py-2 rounded-lg shadow-primary hover:shadow-[0_0_15px_rgba(255,102,0,0.5)] transition">
                  {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
                </button>
              </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={confirmDeleteAction}
        onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
      />
    </>
  );
};

export default Products;