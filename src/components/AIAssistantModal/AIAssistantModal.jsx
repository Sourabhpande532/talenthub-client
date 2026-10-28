import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./AIAssistantModal.css";
import { askHiringAssistant } from "../../features/ai/aiSlice";
import { MarkdownRenderer } from "../MarkdownRenderer/MarkdownRenderer";

const PREDEFINED_PROMPTS = [
  "Suggest the top 3 candidates.",
  "Summarize all applicants.",
  "Which applicant has the strongest frontend profile?",
  "Who should I interview first?",
];

const AIAssistantModal = ({ jobId, jobTitle, isOpen = false, onClose }) => {
  const [question, setQuestion] = useState("");
  const dispatch = useDispatch();
  const { hiringAssistantResult, status, error } = useSelector(
    (state) => state.ai,
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleAsk = (e) => {
    e.preventDefault();
    if (!question.trim() || !jobId) return;
    dispatch(askHiringAssistant({ jobId, question: question.trim() }));
  };

  const handlePromptClick = (prompt) => {
    if (!jobId) return;
    setQuestion(prompt);
    dispatch(askHiringAssistant({ jobId, question: prompt }));
  };

  if (!isOpen) return null;

  return (
    <div
      id="aiAssistantModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="aiAssistantModalTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-navy-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center flex-shrink-0">
              <i className="bi bi-robot text-lg"></i>
            </span>
            <div className="min-w-0">
              <h3
                id="aiAssistantModalTitle"
                className="font-display text-base sm:text-lg font-bold text-white truncate m-0">
                AI Hiring Assistant
              </h3>
              {jobTitle && (
                <p className="text-xs text-slate-300 truncate m-0">
                  Analyzing candidates for: {jobTitle}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800 flex items-center justify-center transition-colors">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Quick Prompts */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Quick Prompts (Grounded in Applicant Data)
            </p>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={status === "loading"}
                  onClick={() => handlePromptClick(prompt)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-800 border border-slate-200 hover:border-brand-300 transition-colors">
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Ask Form */}
          <form onSubmit={handleAsk} className="flex items-center gap-2">
            <input
              type="text"
              aria-label="Ask a question about applicants"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none text-sm text-slate-900 placeholder-slate-400"
              placeholder="Ask anything about the applicants for this role..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button
              type="submit"
              disabled={status === "loading" || !question.trim()}
              className="px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center gap-2 flex-shrink-0">
              {status === "loading" ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Ask</span>
                  <i className="bi bi-send-fill text-xs"></i>
                </>
              )}
            </button>
          </form>

          {/* Response Container */}
          <div className="ai-response-container rounded-xl bg-slate-50 border border-slate-200 p-4 sm:p-5 min-h-[180px] max-h-[340px] overflow-y-auto">
            {status === "loading" && (
              <div className="py-8 text-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm font-medium text-slate-600 m-0">
                  Evaluating applicant profiles and skills...
                </p>
              </div>
            )}

            {status === "failed" && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
                <i className="bi bi-exclamation-triangle-fill mt-0.5"></i>
                <span>
                  {error ||
                    "Something went wrong. AI service may be temporarily unavailable."}
                </span>
              </div>
            )}

            {status === "succeeded" && hiringAssistantResult && (
              <div className="ai-response-content text-sm text-slate-800 leading-relaxed">
                <MarkdownRenderer content={hiringAssistantResult} />
              </div>
            )}

            {status === "idle" && !hiringAssistantResult && (
              <div className="py-8 text-center text-slate-500">
                <i className="bi bi-chat-square-dots text-3xl text-slate-400 block mb-2"></i>
                <p className="text-sm m-0">
                  Select a prompt above or type a question to analyze applicants
                  using real candidate data.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            <i className="bi bi-shield-check text-brand-600 mr-1"></i>
            Responses are strictly grounded in submitted applicant profiles.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantModal;
