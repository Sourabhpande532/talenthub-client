import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API_URL from "../../api/axiosHelper";

const buildClientInterviewPrepFallback = (job) => {
  const title = job?.title || "Software Engineer";
  const company =
    job?.company ||
    job?.companyName ||
    job?.recruiter?.companyName ||
    "the hiring organization";
  const experience = job?.experience || "relevant";
  const skills =
    Array.isArray(job?.skills) && job.skills.length > 0
      ? job.skills.map((s) => s.replace(/,$/, "").trim()).filter(Boolean)
      : ["React", "Node.js", "System Design", "REST APIs"];

  const s1 = skills[0] || "core application development";
  const s2 = skills[1] || "state management and API integration";
  const s3 = skills[2] || "performance optimization and testing";

  return `Interview Questions

1. How have you designed and scaled production features using ${s1} in a ${experience} engineering role?
2. Walk through a challenging technical bug or performance issue you diagnosed when working with ${s2}.
3. How do you structure error handling, data validation, and clean architecture when working with ${s3}?
4. For this ${title} position at ${company}, how would you balance rapid feature delivery with long-term code maintainability?
5. Describe a system or feature you built end-to-end—what trade-offs did you make, and how did you verify reliability in production?

Topics to Revise

${skills.slice(0, 5).map((skill) => `- ${skill} core concepts, architectural patterns, and real-world debugging`).join("\n")}
- End-to-end system design and API integration best practices for ${title}

Preparation Tips

Tailor your technical walkthroughs directly to ${company}'s stack (${skills.slice(0, 4).join(", ")}) and the ${experience} experience level expected for ${title}. Prepare 2–3 concise STAR-format examples highlighting measurable engineering impact, clean code decisions, and collaboration across teams.`;
};

const buildClientHiringFallback = (job, applications = [], question = "") => {
  const jobTitle = job?.title || "this role";
  const validApps = (applications || []).filter((a) => a && a.applicant);

  if (validApps.length === 0) {
    return `There are currently no applicant profiles available for ${jobTitle}. Once candidates submit applications, ask me to rank top profiles, compare skills, or suggest who to interview first.`;
  }

  const qLower = (question || "").toLowerCase();
  const jobSkills = (job?.skills || []).map((s) => s.toLowerCase().trim());

  const evaluated = validApps.map((app) => {
    const applicant = app.applicant || {};
    const skills = Array.isArray(applicant.skills) ? applicant.skills : [];
    const matched = skills.filter((s) =>
      jobSkills.some(
        (js) => s.toLowerCase().includes(js) || js.includes(s.toLowerCase()),
      ),
    );
    return {
      name: applicant.name || "Candidate",
      experience: applicant.experience || "Not specified",
      education: applicant.education || "Not specified",
      skills,
      status: app.status || "New",
      matched,
      score: matched.length + (app.status === "Shortlisted" ? 2 : 0),
    };
  });

  if (qLower.includes("summarize") || qLower.includes("all")) {
    return `Applicant Summary for ${jobTitle} (${evaluated.length} total):\n\n${evaluated
      .map(
        (c, i) =>
          `${i + 1}. ${c.name} [${c.status === "New" ? "Applied" : c.status}] — Experience: ${c.experience} | Education: ${c.education} | Skills: ${c.skills.join(", ") || "Not specified"}`,
      )
      .join("\n")}`;
  }

  const active = evaluated
    .filter((c) => c.status !== "Withdrawn")
    .sort((a, b) => b.score - a.score);

  if (active.length === 0) {
    return `All ${evaluated.length} applicant(s) for ${jobTitle} have withdrawn their applications.`;
  }

  const top = active.slice(0, 3);
  return `Candidate Analysis for ${jobTitle} (based on ${active.length} active applicant${active.length === 1 ? "" : "s"}):\n\n${top
    .map(
      (c, i) =>
        `${i + 1}. ${c.name} (${c.status === "New" ? "Applied" : c.status})\n   • Experience: ${c.experience} | Education: ${c.education}\n   • Skills: ${c.skills.join(", ") || "Not specified"}${c.matched.length ? `\n   • Matching Job Skills: ${c.matched.join(", ")}` : ""}`,
    )
    .join("\n\n")}\n\nRecommended Next Step: Schedule an initial technical screen with ${top[0].name} based on profile alignment.`;
};

const buildClientJobDescFallback = ({ title, skills, experience }) => {
  const skillList = Array.isArray(skills)
    ? skills.map((s) => String(s).trim()).filter(Boolean)
    : typeof skills === "string" && skills.trim()
      ? skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : ["Software Engineering", "System Design", "Modern Web Technologies"];

  return `We are seeking a talented ${title} (${experience || "1-3 Yrs"} experience) to join our engineering team. You will play a key role in architecting, building, and scaling user-facing features and backend services while collaborating closely with product and design peers.

Key Responsibilities:
• Design, implement, and maintain production features using ${skillList.slice(0, 3).join(", ")}.
• Write clean, modular, and well-tested code following modern engineering standards.
• Optimize application performance, responsiveness, and reliability across environments.
• Participate in architectural discussions, code reviews, and agile sprint planning.

Qualifications & Requirements:
• ${experience || "Relevant"} hands-on experience building production applications.
• Strong proficiency with ${skillList.join(", ")}.
• Solid understanding of RESTful APIs, state management, version control, and debugging workflows.
• Excellent communication and problem-solving skills with high attention to detail.`;
};

// Generate AI Interview Prep (Applicant)
export const generateInterviewPrep = createAsyncThunk(
  "ai/generateInterviewPrep",
  async (jobId, { getState, rejectWithValue }) => {
    try {
      const response = await API_URL.post("/api/ai/interview-prep", { jobId });
      return response.data.data;
    } catch (error) {
      const state = getState();
      const currentJob =
        state.jobs?.currentJob ||
        state.jobs?.jobsList?.find((j) => j._id === jobId);
      if (currentJob) {
        return buildClientInterviewPrepFallback(currentJob);
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate interview prep",
      );
    }
  },
);

// Ask AI Hiring Assistant (Recruiter)
export const askHiringAssistant = createAsyncThunk(
  "ai/askHiringAssistant",
  async ({ jobId, question }, { getState, rejectWithValue }) => {
    try {
      const response = await API_URL.post("/api/ai/hiring-assistant", {
        jobId,
        question,
      });
      return response.data.data;
    } catch (error) {
      const state = getState();
      const myJobs = state.user?.dashboardData?.myJobs || [];
      const job = myJobs.find((j) => j._id === jobId);
      const appsFromSlice = state.applications?.applicantsList || [];
      const recentApps = (
        state.user?.dashboardData?.recentApplications || []
      ).filter((a) => (a.job?._id || a.job) === jobId);
      const apps = appsFromSlice.length > 0 ? appsFromSlice : recentApps;
      if (job || apps.length > 0) {
        return buildClientHiringFallback(job, apps, question);
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to get AI answer",
      );
    }
  },
);

// Generate AI Job Description
export const generateJobDescription = createAsyncThunk(
  "ai/generateJobDescription",
  async ({ title, skills, experience }, { rejectWithValue }) => {
    try {
      const response = await API_URL.post("/api/ai/generate-job-description", {
        title,
        skills,
        experience,
      });
      return response.data.data;
    } catch (error) {
      if (title) {
        return buildClientJobDescFallback({ title, skills, experience });
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate description",
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
        state.error = null;
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
        state.error = null;
        state.hiringAssistantResult = null;
      })
      .addCase(askHiringAssistant.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.hiringAssistantResult = action.payload;
      })
      .addCase(askHiringAssistant.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Job Description Generator
      .addCase(generateJobDescription.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.jobDescriptionResult = null;
      })
      .addCase(generateJobDescription.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jobDescriptionResult = action.payload;
      })
      .addCase(generateJobDescription.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
export const { clearAIResults } = aiSlice.actions;
export default aiSlice.reducer;
