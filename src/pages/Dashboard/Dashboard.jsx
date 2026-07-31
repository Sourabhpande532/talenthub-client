import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import {
  fetchDashboard,
  fetchAppliedJobs,
} from "../../features/user/userSlice";
import { updateApplicationStatus } from "../../features/application/applicationSlice";
import ApplicantCard from "../../components/ApplicantCard/ApplicantCard";
import AIAssistantModal from "../../components/AIAssistantModal/AIAssistantModal";

// LOGIC PART
function useDashboardStats() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { dashboardData, appliedJobs, status } = useSelector(
    (state) => state.user,
  );

  // Local state for recruiter to select a job for AI Assistant
  const [selectedJobIdForAI, setSelectedJobIdForAI] = useState(null);

  useEffect(() => {
    dispatch(fetchDashboard());
    if (user?.role === "Applicant") {
      dispatch(fetchAppliedJobs());
    }
  }, [dispatch, user?.role]);

  const handleStatusChange = (applicationId, newStatus) => {
    dispatch(
      updateApplicationStatus({ applicationId, status: newStatus }),
    ).then(() => {
      dispatch(fetchDashboard()); // Refresh dashboard stats after update
    });
  };

  const handleArchiveJob = async (jobId) => {
    try {
      const API = (await import("../../api/axiosHelper")).default;
      await API.patch(`/api/jobs/${jobId}/archive`);
      const toast = (await import("react-hot-toast")).default;
      toast.success("Job archived successfully");
      dispatch(fetchDashboard());
    } catch (error) {
      const toast = (await import("react-hot-toast")).default;
      toast.error(error.response?.data?.message || "Failed to archive job");
    }
  };
  if (status === "loading") {
    return (
      <div className='d-flex justify-content-center align-items-center min-vh-100'>
        <div className='spinner-border text-primary' role='status'></div>
      </div>
    );
  }
  return {
    user,
    dashboardData,
    appliedJobs,
    handleArchiveJob,
    handleStatusChange,
    selectedJobIdForAI,
    setSelectedJobIdForAI,
  };
}

const Dashboard = () => {
  const {
    user,
    dashboardData,
    appliedJobs,
    handleArchiveJob,
    handleStatusChange,
    selectedJobIdForAI,
    setSelectedJobIdForAI,
  } = useDashboardStats();

  const renderRecruiterDashboard = () => {
    const stats = dashboardData?.stats || {};
    const recentApplications = dashboardData?.recentApplications || [];
    const myJobs = dashboardData?.myJobs || [];

    return (
      <div className='recruiter-dashboard'>
        <div className='d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-end gap-3 mb-4'>
          <div>
            <h3 className='fw-bold mb-1'>Recruiter Dashboard</h3>
            <p className='text-muted mb-0'>
              Overview of your jobs and applicants
            </p>
          </div>
          <Link
            to='/create-job'
            className='btn btn-primary fw-medium rounded-pill px-4'>
            <i className='bi bi-plus-lg me-1'></i> Post New Job
          </Link>
        </div>

        {/* Stats Row */}
        <div className='row g-4 mb-5'>
          {[
            {
              label: "Active Jobs",
              value: stats.activeJobs || 0,
              icon: "bi-briefcase",
              color: "primary",
            },
            {
              label: "Applications",
              value: stats.totalApplications || 0,
              icon: "bi-file-earmark-text",
              color: "info",
            },
            {
              label: "Shortlisted",
              value: stats.totalShortlisted || 0,
              icon: "bi-check-circle",
              color: "success",
            },
            {
              label: "Archived Jobs",
              value: stats.archivedJobs || 0,
              icon: "bi-archive",
              color: "secondary",
            },
          ].map((stat, idx) => (
            <div key={idx} className='col-md-6 col-xl-3'>
              <div className='card border-0 shadow-sm rounded-4 h-100'>
                <div className='card-body p-4 d-flex align-items-center gap-4'>
                  <div
                    className={`stats-icon-wrapper bg-${stat.color}-subtle text-${stat.color} rounded-circle d-flex justify-content-center align-items-center`}>
                    <i className={`bi ${stat.icon} fs-4`}></i>
                  </div>
                  <div>
                    <h6 className='text-muted mb-1'>{stat.label}</h6>
                    <h3 className='fw-bold mb-0'>{stat.value}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Row */}
        <div className='card border-0 shadow-sm rounded-4 mb-5 bg-primary-subtle border-primary-subtle'>
          <div className='card-body p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3'>
            <div>
              <h5 className='fw-bold text-primary mb-1'>
                <i className='bi bi-magic me-2'></i>AI Hiring Assistant
              </h5>
              <p className='mb-0 text-primary opacity-75'>
                Select a job to ask our AI assistant questions about the
                candidate pool.
              </p>
            </div>
            <div className='d-flex gap-2 w-100' style={{ maxWidth: "400px" }}>
              <select
                className='form-select border-0 shadow-sm'
                onChange={(e) => setSelectedJobIdForAI(e.target.value)}
                value={selectedJobIdForAI || ""}>
                <option value=''>Select a Job...</option>
                {myJobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title}
                  </option>
                ))}
              </select>
              <button
                className='btn btn-primary fw-medium text-nowrap px-4 shadow-sm'
                data-bs-toggle='modal'
                data-bs-target='#aiAssistantModal'
                disabled={!selectedJobIdForAI}>
                Ask AI
              </button>
            </div>
          </div>
        </div>

        {/* My Active Jobs */}
        <h5 className='fw-bold mb-4'>My Active Jobs</h5>
        <div className='row g-3 mb-5'>
          {myJobs.filter((job) => job.status === "Active").length > 0 ? (
            myJobs
              .filter((job) => job.status === "Active")
              .map((job) => (
                <div key={job._id} className='col-md-6'>
                  <div className='card border-0 shadow-sm rounded-4 h-100 p-3 d-flex flex-row justify-content-between align-items-center'>
                    <div>
                      <h6 className='fw-bold mb-1'>{job.title}</h6>
                      <small className='text-muted'>
                        <i className='bi bi-geo-alt me-1'></i>
                        {job.location}
                      </small>
                    </div>
                    <button
                      className='btn btn-outline-danger btn-sm rounded-pill fw-medium'
                      onClick={() => handleArchiveJob(job._id)}>
                      Archive
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div className='col-12 text-center py-4 bg-body-tertiary rounded-4 shadow-sm border'>
              <p className='text-muted mb-0'>No active jobs found.</p>
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <h5 className='fw-bold mb-4'>Recent Applications</h5>
        <div className='recent-applications-list'>
          {recentApplications.length > 0 ? (
            recentApplications.map((app) => (
              <ApplicantCard
                key={app._id}
                application={app}
                onStatusChange={handleStatusChange}
              />
            ))
          ) : (
            <div className='text-center py-5 bg-white rounded-4 shadow-sm'>
              <p className='text-muted mb-0'>No applications received yet.</p>
            </div>
          )}
        </div>

        {/* Render AI Modal */}
        {selectedJobIdForAI && <AIAssistantModal jobId={selectedJobIdForAI} />}
      </div>
    );
  };

  const renderApplicantDashboard = () => {
    const stats = dashboardData?.stats || {};
    const recentActivity = dashboardData?.recentActivity || [];

    return (
      <div className='applicant-dashboard'>
        <div className='d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-end gap-3 mb-4'>
          <div>
            <h3 className='fw-bold mb-1'>My Dashboard</h3>
            <p className='text-muted mb-0'>
              Track your applications and bookmarks
            </p>
          </div>
          <Link
            to='/jobs'
            className='btn btn-outline-primary fw-medium rounded-pill px-4'>
            Find More Jobs
          </Link>
        </div>

        {/* Stats Row */}
        <div className='row g-4 mb-5'>
          {[
            {
              label: "Applied Jobs",
              value: stats.applied || 0,
              icon: "bi-send-check",
            },
            {
              label: "Shortlisted",
              value: stats.shortlisted || 0,
              icon: "bi-star",
            },
            {
              label: "Rejected",
              value: stats.rejected || 0,
              icon: "bi-x-circle",
            },
            {
              label: "Bookmarked",
              value: stats.bookmarked || 0,
              icon: "bi-bookmark",
            },
          ].map((stat, idx) => (
            <div key={idx} className='col-md-6 col-xl-3'>
              <div className='card border-0 shadow-sm rounded-4 h-100'>
                <div className='card-body p-4'>
                  <h6 className='text-muted mb-3'>{stat.label}</h6>
                  <div className='d-flex justify-content-between align-items-end'>
                    <h2 className='fw-bold mb-0'>{stat.value}</h2>
                    <i
                      className={`bi ${stat.icon} fs-3 text-light-muted opacity-25`}></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* My Applications List */}
        <div className='card border-0 shadow-sm rounded-4 mb-5'>
          <div className='card-header bg-white border-0 pt-4 pb-0 px-4'>
            <h5 className='fw-bold mb-0'>My Applications</h5>
          </div>
          <div className='card-body p-4'>
            {appliedJobs && appliedJobs.length > 0 ? (
              <div className='table-responsive border border-light-subtle rounded-3 shadow-sm'>
                <table
                  className='table table-hover align-middle mb-0'
                  style={{ minWidth: "650px" }}>
                  <thead className='table-light border-bottom text-secondary text-uppercase fs-7'>
                    <tr>
                      <th className='py-3 ps-4'>Job Title</th>{" "}
                      {/* Added padding start (ps-4) for clean screen alignment */}
                      <th className='py-3'>Company</th>
                      <th className='py-3'>Applied On</th>
                      <th className='py-3 pe-4'>Status</th>{" "}
                      {/* Added padding end (pe-4) */}
                    </tr>
                  </thead>
                  <tbody>
                    {appliedJobs.map((app) => (
                      <tr key={app._id} className='transition-all'>
                        <td
                          className='fw-semibold py-3 ps-4 text-truncate'
                          style={{ maxWidth: "220px" }}>
                          <Link
                            to={`/jobs/${app.job?._id}`}
                            className='text-decoration-none link-primary link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover'>
                            {app.job?.title || "Unknown"}
                          </Link>
                        </td>
                        <td
                          className='text-muted py-3 text-truncate'
                          style={{ maxWidth: "180px" }}>
                          {app.job?.companyName ||
                            (app.job?.recruiter &&
                              app.job.recruiter.companyName) ||
                            "Company"}
                        </td>
                        <td className='text-secondary py-3'>
                          {new Date(app.createdAt).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "short", day: "numeric" },
                          )}
                        </td>
                        <td className='py-3 pe-4'>
                          {/* Visual Upgrade: Kept your clean dynamic colors, but added fw-medium for readability */}
                          <span
                            className={`badge fw-semibold ${app.status === "Shortlisted" ? "bg-success" : app.status === "Rejected" ? "bg-danger" : "bg-primary"} bg-opacity-10 text-${app.status === "Shortlisted" ? "success" : app.status === "Rejected" ? "danger" : "primary"} px-3 py-2 rounded-pill`}>
                            {app.status === "New" ? "Applied" : app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className='text-center py-4 text-muted'>
                <p className='mb-0'>You haven't applied to any jobs yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className='card border-0 shadow-sm rounded-4'>
          <div className='card-header bg-white border-0 pt-4 pb-0 px-4'>
            <h5 className='fw-bold mb-0'>Recent Activity</h5>
          </div>
          <div className='card-body p-4'>
            {recentActivity.length > 0 ? (
              <div className='activity-timeline position-relative ps-4 ms-2'>
                {recentActivity.map((activity, idx) => (
                  <div
                    key={idx}
                    className='activity-item position-relative pb-4'>
                    <div className='activity-dot position-absolute bg-primary rounded-circle border border-white border-2'></div>
                    <p className='mb-1'>
                      {activity.type === "Applied" && (
                        <>
                          Applied for{" "}
                          <strong className='text-dark'>
                            {activity.jobTitle}
                          </strong>{" "}
                          at {activity.companyName}
                        </>
                      )}
                      {activity.type === "Shortlisted" && (
                        <>
                          <strong>Congratulations!</strong> You were shortlisted
                          for{" "}
                          <strong className='text-dark'>
                            {activity.jobTitle}
                          </strong>{" "}
                          at {activity.companyName}
                        </>
                      )}
                      {activity.type === "Rejected" && (
                        <>
                          Your application for{" "}
                          <strong className='text-dark'>
                            {activity.jobTitle}
                          </strong>{" "}
                          at {activity.companyName} was not selected.
                        </>
                      )}
                      {activity.type === "Bookmarked" && (
                        <>
                          Bookmarked{" "}
                          <strong className='text-dark'>
                            {activity.jobTitle}
                          </strong>{" "}
                          at {activity.companyName}
                        </>
                      )}
                    </p>
                    <small className='text-muted'>
                      {new Date(activity.date).toLocaleDateString()}
                    </small>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-4 text-muted'>
                <i className='bi bi-activity fs-1 mb-2 d-block opacity-50'></i>
                <p>No recent activity.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='dashboard-page bg-body-tertiary min-vh-100 py-4'>
      <div className='container'>
        {user?.role === "Recruiter"
          ? renderRecruiterDashboard()
          : renderApplicantDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;
