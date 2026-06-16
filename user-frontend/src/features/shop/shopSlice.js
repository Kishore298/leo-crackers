import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/public/';

export const fetchHomeData = createAsyncThunk('shop/fetchHomeData', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL + 'home');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const loadCart = () => {
  try { return JSON.parse(localStorage.getItem('leo_cart')) || []; } catch { return []; }
};

export const shopSlice = createSlice({
  name: 'shop',
  initialState: {
    banners: [],
    categories: [],
    cart: loadCart(),
    isLoading: false,
    isError: false,
    message: ''
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cart.find(x => x.product === item.product);
      if (existItem) {
        state.cart = state.cart.map(x => x.product === existItem.product ? { ...x, quantity: x.quantity + 1 } : x);
      } else {
        state.cart.push(item);
      }
      localStorage.setItem('leo_cart', JSON.stringify(state.cart));
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(x => x.product !== action.payload);
      localStorage.setItem('leo_cart', JSON.stringify(state.cart));
    },
    clearCart: (state) => {
      state.cart = [];
      localStorage.removeItem('leo_cart');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => { state.isLoading = true; })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.banners = action.payload.banners;
        state.categories = action.payload.categories;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { addToCart, removeFromCart, clearCart } = shopSlice.actions;
export default shopSlice.reducer;