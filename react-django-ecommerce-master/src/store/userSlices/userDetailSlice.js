import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios-instance";
import { userActions } from "./userSlice";

const getUser = createAsyncThunk("userDetail/fetch", async (id, thunkAPI) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${thunkAPI.getState().user.userInfo.token}`,
      },
    };
    const response = await axiosInstance.get(`/api/users/${id}/`, config);
    return thunkAPI.fulfillWithValue(response.data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.detail || err.response.data || err.message);
  }
});

const updateUser = createAsyncThunk(
  "userDetail/update",
  async (user, thunkAPI) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${thunkAPI.getState().user.userInfo.token}`,
        },
      };
      const response = await axiosInstance.put(
        `/api/users/profile/update/`,
        user,
        config
      );

      thunkAPI.dispatch(userActions.userLoginState(response.data));
      thunkAPI.dispatch(userDetailActions.userReset())
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.detail || err.response.data || err.message);
    }
  }
);

const userDetailSlice = createSlice({
  name: "userDetail",
  initialState: { user: {} },
  reducers: {
    userReset: (state, action) => {
      state.user = {};
    },
  },
  extraReducers: {
    [getUser.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    [getUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    [getUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something Went Wrong!";
    },
    [updateUser.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    [updateUser.fulfilled]: (state, action) => {
      state.loading = false;
      /* state.success = true;
      state.userInfo = action.payload; */

      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    [updateUser.rejected]: (state, action) => {
      let stateNew = {
        loading: false,
        error: action.payload,
      };
      return stateNew;
    },
  },
});

export const userDetailActions = {
  ...userDetailSlice.actions,
  getUser,
  updateUser,
};

export default userDetailSlice.reducer;
