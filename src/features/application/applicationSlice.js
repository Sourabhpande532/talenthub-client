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

export const fetchApplicantsForJob = createAsyncThunk(
  "applications/fetchApplicantsForJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await API_URL.get(`/api/applications/job/${jobId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch applicants",
      );
    }
  },
);

export const updateApplicationStatus = createAsyncThunk(
  "applications/updateApplicationStatus",
  async ({ applicationId, status }, { rejectWithValue }) => {
    try {
      const response = await API_URL.patch(
        `/api/applications/${applicationId}/status`,
        { status },
      );
      return { id: applicationId, status: response.data.data.status };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status",
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
      })
      // Fetch Applicants (Recruiter)
      .addCase(fetchApplicantsForJob.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchApplicantsForJob.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.applicantsList = action.payload;
      })
      .addCase(fetchApplicantsForJob.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update Status (Recruiter)
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const index = state.applicantsList.findIndex(
          (app) => app._id === action.payload.id,
        );
        if (index !== -1) {
          state.applicantsList[index].status = action.payload.status;
        }
        toast.success(`Application marked as ${action.payload.status}`);
      });
  },
});
export const { clearApplicants } = applicationSlice.actions;
export default applicationSlice.reducer;
