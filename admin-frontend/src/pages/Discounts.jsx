import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Discounts = () => {
  const [discount, setDiscount] = useState({ discountPercentage: 0, isActive: false });
  const { admin } = useSelector((state) => state.auth);

  const config = {
    headers: { Authorization: `Bearer ${admin?.token}` }
  };

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/discounts', config);
        setDiscount({ discountPercentage: data.discountPercentage, isActive: data.isActive });
      } catch (err) {
        console.error(err);
      }
    };
    fetchDiscount();
  }, []);

  const saveDiscount = async () => {
    try {
      await axios.post('http://localhost:5000/api/discounts', discount, config);
      toast.success('Discount Saved!');
    } catch (err) {
      toast.error('Error saving discount');
    }
  };

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl font-heading text-primary-dark mb-6">Global Discount</h1>
      <div className="bg-white p-8 rounded-lg shadow-primary max-w-md border-t-4 border-primary">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Discount Percentage (%)</label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            value={discount.discountPercentage}
            onChange={(e) => setDiscount({ ...discount, discountPercentage: e.target.value })}
          />
        </div>
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            className="mr-2 leading-tight h-5 w-5 text-primary rounded focus:ring-primary"
            checked={discount.isActive}
            onChange={(e) => setDiscount({ ...discount, isActive: e.target.checked })}
          />
          <label className="text-gray-700 font-bold">Is Active</label>
        </div>
        <button 
          onClick={saveDiscount}
          className="bg-fire-gradient text-white font-bold py-2 px-4 rounded hover:bg-fire-gradient-hover transition w-full shadow-primary"
        >
          Save Discount
        </button>
      </div>
    </div>
  );
};
export default Discounts;