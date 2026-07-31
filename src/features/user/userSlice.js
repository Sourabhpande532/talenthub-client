import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../../api/axiosHelper";
import toast from "react-hot-toast";

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
