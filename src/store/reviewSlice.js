import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axios-instance";

const createReview = createAsyncThunk(
  "review/createReview",
  async ({ productId, review }, thunkAPI) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${thunkAPI.getState().user.userInfo.token}`,
        },
      };
      const response = await axiosInstance.post(
        `/api/products/${productId}/reviews/`,
        review,
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

const reviewSlice = createSlice({
  name: "review",
  initialState: {},
  reducers: {
    reviewReset: (state, action) => {
      state = {};
    },
  },
  extraReducers: {
    [createReview.pending]: (state, action) => {
      state.error = null;
      state.success = false;
      state.loading = true;
    },
    [createReview.fulfilled]: (state, action) => {
      state.success = true;
      state.error = null;
      state.loading = false;
    },
    [createReview.rejected]: (state, action) => {
      state.success = false;
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const reviewActions = {
  ...reviewSlice.actions,
  createReview,
};

export default reviewSlice.reducer;
