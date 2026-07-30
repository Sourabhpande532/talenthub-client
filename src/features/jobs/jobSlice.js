/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import API_URL from "../../api/axiosHelper";

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
  reducers: {},
});

export default jobSlice.reducer;
