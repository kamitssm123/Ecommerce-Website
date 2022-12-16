import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios-instance";

const getAllOrders = createAsyncThunk(
  "allOrders/get",
  async (payload, thunkAPI) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${thunkAPI.getState().user.userInfo.token}`,
        },
      };
      const response = await axiosInstance.get(`/api/orders/myorders/`, config);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data || err.message
      );
    }
  }
);

const getAllOrdersSlice = createSlice({
  name: "allOrders",
  initialState: { orders: [] },
  reducers: {
    getAllOrdersReset: (state, action) => {
      state.orders = [];
    },
  },
  extraReducers: {
    [getAllOrders.pending]: (state, action) => {
      state = { loading: true };
    },
    [getAllOrders.fulfilled]: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
      state.error = null;
    },
    [getAllOrders.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const getAllOrdersActions = {
  ...getAllOrdersSlice.actions,
  getAllOrders,
};

export default getAllOrdersSlice.reducer;
