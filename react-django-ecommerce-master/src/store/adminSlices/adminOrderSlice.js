import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios-instance";

const getOrders = createAsyncThunk(
  "adminOrder/getAll",
  async (payload, thunkAPI) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${thunkAPI.getState().user.userInfo.token}`,
        },
      };
      const response = await axiosInstance.get(`/api/orders/`, config);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data || err.message
      );
    }
  }
);

const deliverOrder = createAsyncThunk(
  "adminOrder/deliver",
  async (order, thunkAPI) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${thunkAPI.getState().user.userInfo.token}`,
        },
      };
      const response = await axiosInstance.put(
        `/api/orders/${order._id}/deliver/`,
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

const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState: { orders: [], deliver: {} },
  reducers: {
    adminOrderReset: (state, action) => {
      state.deliver = {};
    },
  },
  extraReducers: {
    [getOrders.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    [getOrders.fulfilled]: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
      state.error = null;
    },
    [getOrders.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [deliverOrder.pending]: (state, action) => {
      state.deliver.loading = true;
      state.deliver.error = null;
      state.deliver.success = false;
    },
    [deliverOrder.fulfilled]: (state, action) => {
      state.deliver.loading = false;
      state.deliver.success = true;
      state.deliver.error = null;
    },
    [deliverOrder.rejected]: (state, action) => {
      state.deliver.loading = false;
      state.deliver.success = false;
      state.deliver.error = action.payload;
    },
  },
});

export const adminOrderActions = {
  ...adminOrderSlice.actions,
  getOrders,
  deliverOrder,
};

export default adminOrderSlice.reducer;
