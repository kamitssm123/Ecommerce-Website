import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios-instance";
import { cartActions } from "../cartSlice";

const getOrderById = createAsyncThunk("order/create", async (id, thunkAPI) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${thunkAPI.getState().user.userInfo.token}`,
      },
    };
    const response = await axiosInstance.get(`/api/orders/${id}/`, config);
    thunkAPI.dispatch(cartActions.cartReset());
    return thunkAPI.fulfillWithValue(response.data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.detail || err.response.data || err.message);
  }
});

const eachOrderSlice = createSlice({
  name: "order",
  initialState: { loading: true, order: [] },
  reducers: {
    getOrderByIdReset: (state, action) => {
      state = {};
    },
  },
  extraReducers: {
    [getOrderById.pending]: (state, action) => {
      state.loading = true;
    },
    [getOrderById.fulfilled]: (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.error = null;
    },
    [getOrderById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const eachOrderActions = { ...eachOrderSlice.actions, getOrderById };

/* Slice no. 2 */

const orderPay = createAsyncThunk(
  "orderPay/paying",
  async ({ id, paymentResult }, thunkAPI) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${thunkAPI.getState().user.userInfo.token}`,
        },
      };
      const response = await axiosInstance.put(
        `/api/orders/${id}/pay/`,
        paymentResult,
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

const orderPaySlice = createSlice({
  name: "orderPay",
  initialState: {},
  reducers: {
    orderPayReset: (state, action) => {
      state = {};
    },
  },
  extraReducers: {
    [orderPay.pending]: (state, action) => {
      state.loading = true;
      state.success = false;
    },
    [orderPay.fulfilled]: (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    [orderPay.rejected]: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
  },
});

export const orderPayActions = { ...orderPaySlice.actions, orderPay };

export const orderPayReducer = orderPaySlice.reducer;

export default eachOrderSlice.reducer;
