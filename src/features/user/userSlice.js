import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../../api/axiosHelper";
import toast from "react-hot-toast";

// Fetch Dashboard (Automatically gets Applicant or Recruiter dashboard based on token backend)
export const fetchDashboard = createAsyncThunk(
  "user/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API_URL.get("/api/users/dashboard");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard",
      );
    }
  },
);

// Add Bookmark (Applicant)
export const addBookmark = createAsyncThunk(
  "user/addBookmark",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await API_URL.post("/api/users/bookmarks", { jobId });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add bookmark",
      );
    }
  },
);

// Fetch Applied Jobs (Applicant specific)
export const fetchAppliedJobs = createAsyncThunk(
  "user/fetchAppliedJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API_URL.get("/api/applications/me");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch applied jobs",
      );
    }
  },
);

// Update Profile
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await API_URL.put("/api/users/profile", profileData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile",
      );
    }
  },
);

// Remove Bookmark (Applicant)
export const removeBookmark = createAsyncThunk(
  "user/removeBookmark",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await API_URL.delete(`/api/users/bookmarks/${jobId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove bookmark",
      );
    }
  },
);

const initialState = {
  dashboardData: null,
  appliedJobs: [],
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchDashboard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Applied Jobs
      .addCase(fetchAppliedJobs.fulfilled, (state, action) => {
        state.appliedJobs = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state) => {
        toast.success("Profile updated successfully");
      })
      .addCase(updateProfile.rejected, (state, action) => {
        toast.error(action.payload);
      })
      // Bookmarks
      .addCase(addBookmark.fulfilled, (state) => {
        toast.success("Job bookmarked");
      })
      .addCase(removeBookmark.fulfilled, (state) => {
        toast.success("Bookmark removed");
      });
  },
});

export default userSlice.reducer;
