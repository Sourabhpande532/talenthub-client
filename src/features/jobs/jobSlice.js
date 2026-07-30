import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import API_URL from "../../api/axiosHelper";

// Fetch jobs (with query params for searching/filtering)
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (queryString = "", { rejectWithValue }) => {
    try {
      const response = await API_URL.get(`/api/jobs${queryString}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch jobs",
      );
    }
  },
);

const initialState = {
  jobsList: [],
  currentJob: null,
  similarJobs: [],
  status: "idle",
  currentJobStatus: "idle",
  error: null,
};
const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearCurrentJob: (state) => {
      state.currentJob = null;
      state.currentJobStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    // Fetch Jobs
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jobsList = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});
export const { clearCurrentJob } = jobSlice.actions;

export default jobSlice.reducer;
