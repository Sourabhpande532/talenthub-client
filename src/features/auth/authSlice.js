import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../../api/axiosHelper";
import toast from "react-hot-toast";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API_URL.post("/auth/register", userData);
      console.log("register login", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API_URL.post("/auth/login", credentials);
      console.log("response login:", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid email or password",
      );
    }
  },
);

const getUserFromLocalStorage = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

const initialState = {
  user: getUserFromLocalStorage(),
  token: localStorage.getItem("token") || null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },

  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
        toast.success("Registration successful! Please login.");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        const user = { ...action.payload.user };
        const tempResume = localStorage.getItem("temp_resume");
        if (tempResume && user.role === "Applicant") {
          user.resume = tempResume;
          localStorage.removeItem("temp_resume");
        }
        state.user = user;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Logged in successfully!");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
