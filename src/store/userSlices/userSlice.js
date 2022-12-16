import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios-instance";
import { adminUserActions } from "../adminSlices/adminUserSlice";
import { getAllOrdersActions } from "../orderSlices/getAllOrdersSlice";

const userLogin = createAsyncThunk("user/login", async (payload, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/api/users/login/", {
      username: payload.email,
      password: payload.password,
    });

    /* if (!response.data) {
      throw new Error("Something went wrong!");
    } */
    return thunkAPI.fulfillWithValue(response.data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.detail || err.response.data || err.message);
  }
});

const userRegister = createAsyncThunk(
  "user/register",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/api/users/register/", {
        ...payload,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.detail || err.response.data || err.message);
    }
  }
);

const userLogout = createAsyncThunk(
  "user/logout",
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(getAllOrdersActions.getAllOrdersReset());
    thunkAPI.dispatch(userActions.userLogoutRed());
    thunkAPI.dispatch(adminUserActions.adminUserGetReset());
  }
);

const initialUserInfo = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const userSlice = createSlice({
  name: "user",
  initialState: { userInfo: initialUserInfo },
  reducers: {
    userLogoutRed: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
    userLoginState: (state, action) => {
      state.userInfo = action.payload;
    },
  },
  extraReducers: {
    [userLogin.pending]: (state, action) => {
      state.loading = true;
    },
    [userLogin.fulfilled]: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      state.error = null;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    [userLogin.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [userRegister.pending]: (state, action) => {
      state.loading = true;
    },
    [userRegister.fulfilled]: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      state.error = null;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    [userRegister.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const userActions = {
  ...userSlice.actions,
  userLogin,
  userRegister,
  userLogout,
};

export default userSlice.reducer;
