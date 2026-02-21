import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { connectSocket, disconnectSocket } from "../../lib/socket";
import { toast } from "react-toastify";

// =====================================
// ✅ GET USER
// =====================================
export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/user/me");

      if (res.data?.user?._id) {
        connectSocket(res.data.user._id);
      }

      return res.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

// =====================================
// ✅ LOGIN
// =====================================
export const login = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/user/sign-in", data);

      if (res.data?.user?._id) {
        connectSocket(res.data.user._id);
      }

      toast.success(res.data?.message || "Logged in successfully ✅");
      return res.data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed ❌");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// =====================================
// ✅ SIGNUP
// =====================================
export const signup = createAsyncThunk(
  "auth/signup",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/user/sign-up", data);

      if (res.data?.user?._id) {
        connectSocket(res.data.user._id);
      }

      toast.success(res.data?.message || "Account created ✅");
      return res.data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed ❌");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Signup failed"
      );
    }
  }
);

// =====================================
// ✅ UPDATE PROFILE  (🔥 NEW ADD)
// =====================================
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, thunkAPI) => {
    try {
      const res = await axiosInstance.put("/user/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data?.message || "Profile updated successfully ✅");

      return res.data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed ❌");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Update failed"
      );
    }
  }
);

// =====================================
// ✅ LOGOUT
// =====================================
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.get("/user/sign-out");
      disconnectSocket();
      toast.success("Logged out successfully ✅");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed ❌");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Logout failed"
      );
    }
  }
);

// =====================================
// ✅ SLICE
// =====================================
const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    isUpdatingProfile: false,   // 🔥 Added
    onlineUsers: [],
  },

  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // GET USER
      .addCase(getUser.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isCheckingAuth = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isLoggingIn = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })

      // SIGNUP
      .addCase(signup.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isSigningUp = false;
      })
      .addCase(signup.rejected, (state) => {
        state.isSigningUp = false;
      })

      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isUpdatingProfile = false;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isUpdatingProfile = false;
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
      });
  },
});

export const { setOnlineUsers } = authSlice.actions;
export default authSlice.reducer;