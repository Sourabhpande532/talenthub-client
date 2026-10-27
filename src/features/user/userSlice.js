import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../../api/axiosHelper";
import toast from "react-hot-toast";

// Fetch User Profile (populates bookmarks and returns fresh user data)
export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API_URL.get("/api/users/profile");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

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
        if (!state.dashboardData) {
          state.status = "loading";
        }
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
      })
      // Instant sync when Recruiter updates an application status
      .addCase("applications/updateApplicationStatus/fulfilled", (state, action) => {
        if (state.dashboardData?.recentApplications && action.payload) {
          const { id, status: newStatus } = action.payload;
          const appItem = state.dashboardData.recentApplications.find(
            (a) => a._id === id,
          );
          if (appItem) {
            const prevStatus = appItem.status;
            appItem.status = newStatus;
            if (state.dashboardData.stats) {
              if (prevStatus !== "Shortlisted" && newStatus === "Shortlisted") {
                state.dashboardData.stats.totalShortlisted =
                  (state.dashboardData.stats.totalShortlisted || 0) + 1;
              } else if (
                prevStatus === "Shortlisted" &&
                newStatus !== "Shortlisted"
              ) {
                state.dashboardData.stats.totalShortlisted = Math.max(
                  0,
                  (state.dashboardData.stats.totalShortlisted || 1) - 1,
                );
              }
            }
          }
        }
      });
  },
});

export default userSlice.reducer;
