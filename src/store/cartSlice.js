import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axios-instance";

const addToCart = createAsyncThunk(
  "cart/addItem",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/api/products/" + payload.id);
      return thunkAPI.fulfillWithValue({ ...response.data, qty: payload.qty });
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data || err.message
      );
    }
  }
);

const initialCart = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const cartSlice = createSlice({
  name: "cart",
  initialState: { cartItems: initialCart },
  reducers: {
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (each) => each.product !== action.payload
      );

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    cartReset: (state, action) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
  },
  extraReducers: {
    [addToCart.fulfilled]: (state, action) => {
      const item = { ...action.payload, product: action.payload._id };
      delete item._id;

      const isExists = state.cartItems.find(
        (each) => each.product === item.product
      );

      if (isExists) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === item.product ? item : x
        );
      } else {
        state.cartItems.push(item);
      }

      state.error = null;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    [addToCart.rejected]: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const cartActions = { ...cartSlice.actions, addToCart };

export default cartSlice.reducer;
