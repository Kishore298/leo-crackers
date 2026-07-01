import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const { admin } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    type: 'image',
    text: '',
    textColor: '#ffffff',
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center',
    posX: '50%',
    posY: '50%'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const fetchBanners = async () => {
    try {
      const { data } = await axios.get(process.env.REACT_APP_API_URL + '/banners', {
        headers: { Authorization: `Bearer ${admin?.token}` }
      });
      setBanners(data);
    } catch (err) {
      toast.error('Failed to load banners');
    }
  };

  useEffect(() => {
    fetchBanners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.type === 'image' && !imageFile && banners.length === 0) {
      return toast.error('Image is required for image banners');
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('image', imageFile);

    setLoading(true);
    try {
      await axios.post(process.env.REACT_APP_API_URL + '/banners', data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${admin?.token}` 
        }
      });
      toast.success('Banner added successfully');
      setFormData({ ...formData, text: '', title: '' });
      setImageFile(null);
      setImagePreview('');
      fetchBanners();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding banner');
    }
    setLoading(false);
  };

  const deleteBanner = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/banners/${id}`, {
          headers: { Authorization: `Bearer ${admin?.token}` }
        });
        toast.success('Banner deleted');
        fetchBanners();
      } catch (err) {
        toast.error('Error deleting banner');
      }
    }
  };

  return (
    <div className="animate-fade-in-up font-sans">
      <h1 className="text-3xl font-heading text-primary mb-6 font-black">Banner Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Form */}
        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Add New Banner</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Banner Type</label>
                <select name="type" value={formData.type} onChange={handleInputChange} className="input-fire">
                  <option value="image">Image Banner</option>
                  <option value="text">Text-only / Image with Text Overlay</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Title (Internal)</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="input-fire" placeholder="E.g., Diwali 2024" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-1">Background Image {formData.type === 'text' && '(Optional)'}</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="input-fire file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30" />
            </div>

            {formData.type === 'text' && (
              <div className="space-y-4 border-t border-white/10 pt-4">
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">Banner Text</label>
                  <textarea name="text" value={formData.text} onChange={handleInputChange} className="input-fire" rows="3" placeholder="Enter promotional text..." />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-primary mb-1">Text Color</label>
                    <input type="color" name="textColor" value={formData.textColor} onChange={handleInputChange} className="w-full h-11 border border-border bg-surface-2 rounded cursor-pointer p-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary mb-1">Font Size</label>
                    <input type="text" name="fontSize" value={formData.fontSize} onChange={handleInputChange} className="input-fire" placeholder="e.g., 32px" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary mb-1">Font Weight</label>
                    <select name="fontWeight" value={formData.fontWeight} onChange={handleInputChange} className="input-fire">
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="900">Black (900)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-primary mb-1">Position X</label>
                    <input type="text" name="posX" value={formData.posX} onChange={handleInputChange} className="input-fire" placeholder="e.g., 50%" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary mb-1">Position Y</label>
                    <input type="text" name="posY" value={formData.posY} onChange={handleInputChange} className="input-fire" placeholder="e.g., 50%" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary mb-1">Alignment</label>
                    <select name="textAlign" value={formData.textAlign} onChange={handleInputChange} className="input-fire">
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full btn-fire">
              {loading ? 'Saving...' : 'Save Banner'}
            </button>
          </form>
        </div>

        {/* Live Preview */}
        <div className="bg-surface-2 p-6 rounded-lg shadow-inner border border-white/5">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Live Preview</h2>
          <div className="rounded-2xl overflow-hidden shadow relative w-full h-[350px] border border-white/10 bg-black flex items-center justify-center">
            {imagePreview && (
               <img src={imagePreview} alt="preview" className="w-full h-full object-cover absolute inset-0 z-0 opacity-80" />
            )}
            {formData.type === 'text' && formData.text && (
               <div
                 className="absolute z-10"
                 style={{
                   left: formData.posX,
                   top: formData.posY,
                   transform: 'translate(-50%, -50%)',
                   color: formData.textColor,
                   fontSize: formData.fontSize,
                   fontWeight: formData.fontWeight,
                   textAlign: formData.textAlign,
                   textShadow: imagePreview ? '0px 2px 4px rgba(0,0,0,0.5)' : 'none',
                   width: '90%',
                   maxWidth: '800px',
                   whiteSpace: 'pre-wrap'
                 }}
               >
                 {formData.text}
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Existing Banners List */}
      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold text-white mb-4">Active Banners</h2>
        {banners.length === 0 ? (
          <p className="text-text-secondary">No banners found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((banner) => (
              <div key={banner._id} className="border border-white/10 rounded-xl p-4 relative bg-surface-2 flex flex-col justify-between h-[200px] overflow-hidden group">
                <div className="absolute inset-0 z-0 bg-black">
                  {banner.image && <img src={banner.image} alt="banner" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />}
                </div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-surface/80 px-2 py-1 rounded text-xs font-bold text-primary backdrop-blur-sm border border-white/5">{banner.type.toUpperCase()}</span>
                    <button onClick={() => deleteBanner(banner._id)} className="text-red-500 bg-surface/80 p-2 rounded-full hover:bg-red-500/20 border border-white/5 transition">
                      <FaTrash />
                    </button>
                  </div>
                  {banner.type === 'text' && (
                    <div className="mt-auto text-center font-bold text-lg p-2 bg-surface/80 rounded-lg backdrop-blur-md border border-white/10 text-white line-clamp-2">
                      {banner.text}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Banners;