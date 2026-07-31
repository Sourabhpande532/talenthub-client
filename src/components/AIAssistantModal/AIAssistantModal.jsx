import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./AIAssistantModal.css";
import { askHiringAssistant } from "../../features/ai/aiSlice";

const AIAssistantModal = ({ jobId }) => {
  const [question, setQuestion] = useState("");
  const dispatch = useDispatch();
  const { hiringAssistantResult, status, error } = useSelector(
    (state) => state.ai,
  );

  const predefinedPrompts = [
    "Suggest the top 3 candidates.",
    "Summarize all applicants.",
    "Which applicant has the strongest frontend profile?",
    "Who should I interview first?",
  ];

  const handleAsk = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    dispatch(askHiringAssistant({ jobId, question }));
  };

  const handlePromptClick = (prompt) => {
    setQuestion(prompt);
    dispatch(askHiringAssistant({ jobId, question: prompt }));
  };

  return (
    <div
      className='modal fade'
      id='aiAssistantModal'
      tabIndex='-1'
      aria-hidden='true'>
      <div className='modal-dialog modal-dialog-centered modal-lg'>
        <div className='modal-content border-0 shadow'>
          <div className='modal-header border-bottom-0 bg-primary text-white'>
            <h5 className='modal-title fw-bold'>
              <i className='bi bi-robot me-2'></i> AI Hiring Assistant
            </h5>
            <button
              type='button'
              className='btn-close btn-close-white'
              data-bs-dismiss='modal'
              aria-label='Close'></button>
          </div>
          <div className='modal-body p-4 ai-modal-body'>
            <div className='mb-4'>
              <p className='text-muted small mb-2 fw-medium'>Try asking:</p>
              <div className='d-flex flex-wrap gap-2'>
                {predefinedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    className='btn btn-sm btn-outline-secondary rounded-pill ai-prompt-btn'
                    onClick={() => handlePromptClick(prompt)}>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAsk} className='d-flex gap-2 mb-4'>
              <input
                type='text'
                className='form-control rounded-pill px-4'
                placeholder='Ask anything about the applicants...'
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button
                type='submit'
                className='btn btn-primary rounded-pill px-4'
                disabled={status === "loading" || !question.trim()}>
                {status === "loading" ? (
                  <span className='spinner-border spinner-border-sm'></span>
                ) : (
                  <i className='bi bi-send-fill'></i>
                )}
              </button>
            </form>

            {/* AI Response Area */}
            <div className='ai-response-container p-4 rounded-4 bg-light border'>
              {status === "loading" && (
                <div className='text-center text-primary py-3'>
                  <div className='spinner-grow spinner-grow-sm me-2'></div>
                  <div className='spinner-grow spinner-grow-sm me-2 text-secondary'></div>
                  <div className='spinner-grow spinner-grow-sm text-info'></div>
                  <p className='mt-2 small fw-medium'>
                    Analyzing applicant data...
                  </p>
                </div>
              )}

              {status === "failed" && (
                <div className='text-danger'>
                  <i className='bi bi-exclamation-triangle-fill me-2'></i>
                  {error ||
                    "Something went wrong. AI service may be unavailable."}
                </div>
              )}

              {status === "succeeded" && hiringAssistantResult && (
                <div className='ai-response-content'>
                  <pre
                    className='mb-0 text-wrap'
                    style={{ fontFamily: "inherit" }}>
                    {hiringAssistantResult}
                  </pre>
                </div>
              )}

              {status === "idle" && !hiringAssistantResult && (
                <div className='text-center text-muted py-4'>
                  <i className='bi bi-chat-square-dots fs-1 mb-2'></i>
                  <p className='mb-0'>
                    Ask a question to see the AI's analysis here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantModal;
