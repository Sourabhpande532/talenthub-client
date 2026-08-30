import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchDashboard,
  fetchAppliedJobs,
  removeBookmark,
} from "../../features/user/userSlice";
import {
  updateApplicationStatus,
  withdrawApplication,
} from "../../features/application/applicationSlice";
import ApplicantCard from "../../components/ApplicantCard/ApplicantCard";
import AIAssistantModal from "../../components/AIAssistantModal/AIAssistantModal";
import { setUser } from '../../features/auth/authSlice';
import './Dashboard.css';

const Dashboard = () => {
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

  const handleActivateJob = async (jobId) => {
    try {
      const API = (await import("../../api/axiosHelper")).default;
      await API.put(`/api/jobs/${jobId}`, { status: "Active" });
      const toast = (await import("react-hot-toast")).default;
      toast.success("Job activated successfully");
      dispatch(fetchDashboard());
    } catch (error) {
      const toast = (await import("react-hot-toast")).default;
      toast.error(error.response?.data?.message || "Failed to activate job");
    }
  };

  if (status === "loading") {
    return (
      <div className='d-flex justify-content-center align-items-center min-vh-100'>
        <div className='spinner-border text-primary' role='status'></div>
      </div>
    );
  }

  const renderRecruiterDashboard = () => {
    const stats = dashboardData?.stats || {};
    const recentApplications = dashboardData?.recentApplications || [];
    const myJobs = dashboardData?.myJobs || [];
    const activeJobs = myJobs.filter((job) => job.status === "Active");
    const archivedJobs = myJobs.filter((job) => job.status === "Archived");

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
              <div className='card border-0 shadow-sm rounded-4 h-100 stat-card'>
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
          {activeJobs.length > 0 ? (
            activeJobs.map((job) => (
              <div key={job._id} className='col-md-6'>
                <div className='card border-0 shadow-sm rounded-4 h-100 stat-card p-3 d-flex flex-row justify-content-between align-items-center'>
                  <div>
                    <h6 className='fw-bold mb-1'>{job.title}</h6>
                    <small className='text-muted'>
                      <i className='bi bi-geo-alt me-1'></i>
                      {job.location}
                    </small>
                  </div>
                  <div className='d-flex align-items-center gap-2'>
                    <Link
                      to={`/edit-job/${job._id}`}
                      className='btn btn-outline-primary btn-sm rounded-pill fw-medium px-3'>
                      <i className='bi bi-pencil me-1'></i> Edit
                    </Link>
                    <button
                      className='btn btn-outline-danger btn-sm rounded-pill fw-medium px-3'
                      onClick={() => handleArchiveJob(job._id)}>
                      Archive
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='col-12 text-center py-4 bg-body-tertiary rounded-4 shadow-sm border'>
              <p className='text-muted mb-0'>No active jobs found.</p>
            </div>
          )}
        </div>

        {/* My Archived Jobs */}
        {archivedJobs.length > 0 && (
          <>
            <h5 className='fw-bold mb-4'>My Archived Jobs</h5>
            <div className='row g-3 mb-5'>
              {archivedJobs.map((job) => (
                <div key={job._id} className='col-md-6'>
                  <div className='card border-0 shadow-sm rounded-4 h-100 stat-card p-3 d-flex flex-row justify-content-between align-items-center bg-light opacity-75'>
                    <div>
                      <h6 className='fw-bold mb-1'>{job.title}</h6>
                      <small className='text-muted'>
                        <i className='bi bi-archive me-1'></i> Archived
                      </small>
                    </div>
                    <div className='d-flex align-items-center gap-2'>
                      <Link
                        to={`/edit-job/${job._id}`}
                        className='btn btn-outline-primary btn-sm rounded-pill fw-medium px-3'>
                        <i className='bi bi-pencil me-1'></i> Edit
                      </Link>
                      <button
                        className='btn btn-outline-success btn-sm rounded-pill fw-medium px-3'
                        onClick={() => handleActivateJob(job._id)}>
                        Activate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

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

    // Sort applications so all job applications from the same company are grouped together
    const sortedAppliedJobs = [...(appliedJobs || [])].sort((a, b) => {
      const compA = (a.job?.company || a.job?.companyName || "").toLowerCase();
      const compB = (b.job?.company || b.job?.companyName || "").toLowerCase();
      return compA.localeCompare(compB);
    });

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
              value: user?.bookmarks?.length || stats.bookmarked || 0,
              icon: "bi-bookmark",
            },
          ].map((stat, idx) => (
            <div key={idx} className='col-md-6 col-xl-3'>
              <div className='card border-0 shadow-sm rounded-4 h-100 stat-card'>
                <div className='card-body p-4'>
                  <h6 className='text-muted mb-3'>{stat.label}</h6>
                  <div className='d-flex justify-content-between align-items-end dashboard-header-flex'>
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
            {sortedAppliedJobs && sortedAppliedJobs.length > 0 ? (
              <div className='table-responsive'>
                <table
                  className='table table-hover align-middle mb-0'
                  style={{ minWidth: "600px" }}>
                  <thead className='border-bottom'>
                    <tr>
                      <th className='py-3'>Job Title</th>
                      <th className='py-3'>Company</th>
                      <th className='py-3'>Applied On</th>
                      <th className='py-3'>Status</th>
                      <th className='py-3 text-end'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAppliedJobs.map((app) => {
                      const companyName =
                        app.job?.company ||
                        app.job?.companyName ||
                        (app.job?.recruiter && app.job.recruiter.companyName) ||
                        "Company";
                      return (
                        <tr key={app._id}>
                          <td className='fw-medium text-primary'>
                            <Link
                              to={`/jobs/${app.job?._id}`}
                              className='text-decoration-none'>
                              {app.job?.title || "Unknown"}
                            </Link>
                          </td>
                          <td className='fw-semibold'>{companyName}</td>
                          <td>
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <span
                              className={`badge ${app.status === "Shortlisted" ? "bg-success" : app.status === "Rejected" ? "bg-danger" : "bg-primary"} bg-opacity-10 text-${app.status === "Shortlisted" ? "success" : app.status === "Rejected" ? "danger" : "primary"} px-3 py-2 rounded-pill`}>
                              {app.status === "New" ? "Applied" : app.status}
                            </span>
                          </td>
                          <td className='text-end'>
                            <button
                              className='btn btn-outline-danger btn-sm rounded-pill px-3 fw-medium'
                              onClick={async () => {
                                const res = await dispatch(
                                  withdrawApplication(app._id),
                                );
                                if (withdrawApplication.fulfilled.match(res)) {
                                  dispatch(fetchAppliedJobs());
                                  dispatch(fetchDashboard());
                                }
                              }}>
                              Withdraw
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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

        {/* Bookmarked Jobs */}
        <div className='card border-0 shadow-sm rounded-4 mb-5'>
          <div className='card-header bg-white border-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center'>
            <h5 className='fw-bold mb-0'>
              <i className='bi bi-bookmark-heart text-primary me-2'></i>
              Bookmarked Jobs
            </h5>
            <span className='badge bg-primary rounded-pill px-3 py-2'>
              {user?.bookmarks?.length || 0} Saved
            </span>
          </div>
          <div className='card-body p-4'>
            {user?.bookmarks && user.bookmarks.length > 0 ? (
              <div className='row g-3'>
                {user.bookmarks.map((job) => {
                  const jobId = typeof job === "string" ? job : job._id;
                  const title = job.title || "Bookmarked Job";
                  const company = job.company || job.companyName || "Company";
                  return (
                    <div key={jobId} className='col-md-6 col-lg-4'>
                      <div className='card border shadow-sm rounded-4 p-3 h-100 d-flex flex-column justify-content-between'>
                        <div>
                          <h6 className='fw-bold mb-1'>{title}</h6>
                          <p className='text-muted small mb-2'>{company}</p>
                        </div>
                        <div className='d-flex justify-content-between align-items-center mt-3 pt-2 border-top'>
                          <Link
                            to={`/jobs/${jobId}`}
                            className='btn btn-outline-primary btn-sm rounded-pill px-3'>
                            View Details
                          </Link>
                          <button
                            className='btn btn-sm btn-link text-danger text-decoration-none p-0'
                            onClick={async () => {
                              const res = await dispatch(removeBookmark(jobId));
                              if (removeBookmark.fulfilled.match(res)) {
                                dispatch(setUser(res.payload));
                                dispatch(fetchDashboard());
                              }
                            }}>
                            <i className='bi bi-trash me-1'></i>Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className='text-center py-4 text-muted'>
                <p className='mb-0'>No bookmarked jobs in your Bookmarks.</p>
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
