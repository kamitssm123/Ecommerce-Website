import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios-instance";

const deleteProduct = createAsyncThunk(
  "adminProduct/delete",
  async (id, thunkAPI) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${thunkAPI.getState().user.userInfo.token}`,
        },
      };
      const response = await axiosInstance.delete(
        `/api/products/delete/${id}/`,
        config
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data || err.message
      );
    }
  }
);

const createProduct = createAsyncThunk(
  "adminProduct/create",
  async (id, thunkAPI) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${thunkAPI.getState().user.userInfo.token}`,
        },
      };
      const response = await axiosInstance.post(
        `/api/products/create/`,
        {},
        config
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data || err.message
      );
    }
  }
);

const updateProduct = createAsyncThunk(
  "adminProduct/update",
  async (product, thunkAPI) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${thunkAPI.getState().user.userInfo.token}`,
        },
      };
      const response = await axiosInstance.put(
        `/api/products/update/${product._id}/`,
        product,
        config
      );

      //thunkAPI.dispatch()
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data || err.message
      );
    }
  }
);

const adminProductSlice = createSlice({
  name: "adminProduct",
  initialState: { create: {}, update: {} },
  reducers: {
    adminProductReset: (state, action) => {
      state.create = {};
      state.update = {};
    },
  },
  extraReducers: {
    [deleteProduct.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    [deleteProduct.fulfilled]: (state, action) => {
      state.success = true;
      state.error = null;
      state.loading = false;
    },
    [deleteProduct.rejected]: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    [createProduct.pending]: (state, action) => {
      state.create.loading = true;
      state.create.error = null;
      state.create.success = false;
      state.create.product = null;
    },
    [createProduct.fulfilled]: (state, action) => {
      state.create.success = true;
      state.create.error = null;
      state.create.loading = false;
      state.create.product = action.payload;
    },
    [createProduct.rejected]: (state, action) => {
      state.create.loading = false;
      state.create.success = false;
      state.create.error = action.payload;
    },
    [updateProduct.pending]: (state, action) => {
      state.update.loading = true;
      state.update.error = null;
      state.update.success = false;
      state.update.product = null;
    },
    [updateProduct.fulfilled]: (state, action) => {
      state.update.success = true;
      state.update.error = null;
      state.update.loading = false;
      state.update.product = action.payload;
    },
    [updateProduct.rejected]: (state, action) => {
      state.update.loading = false;
      state.update.success = false;
      state.update.error = action.payload;
    },
  },
});

export const adminProductActions = {
  ...adminProductSlice.actions,
  deleteProduct,
  createProduct,
  updateProduct,
};

export default adminProductSlice.reducer;
