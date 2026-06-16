import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaTimes } from 'react-icons/fa';
import ConfirmDialog from '../components/ConfirmDialog';

const API = 'http://localhost:5000/api/categories';

const initialForm = { name: '', description: '', isActive: true };

const Categories = () => {
  const { admin } = useSelector((state) => state.auth);
  const config = { headers: { Authorization: `Bearer ${admin?.token}` } };

  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, page, limit: 15 });
      const { data } = await axios.get(`${API}?${params}`, config);
      setCategories(data.categories);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, [search, page]);

  const openAdd = () => { setEditId(null); setForm(initialForm); setImageFile(null); setShowModal(true); };
  const openEdit = (cat) => { setEditId(cat._id); setForm({ name: cat.name, description: cat.description || '', isActive: cat.isActive }); setImageFile(null); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditId(null); setForm(initialForm); setImageFile(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
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
        await axios.put(`${API}/${editId}`, formData, submitConfig);
      } else {
        await axios.post(API, formData, submitConfig);
      }
      closeModal();
      fetchCategories();
      toast.success(editId ? 'Category updated successfully!' : 'Category created successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving category');
    }
    setSaving(false);
  };

  const handleDelete = (id) => {
    setConfirmDelete({ isOpen: true, id });
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete.id) return;
    try {
      await axios.delete(`${API}/${confirmDelete.id}`, config);
      fetchCategories();
      toast.success('Category deleted successfully!');
    } catch (err) { toast.error('Error deleting category'); }
    setConfirmDelete({ isOpen: false, id: null });
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black text-primary-dark">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">{total} categories total</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-fire-gradient text-white font-bold px-5 py-2.5 rounded-lg shadow-primary hover:shadow-primary-lg transition">
          <FaPlus /> Add Category
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-primary border border-border p-4 mb-4 flex gap-3 items-center">
        <FaSearch className="text-primary" />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 outline-none text-gray-700 bg-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-primary overflow-hidden border border-border">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-fire-gradient text-white text-xs uppercase tracking-wider">
              <th className="px-5 py-4 text-center">Image</th>
              <th className="px-5 py-4 text-left">Name</th>
              <th className="px-5 py-4 text-left">Slug</th>
              <th className="px-5 py-4 text-left">Description</th>
              <th className="px-5 py-4 text-center">Status</th>
              <th className="px-5 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="py-10 text-center text-gray-400 text-lg animate-pulse">Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan="6" className="py-10 text-center text-gray-400">No categories found.</td></tr>
            ) : categories.map((cat, i) => (
              <tr key={cat._id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-surface'} hover:bg-surface-2 transition`}>
                <td className="px-5 py-4 border-b border-border text-center">
                  {cat.image ? <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover rounded-lg mx-auto shadow-sm" /> : <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto flex items-center justify-center text-[10px] text-gray-400 font-bold border border-gray-200">No Img</div>}
                </td>
                <td className="px-5 py-4 border-b border-border text-sm font-bold text-primary-dark">{cat.name}</td>
                <td className="px-5 py-4 border-b border-border text-sm text-gray-500 font-mono">{cat.slug}</td>
                <td className="px-5 py-4 border-b border-border text-sm text-gray-600 max-w-xs truncate">{cat.description || '—'}</td>
                <td className="px-5 py-4 border-b border-border text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-5 py-4 border-b border-border text-center">
                  <button onClick={() => openEdit(cat)} className="text-primary hover:text-primary-dark mr-4 transition hover:scale-110 inline-block"><FaEdit /></button>
                  <button onClick={() => handleDelete(cat._id)} className="text-red-400 hover:text-red-600 transition hover:scale-110 inline-block"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center items-center gap-2 py-4 border-t border-border bg-surface">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-full font-bold text-sm transition ${p === page ? 'bg-fire-gradient text-white shadow-primary' : 'bg-white border border-border hover:border-primary text-gray-600'}`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-primary-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-fire-gradient px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-heading font-bold text-white">{editId ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={closeModal} className="text-white/80 hover:text-white text-xl"><FaTimes /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-primary-dark mb-1">Name *</label>
                <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-surface-2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary-dark mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3} className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-surface-2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary-dark mb-1">Image (Optional)</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
                  className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-surface-2" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })}
                  className="w-5 h-5 accent-primary" />
                <label htmlFor="isActive" className="text-sm font-bold text-primary-dark">Active</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 border border-border text-gray-600 font-bold py-2 rounded-lg hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-fire-gradient text-white font-bold py-2 rounded-lg shadow-primary hover:shadow-primary-lg transition">
                  {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        onConfirm={confirmDeleteAction}
        onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
      />
    </div>
  );
};

export default Categories;