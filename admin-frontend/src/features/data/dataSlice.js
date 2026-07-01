import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL + '/';

const getConfig = (thunkAPI) => {
  const token = thunkAPI.getState().auth.admin?.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

// These thunks are kept for backward-compatibility (Dashboard uses direct axios now)
// Kept minimal - individual pages manage their own state for full filter/pagination control
export const fetchCategories = createAsyncThunk('data/fetchCategories', async (_, thunkAPI) => {
  try {
    const { data } = await axios.get(API_URL + 'categories?limit=100', getConfig(thunkAPI));
    return data.categories || data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchProducts = createAsyncThunk('data/fetchProducts', async (_, thunkAPI) => {
  try {
    const { data } = await axios.get(API_URL + 'products?limit=100', getConfig(thunkAPI));
    return data.products || data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchOrders = createAsyncThunk('data/fetchOrders', async (_, thunkAPI) => {
  try {
    const { data } = await axios.get(API_URL + 'orders?limit=100', getConfig(thunkAPI));
    return data.orders || data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const dataSlice = createSlice({
  name: 'data',
  initialState: {
    categories: [],
    products: [],
    orders: [],
    isLoading: false,
    isError: false,
    message: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.isLoading = false; state.categories = action.payload; })
      .addCase(fetchCategories.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      .addCase(fetchProducts.pending, (state) => { state.isLoading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.isLoading = false; state.products = action.payload; })
      .addCase(fetchProducts.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      .addCase(fetchOrders.pending, (state) => { state.isLoading = true; })
      .addCase(fetchOrders.fulfilled, (state, action) => { state.isLoading = false; state.orders = action.payload; })
      .addCase(fetchOrders.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; });
  }
});

export default dataSlice.reducer;