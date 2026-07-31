import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../../api/axiosHelper";
import toast from "react-hot-toast";

export const applyToJob = createAsyncThunk(
  "applications/applyToJob",
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await API_URL.post(
        "/api/applications/apply",
        applicationData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to apply for job",
      );
    }
  },
);

export const withdrawApplication = createAsyncThunk(
  "applications/withdrawApplication",
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await API_URL.delete(
        `/api/applications/${applicationId}/withdraw`,
      );
      return { id: applicationId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to withdraw application",
      );
    }
  },
);

const initialState = {
  applicantsList: [],
  status: "idle",
  error: null,
};

const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    clearApplicants: (state) => {
      state.applicantsList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Apply
      .addCase(applyToJob.pending, (state) => {
        state.status = "loading";
      })
      .addCase(applyToJob.fulfilled, (state) => {
        state.status = "succeeded";
        toast.success("Successfully applied for the job!");
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.status = "failed";
        toast.error(action.payload);
      })
      // Withdraw
      .addCase(withdrawApplication.fulfilled, (state) => {
        toast.success("Application withdrawn successfully.");
      })
      .addCase(withdrawApplication.rejected, (state, action) => {
        toast.error(action.payload);
      });
  },
});
export const { clearApplicants } = applicationSlice.actions;
export default applicationSlice.reducer;
