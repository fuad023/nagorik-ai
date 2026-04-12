import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import "../styles/AdminDashboard.css";
import {
  FiChevronDown,
  FiGrid,
  FiCheckSquare,
  FiUsers,
  FiUser,
} from "react-icons/fi";

type AdminUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

type TeamMember = {
  id: number;
  name: string;
  occupation: string;
};

type DashboardStatsResponse = {
  success: boolean;
  message: string;
  data: {
    total_reports: number;
    flood_reports: number;
    dust_reports: number;
    narrow_road_reports: number;
    pending_reports: number;
  };
};

type AdminReport = {
  id: number;
  title: string;
  alert: "high" | "medium" | "normal";
  status: "pending" | "resolved" | "in_progress";
  report_type: string;
  created_at: string;
  reporter: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
};

type UserStatsResponse = {
  success: boolean;
  message: string;
  data: {
    user_statistics: {
      total_users: number;
      active_users: number;
      new_signups: number;
    };
  };
};

type ReportStatsResponse = {
  success: boolean;
  message: string;
  data: {
    reports_submitted: {
      today_submitted: number;
      this_week: number;
      this_month: number;
    };
  };
};

const menuItems = [
  { label: "Dashboard", icon: <FiGrid /> },
  { label: "Verification", icon: <FiCheckSquare /> },
  { label: "Teams", icon: <FiUsers /> },
  { label: "Users", icon: <FiUser /> },
];

const verificationPhotosRight = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
];

const formatLabel = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamActivity, setTeamActivity] = useState([
    { title: "Reports Filed", value: 0, colorClass: "blue" },
    { title: "Verifications", value: 0, colorClass: "orange" },
    { title: "Active Tasks", value: 0, colorClass: "darkblue" },
  ]);

  const [userStats, setUserStats] = useState([
    { label: "Total Users", value: "0" },
    { label: "Active Users", value: "0" },
    { label: "New Signups", value: "0" },
  ]);

  const [reportsSubmittedList, setReportsSubmittedList] = useState([
    { label: "Today Submitted", value: "0" },
    { label: "This Week", value: "0" },
    { label: "This Month", value: "0" },
  ]);

  const [userActivityList, setUserActivityList] = useState<string[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [dashboardStats, setDashboardStats] = useState({
    total_reports: 0,
    flood_reports: 0,
    dust_reports: 0,
    narrow_road_reports: 0,
    pending_reports: 0,
  });

  const [dashboardRecentReports, setDashboardRecentReports] = useState<
    { title: string; date: string }[]
  >([]);

  const [dashboardAlerts, setDashboardAlerts] = useState<
    { color: "red" | "orange" | "green"; text: string }[]
  >([]);

  const [verificationReports, setVerificationReports] = useState<AdminReport[]>(
    []
  );

  const [verificationPercentages, setVerificationPercentages] = useState({
    pending: 0,
    resolved: 0,
    in_progress: 0,
  });

  const adminMenuRef = useRef<HTMLDivElement | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("auth_token");

    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(event.target as Node)
      ) {
        setShowAdminMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchPageData = async () => {
      setUsersLoading(true);

      try {
        const usersResponse = await fetch(
          "http://127.0.0.1:8000/api/v1/admin/users",
          { headers: getAuthHeaders() }
        );

        const teamMembersResponse = await fetch(
          "http://127.0.0.1:8000/api/v1/admin/team-members",
          { headers: getAuthHeaders() }
        );

        const userStatsResponse = await fetch(
          "http://127.0.0.1:8000/api/v1/admin/user-stats",
          { headers: getAuthHeaders() }
        );

        const reportStatsResponse = await fetch(
          "http://127.0.0.1:8000/api/v1/admin/report-stats",
          { headers: getAuthHeaders() }
        );

        const reportsResponse = await fetch(
          "http://127.0.0.1:8000/api/v1/admin/reports",
          { headers: getAuthHeaders() }
        );

        const dashboardStatsResponse = await fetch(
          "http://127.0.0.1:8000/api/v1/admin/dashboard-stats",
          { headers: getAuthHeaders() }
        );

        const usersJson = await usersResponse.json();
        const teamMembersJson = await teamMembersResponse.json();
        const userStatsJson: UserStatsResponse = await userStatsResponse.json();
        const reportStatsJson: ReportStatsResponse =
          await reportStatsResponse.json();
        const reportsJson = await reportsResponse.json();
        const dashboardStatsJson: DashboardStatsResponse =
          await dashboardStatsResponse.json();

        setUsersList(usersJson.data || []);
        setTeamMembers(teamMembersJson.data || []);

        setUserStats([
          {
            label: "Total Users",
            value: String(userStatsJson.data.user_statistics.total_users),
          },
          {
            label: "Active Users",
            value: String(userStatsJson.data.user_statistics.active_users),
          },
          {
            label: "New Signups",
            value: String(userStatsJson.data.user_statistics.new_signups),
          },
        ]);

        setReportsSubmittedList([
          {
            label: "Today Submitted",
            value: String(
              reportStatsJson.data.reports_submitted.today_submitted
            ),
          },
          {
            label: "This Week",
            value: String(reportStatsJson.data.reports_submitted.this_week),
          },
          {
            label: "This Month",
            value: String(reportStatsJson.data.reports_submitted.this_month),
          },
        ]);

        const reportsData: AdminReport[] = reportsJson.data || [];

        const recentActivity = reportsData.map((report) => {
          return `${report.reporter.first_name} ${report.reporter.last_name} submitted ${report.report_type} report`;
        });

        setUserActivityList(recentActivity);

        setDashboardStats(dashboardStatsJson.data);

        const recentReportsData = reportsData.map((report) => ({
          title: report.title,
          date: new Date(report.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        }));

        setDashboardRecentReports(recentReportsData);

        const alertData = reportsData.map((report) => {
          let color: "red" | "orange" | "green" = "green";

          if (report.alert === "high") color = "red";
          else if (report.alert === "medium") color = "orange";

          return {
            color,
            text: report.title,
          };
        });

        setDashboardAlerts(alertData);

        setVerificationReports(reportsData);

        const totalVerification = reportsData.length || 1;
        const pendingCount = reportsData.filter(
          (r) => r.status === "pending"
        ).length;
        const resolvedCount = reportsData.filter(
          (r) => r.status === "resolved"
        ).length;
        const inProgressCount = reportsData.filter(
          (r) => r.status === "in_progress"
        ).length;

        setVerificationPercentages({
          pending: Math.round((pendingCount / totalVerification) * 100),
          resolved: Math.round((resolvedCount / totalVerification) * 100),
          in_progress: Math.round((inProgressCount / totalVerification) * 100),
        });

        setTeamActivity([
          {
            title: "Reports Filed",
            value: reportsData.length,
            colorClass: "blue",
          },
          {
            title: "Verifications",
            value: resolvedCount,
            colorClass: "orange",
          },
          {
            title: "Active Tasks",
            value: inProgressCount,
            colorClass: "darkblue",
          },
        ]);
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchPageData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setShowAdminMenu(false);
    navigate("/login");
  };

  const renderDashboardPage = () => {
    const pieData = [
      {
        label: "Flood",
        value: dashboardStats.flood_reports,
        color: "#2d8cff",
      },
      {
        label: "Dust",
        value: dashboardStats.dust_reports,
        color: "#3cb878",
      },
      {
        label: "Narrow Road",
        value: dashboardStats.narrow_road_reports,
        color: "#f2a423",
      },
      {
        label: "Pending",
        value: dashboardStats.pending_reports,
        color: "#e65b5b",
      },
    ];

    const totalPie = dashboardStats.total_reports || 0;
    const safeTotal = pieData.reduce((sum, item) => sum + item.value, 0) || 1;

    const conicSegments = pieData
      .reduce(
        (acc, item) => {
          const start = acc.current;
          const angle = (item.value / safeTotal) * 360;
          const end = start + angle;
          acc.parts.push(`${item.color} ${start}deg ${end}deg`);
          acc.current = end;
          return acc;
        },
        { parts: [] as string[], current: 0 }
      )
      .parts.join(", ");

    return (
      <section className="dashboard-wrapper">
        <div className="dashboard-header modern-dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="dashboard-subtitle">
              Overview of report activity and current city issues.
            </p>
          </div>
        </div>

        <div className="dashboard-overview-grid">
          <div className="dashboard-chart-card">
            <div className="dashboard-card-title-row">
              <h3>Report Distribution</h3>
            </div>

            <div className="dashboard-pie-layout">
              <div
                className="dashboard-pie-chart"
                style={{ background: `conic-gradient(${conicSegments})` }}
              >
                <div className="dashboard-pie-center">
                  <strong>{totalPie}</strong>
                  <span>Reports</span>
                </div>
              </div>

              <div className="dashboard-pie-legend">
                {pieData.map((item) => (
                  <div className="dashboard-legend-row" key={item.label}>
                    <div className="dashboard-legend-left">
                      <span
                        className="dashboard-legend-dot"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.label}</span>
                    </div>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="cards-only-section">
          <div className="info-card dashboard-scroll-card">
            <div className="info-card-header">
              <h3>Alerts</h3>
            </div>

            <div className="info-card-body dashboard-scroll-body">
              {dashboardAlerts.length > 0 ? (
                dashboardAlerts.map((alertItem, index) => (
                  <div key={index} className="list-item">
                    <span className={`bullet ${alertItem.color}`} />
                    <span>{alertItem.text}</span>
                  </div>
                ))
              ) : (
                <div className="list-item">
                  <span>No alerts found.</span>
                </div>
              )}
            </div>
          </div>

          <div className="info-card dashboard-scroll-card">
            <div className="info-card-header">
              <h3>Recent Reports</h3>
            </div>

            <div className="info-card-body dashboard-scroll-body">
              {dashboardRecentReports.length > 0 ? (
                dashboardRecentReports.map((report, index) => (
                  <div key={index} className="list-item report-date-row">
                    <div className="report-date-left">
                      <span className="bullet blue" />
                      <span>{report.title}</span>
                    </div>
                    <span className="report-date-text">{report.date}</span>
                  </div>
                ))
              ) : (
                <div className="list-item">
                  <span>No recent reports found.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderVerificationPage = () => {
    return (
      <section className="dashboard-wrapper">
        <div className="verification-top-row">
          <h1 className="verification-title">Verification</h1>
        </div>

        <div className="verification-grid">
          <div className="verification-card request-card verification-scroll-card">
            <h3 className="verification-card-title">Verification Requests</h3>

            <div className="verification-request-list verification-scroll-body">
              {verificationReports.length > 0 ? (
                verificationReports.map((item) => (
                  <div className="verification-request-row" key={item.id}>
                    <div className="verification-request-text">
                      <h4>{item.title}</h4>
                      <p>
                        {formatLabel(item.report_type)} |{" "}
                        {new Date(item.created_at).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className="verification-request-right">
                      <span
                        className={`verification-status-text ${item.status}`}
                      >
                        {formatLabel(item.status)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="verification-request-row">
                  <div className="verification-request-text">
                    <h4>No verification requests found</h4>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="verification-card status-card">
            <h3 className="verification-card-title">Verification Status</h3>

            <div className="verification-status-list">
              <div className="verification-status-row">
                <span>Pending</span>
                <strong>{verificationPercentages.pending}%</strong>
              </div>
              <div className="verification-status-row">
                <span>Resolved</span>
                <strong>{verificationPercentages.resolved}%</strong>
              </div>
              <div className="verification-status-row">
                <span>In Progress</span>
                <strong>{verificationPercentages.in_progress}%</strong>
              </div>
            </div>
          </div>

          <div className="verification-card photo-card verification-scroll-card">
            <h3 className="verification-card-title">Recent Photos</h3>

            <div className="photo-grid two verification-photo-scroll-body">
              {verificationPhotosRight.map((img, index) => (
                <div className="photo-thumb" key={index}>
                  <img src={img} alt={`Recent right ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderTeamsPage = () => {
    return (
      <section className="dashboard-wrapper">
        <div className="teams-page">
          <div className="teams-main-card teams-team-card">
            <h2 className="teams-section-title">Our Team</h2>

            <div className="team-members-scroll">
              <div className="team-members-grid">
                {teamMembers.length > 0 ? (
                  teamMembers.map((member) => (
                    <div className="team-member-card" key={member.id}>
                      <div className="team-member-image">
                        <img
                          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                          alt={member.name}
                        />
                      </div>
                      <h3>{member.name}</h3>
                      <p>{member.occupation}</p>
                    </div>
                  ))
                ) : (
                  <div className="team-member-card">
                    <div className="team-member-image">
                      <img
                        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        alt="No team members"
                      />
                    </div>
                    <h3>No Team Members</h3>
                    <p>No occupation available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="teams-bottom-grid">
            <div className="teams-main-card activity-card">
              <h2 className="teams-section-title">Field Activity</h2>

              <div className="activity-list">
                {teamActivity.map((item, index) => (
                  <div className="activity-row" key={index}>
                    <div className="activity-left">
                      <span className={`activity-icon ${item.colorClass}`}>
                        ↗
                      </span>
                      <span className="activity-label">{item.title}</span>
                    </div>
                    <div className="activity-value">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderUsersPage = () => {
    return (
      <section className="dashboard-wrapper">
        <div className="users-page">
          <h1 className="users-title">Users</h1>

          <div className="users-grid-top">
            <div className="users-card users-list-card">
              <h3 className="users-card-title">User List</h3>

              <div className="users-list">
                {usersLoading ? (
                  <div className="user-row">
                    <span className="user-name">Loading users...</span>
                  </div>
                ) : usersList.length > 0 ? (
                  usersList.map((user) => (
                    <div className="user-row" key={user.id}>
                      <div className="user-row-left">
                        <div className="user-avatar">
                          <img
                            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                            alt={`${user.first_name} ${user.last_name}`}
                          />
                        </div>
                        <span className="user-name">
                          {user.first_name} {user.last_name}
                        </span>
                      </div>

                      <div className="user-row-right">
                        <button
                          className="user-view-btn"
                          onClick={() =>
                            window.open(`/reports-page?userId=${user.id}`, "_blank")
                          }
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="user-row">
                    <span className="user-name">No users found.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="users-card users-stats-card">
              <h3 className="users-card-title">User Statistics</h3>

              <div className="user-stats-list">
                {userStats.map((item, index) => (
                  <div className="user-stats-row" key={index}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="users-grid-bottom">
            <div className="users-card">
              <h3 className="users-card-title">Reports Submitted</h3>

              <div className="user-stats-list">
                {reportsSubmittedList.map((item, index) => (
                  <div className="user-stats-row" key={index}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="users-card users-activity-card">
              <h3 className="users-card-title">Recent User Activity</h3>

              <div className="user-activity-list">
                {userActivityList.length > 0 ? (
                  userActivityList.map((item, index) => (
                    <div className="user-activity-row" key={index}>
                      <span className="bullet blue" />
                      <span>{item}</span>
                    </div>
                  ))
                ) : (
                  <div className="user-activity-row">
                    <span className="bullet blue" />
                    <span>No recent activity found.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderActivePage = () => {
    if (activePage === "Dashboard") return renderDashboardPage();
    if (activePage === "Verification") return renderVerificationPage();
    if (activePage === "Teams") return renderTeamsPage();
    if (activePage === "Users") return renderUsersPage();
    return renderDashboardPage();
  };

  return (
    <div className="admin-dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-top"></div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <div
              key={item.label}
              className={`sidebar-item ${
                activePage === item.label ? "active" : ""
              }`}
              onClick={() => setActivePage(item.label)}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span className="sidebar-item-text">{item.label}</span>
            </div>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-spacer" />

          <div className="topbar-actions">
            <div className="admin-dropdown-wrapper" ref={adminMenuRef}>
              <div
                className="admin-profile"
                onClick={() => setShowAdminMenu((prev) => !prev)}
              >
                <img
                  src="https://i.pravatar.cc/100?img=12"
                  alt="Admin"
                  className="admin-avatar"
                />
                <span className="admin-name">Admin</span>
                <FiChevronDown className="admin-dropdown-icon" />
              </div>

              {showAdminMenu && (
                <div className="admin-dropdown-menu">
                  <button
                    className="admin-dropdown-item"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {renderActivePage()}
      </main>
    </div>
  );
};

export default AdminDashboard;