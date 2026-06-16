import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ConfirmDialog from '../components/ConfirmDialog';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });
  const { admin } = useSelector((state) => state.auth);

  const config = { headers: { Authorization: `Bearer ${admin?.token}` } };

  const fetchBanners = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/banners', config);
      setBanners(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchBanners(); }, []);

  const addBanner = async () => {
    if (!file || !title) return;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/banners', formData, {
        headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
      });
      setFile(null);
      setTitle('');
      fetchBanners();
      toast.success('Banner added successfully!');
    } catch (err) { toast.error('Error adding banner'); }
    setLoading(false);
  };

  const deleteBanner = (id) => {
    setConfirmDelete({ isOpen: true, id });
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete.id) return;
    try {
      await axios.delete(`http://localhost:5000/api/banners/${confirmDelete.id}`, config);
      fetchBanners();
      toast.success('Banner deleted successfully!');
    } catch (err) { toast.error('Error deleting banner'); }
    setConfirmDelete({ isOpen: false, id: null });
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-heading text-primary-dark">Manage Banners</h1>
      </div>
      
      <div className="bg-surface-2 p-6 rounded-lg shadow-primary border border-border mb-8">
        <h2 className="text-xl font-bold text-primary-dark mb-4">Add New Banner</h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:border-primary" />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">Image</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full px-3 py-2 border border-border bg-white rounded focus:outline-none focus:border-primary" />
          </div>
          <button onClick={addBanner} disabled={loading} className="bg-fire-gradient text-white font-bold py-2 px-6 rounded hover:bg-fire-gradient-hover transition h-[42px] shadow-primary">
            {loading ? 'Adding...' : 'Add Banner'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.length === 0 ? <p>No banners uploaded.</p> : banners.map(banner => (
          <div key={banner._id} className="bg-white rounded-lg shadow-primary overflow-hidden border border-border">
            <img src={banner.image} alt={banner.title} className="w-full h-40 object-cover" />
            <div className="p-4 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">{banner.title}</h3>
              <button onClick={() => deleteBanner(banner._id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title="Delete Banner"
        message="Are you sure you want to delete this banner? This action cannot be undone."
        onConfirm={confirmDeleteAction}
        onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
      />
    </div>
  );
};
export default Banners;