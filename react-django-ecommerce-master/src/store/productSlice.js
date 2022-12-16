import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axios-instance";

const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async ({ keyword, pageNo }, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/api/products/?search=${keyword}&page=${pageNo}`
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data || err.message
      );
    }
  }
);

const fetchSingleProduct = createAsyncThunk(
  "product/fetchSingleProduct",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/api/products/${payload}/`);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data || err.message
      );
    }
  }
);

const fetchTopRated = createAsyncThunk(
  "product/top",
  async (payload, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/api/products/top/");
      return thunkAPI.fulfillWithValue(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data || err.message
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    error: null,
    loading: true,
    product: {},
    top: { products: [] },
  },
  reducers: {},
  extraReducers: {
    [fetchProducts.fulfilled]: (state, action) => {
      state.products = action.payload.products;
      state.page = action.payload.page;
      state.pages = action.payload.pages;
      state.error = null;
      state.loading = false;
    },
    [fetchProducts.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [fetchSingleProduct.pending]: (state) => {
      state.loading = true;
      state.error = null;
      state.product = {};
    },
    [fetchSingleProduct.fulfilled]: (state, action) => {
      state.product = action.payload;
      state.error = null;
      state.loading = false;
    },
    [fetchSingleProduct.rejected]: (state, action) => {
      state.error = action.payload || "Something Went Wrong...";
      state.loading = false;
    },
    [fetchTopRated.pending]: (state) => {
      state.top.loading = true;
      state.top.error = null;
      state.top.products = [];
    },
    [fetchTopRated.fulfilled]: (state, action) => {
      state.top.products = action.payload;
      state.top.error = null;
      state.top.loading = false;
    },
    [fetchTopRated.rejected]: (state, action) => {
      state.top.error = action.payload || "Something Went Wrong...";
      state.top.loading = false;
    },
  },
});

export const productActions = {
  ...productSlice.actions,
  fetchProducts,
  fetchSingleProduct,
  fetchTopRated,
};

export default productSlice.reducer;
