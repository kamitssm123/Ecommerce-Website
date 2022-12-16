import { createSlice } from "@reduxjs/toolkit";

const initialShip = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};
const initialPay = localStorage.getItem("paymentMethod")
  ? JSON.parse(localStorage.getItem("paymentMethod"))
  : {};

const shippingSlice = createSlice({
  name: "shipping",
  initialState: { shippingAddress: initialShip, paymentMethod: initialPay },
  reducers: {
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("shippingAddress", JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("paymentMethod", JSON.stringify(action.payload));
    },
  },
  extraReducers: {},
});

export const checkoutActions = shippingSlice.actions;

export default shippingSlice.reducer;
