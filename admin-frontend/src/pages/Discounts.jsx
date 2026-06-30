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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <h1 className="text-3xl font-heading text-primary font-black mb-6">Global Discount</h1>
      <div className="glass-panel p-8 max-w-md border-t-[3px] border-primary">
        <div className="mb-4">
          <label className="block text-primary text-sm font-bold mb-2">Discount Percentage (%)</label>
          <input
            type="number"
            className="input-fire"
            value={discount.discountPercentage}
            onChange={(e) => setDiscount({ ...discount, discountPercentage: e.target.value })}
          />
        </div>
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            className="mr-3 leading-tight h-5 w-5 accent-primary rounded bg-surface-2 border-border"
            checked={discount.isActive}
            onChange={(e) => setDiscount({ ...discount, isActive: e.target.checked })}
          />
          <label className="text-white font-bold">Is Active</label>
        </div>
        <button 
          onClick={saveDiscount}
          className="btn-fire w-full"
        >
          Save Discount
        </button>
      </div>
    </div>
  );
};
export default Discounts;