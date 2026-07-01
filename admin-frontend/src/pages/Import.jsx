import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Import = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { admin } = useSelector((state) => state.auth);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);

    try {
      const { data } = await axios.post(process.env.REACT_APP_API_URL + '/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${admin?.token}`
        }
      });
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error importing data');
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl font-heading text-primary font-black mb-6">Import Data</h1>
      <div className="glass-panel p-8 max-w-lg border-t-[3px] border-primary">
        <p className="text-text-secondary mb-6 font-sans">
          Upload an Excel, CSV, or PDF file to update categories and products.
          The file should contain columns: <strong className="text-white">category_name</strong>, <strong className="text-white">product_name</strong>, <strong className="text-white">actualPrice</strong>, and <strong className="text-white">description</strong> (or match the generated PDF format).
        </p>
        <div className="mb-6">
          <label className="block text-primary font-bold mb-2">Upload File</label>
          <input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/pdf, .pdf"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-border bg-surface-2 rounded-lg focus:outline-none focus:border-primary text-text file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
          />
        </div>
        <button 
          onClick={uploadFile}
          disabled={!file || loading}
          className={`w-full font-bold py-3 px-4 rounded-xl transition-all duration-300 ${file && !loading ? 'bg-fire-gradient text-white hover:bg-fire-gradient-hover shadow-primary hover:-translate-y-1' : 'bg-surface-2 text-text-secondary cursor-not-allowed border border-white/5'}`}
        >
          {loading ? 'Importing...' : 'Upload and Import'}
        </button>
      </div>
    </div>
  );
};
export default Import;