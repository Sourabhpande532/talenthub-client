import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API_URL from "../../api/axiosHelper";

// Generate AI Interview Prep (Applicant)
export const generateInterviewPrep = createAsyncThunk(
  "ai/generateInterviewPrep",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await API_URL.post("/api/ai/interview-prep", { jobId });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate interview prep",
      );
    }
  },
);

// Ask AI Hiring Assistant (Recruiter)
export const askHiringAssistant = createAsyncThunk(
  "ai/askHiringAssistant",
  async ({ jobId, question }, { rejectWithValue }) => {
    try {
      const response = await API_URL.post("/api/ai/hiring-assistant", {
        jobId,
        question,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get AI answer",
      );
    }
  },
);

const initialState = {
  interviewPrepResult: null,
  hiringAssistantResult: null,
  jobDescriptionResult: null,
  status: "idle",
  error: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    clearAIResults: (state) => {
      state.interviewPrepResult = null;
      state.hiringAssistantResult = null;
      state.jobDescriptionResult = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Interview Prep
    builder
      .addCase(generateInterviewPrep.pending, (state) => {
        state.status = "loading";
        state.interviewPrepResult = null;
      })
      .addCase(generateInterviewPrep.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.interviewPrepResult = action.payload;
      })
      .addCase(generateInterviewPrep.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Hiring Assistant
      .addCase(askHiringAssistant.pending, (state) => {
        state.status = "loading";
        state.hiringAssistantResult = null;
      })
      .addCase(askHiringAssistant.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.hiringAssistantResult = action.payload;
      })
      .addCase(askHiringAssistant.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
export const { clearAIResults } = aiSlice.actions;
export default aiSlice.reducer;
