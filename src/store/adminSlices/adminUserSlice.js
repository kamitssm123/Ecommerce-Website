import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios-instance";
import { userDetailActions } from "../userSlices/userDetailSlice";

const adminUserGet = createAsyncThunk(
  "adminUser/get",
  async (payload, thunkAPI) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${thunkAPI.getState().user.userInfo.token}`,
        },
      };
      const response = await axiosInstance.get(`/api/users/`, config);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data || err.message
      );
    }
  }
);

const adminUserDelete = createAsyncThunk(
  "adminUser/delete",
  async (id, thunkAPI) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${thunkAPI.getState().user.userInfo.token}`,
        },
      };
      const response = await axiosInstance.delete(
        `/api/users/delete/${id}/`,
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

const adminUserPut = createAsyncThunk(
  "adminUser/put",
  async (user, thunkAPI) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${thunkAPI.getState().user.userInfo.token}`,
        },
      };
      const response = await axiosInstance.put(
        `/api/users/update/${user._id}/`,
        user,
        config
      );
      thunkAPI.dispatch(userDetailActions.getUser(user._id));
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data || err.message
      );
    }
  }
);

const adminUserSlice = createSlice({
  name: "adminUser",
  initialState: { users: [], success: false, user: {} },
  reducers: {
    adminUserGetReset: (state, action) => {
      state = { users: [], user: {} };
    },
  },
  extraReducers: {
    [adminUserGet.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    [adminUserGet.fulfilled]: (state, action) => {
      state.loading = false;
      state.users = action.payload;
      state.error = null;
      state.success = false;
    },
    [adminUserGet.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    [adminUserDelete.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    [adminUserDelete.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    [adminUserDelete.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    [adminUserPut.pending]: (state, action) => {
      state.user.loading = true;
      state.user.error = null;
      state.user.success = false;
    },
    [adminUserPut.fulfilled]: (state, action) => {
      state.user.loading = false;
      state.user.error = null;
      state.user.success = true;
    },
    [adminUserPut.rejected]: (state, action) => {
      state.user.loading = false;
      state.user.error = action.payload;
      state.user.success = false;
    },
  },
});

export const adminUserActions = {
  ...adminUserSlice.actions,
  adminUserGet,
  adminUserDelete,
  adminUserPut,
};

export default adminUserSlice.reducer;
