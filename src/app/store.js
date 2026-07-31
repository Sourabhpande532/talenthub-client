import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import jobReducer from "../features/jobs/jobSlice";
import applicationReducer from "../features/application/applicationSlice";
import userReducer from "../features/user/userSlice";

import aiReducer from "../features/ai/aiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    applications: applicationReducer,
    user: userReducer,
    ai: aiReducer,
  },
});
