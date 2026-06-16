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
      const { data } = await axios.post('http://localhost:5000/api/import', formData, {
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
      <h1 className="text-3xl font-heading text-primary-dark mb-6">Import Data</h1>
      <div className="bg-surface-2 p-8 rounded-lg shadow-primary-lg max-w-lg border border-border">
        <p className="text-gray-700 mb-6 font-sans">
          Upload an Excel or CSV file to update categories and products.
          The file should contain columns: <strong>category_name</strong>, <strong>product_name</strong>, <strong>actualPrice</strong>, and <strong>description</strong>.
        </p>
        <div className="mb-6">
          <label className="block text-primary-dark font-bold mb-2">Upload File</label>
          <input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-border bg-white rounded focus:outline-none focus:border-primary"
          />
        </div>
        <button 
          onClick={uploadFile}
          disabled={!file || loading}
          className={`w-full font-bold py-3 px-4 rounded transition shadow-primary ${file && !loading ? 'bg-fire-gradient text-white hover:bg-fire-gradient-hover' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {loading ? 'Importing...' : 'Upload and Import'}
        </button>
      </div>
    </div>
  );
};
export default Import;