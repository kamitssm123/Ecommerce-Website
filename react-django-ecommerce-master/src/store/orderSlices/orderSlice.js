import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios-instance";
import { cartActions } from "../cartSlice";

const createOrder = createAsyncThunk(
  "order/create",
  async (order, thunkAPI) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${thunkAPI.getState().user.userInfo.token}`,
        },
      };
      const response = await axiosInstance.post(
        `/api/orders/add/`,
        order,
        config
      );
      thunkAPI.dispatch(cartActions.cartReset());
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data || err.message
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {},
  reducers: {
    createOrderReset: (state, action) => {
      state = {};
    },
  },
  extraReducers: {
    [createOrder.pending]: (state, action) => {
      state = { loading: true };
    },
    [createOrder.fulfilled]: (state, action) => {
      state.loading = false;
      state.success = true;
      state.order = action.payload;
      state.error = null;
    },
    [createOrder.rejected]: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
  },
});

export const orderActions = { ...orderSlice.actions, createOrder };

export default orderSlice.reducer;
