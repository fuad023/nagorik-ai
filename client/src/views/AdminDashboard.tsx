import React, { useEffect, useRef, useState } from "react";
import "../styles/AdminDashboard.css";
import {
  FiBell,
  FiMail,
  FiChevronDown,
  FiGrid,
  FiCheckSquare,
  FiUsers,
  FiUser,
} from "react-icons/fi";

type StatCardProps = {
  title: string;
  value: number;
  accent: string;
};

const menuItems = [
  { label: "Dashboard", icon: <FiGrid /> },
  { label: "Verification", icon: <FiCheckSquare /> },
  { label: "Teams", icon: <FiUsers /> },
  { label: "Users", icon: <FiUser /> },
];

//Dashboard=====================================================================

const stats = [
  { title: "Total Reports", value: 128, accent: "#3567a8" },
  { title: "Flood Reports", value: 34, accent: "#2d8cff" },
  { title: "Dust Reports", value: 22, accent: "#3cb878" },
  { title: "Narrow Road", value: 18, accent: "#f2a423" },
  { title: "Pending Reports", value: 24, accent: "#e65b5b" },
  
];

const alerts = [
  { color: "red", text: "High flood report detected in Mirpur 10" },
  { color: "orange", text: "Multiple dust complaints in Uttara area" },
  { color: "green", text: "Narrow road risk flagged in Old Dhaka" },
  { color: "blue", text: "Pending reports crossed daily threshold" },
  { color: "blue", text: "Pending reports crossed daily threshold" },
  { color: "blue", text: "Pending reports crossed daily threshold" },
  { color: "blue", text: "Pending reports crossed daily threshold" },
  { color: "blue", text: "Pending reports crossed daily threshold" },
  { color: "blue", text: "Pending reports crossed daily threshold" },
  { color: "blue", text: "Pending reports crossed daily threshold" },
  { color: "blue", text: "Pending reports crossed daily threshold" },
];

const recentReports = [
  "New flood report submitted from Badda",
  "Verification team accepted Dhanmondi case",
  "Traffic issue updated in Mohammadpur",
  "Resolved report archived from Farmgate",
  "Resolved report archived from Farmgate",
  "Resolved report archived from Farmgate",
  "Resolved report archived from Farmgate",
  "Resolved report archived from Farmgate",
  "Resolved report archived from Farmgate",
  "Resolved report archived from Farmgate",
  "Resolved report archived from Farmgate",
  "Resolved report archived from Farmgate",
];

const typeOptions = [
  "All",
  "Flood",
  "Dust",
  "Narrow Road",
  "Blocked Drain",
  "Water Logging",
  "Road Damage",
];

const statusOptions = [
  "All",
  "Pending",
  "Verified",
  "In Progress",
  "Resolved",
  "Rejected",
];

//Dashboard end===================================================================================



//Verification Start================================================================================

const verificationRequests = [
  {
    title: "Narrow Street Issue",
    meta: "Street issue verification | 2:00 pm.",
    status: "Pending",
    action: "Review",
    actionClass: "blue",
  },
  {
    title: "Flooded Area Report",
    meta: "Flood report verification | 2:00 pm.",
    status: "Verified",
    action: "View",
    actionClass: "green",
  },
  {
    title: "Dusty Road Incident",
    meta: "Road damage verification | 2:00 pm.",
    status: "Verified",
    action: "View",
    actionClass: "blue",
  },
  {
    title: "Dusty Road Incident",
    meta: "Road damage verification | 2:00 pm.",
    status: "Verified",
    action: "View",
    actionClass: "blue",
  },
  {
    title: "Dusty Road Incident",
    meta: "Road damage verification | 2:00 pm.",
    status: "Verified",
    action: "View",
    actionClass: "blue",
  },
  {
    title: "Dusty Road Incident",
    meta: "Road damage verification | 2:00 pm.",
    status: "Verified",
    action: "View",
    actionClass: "blue",
  },
];

const verificationPhotosRight = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
];

//Verification end================================================================================


//Team start======================================================================================

const teamMembers = [
  {
    name: "Amit Sharma",
    role: "Field Inspector",
    image: "https://i.pravatar.cc/300?img=12",
  },
  {
    name: "Neha Patel",
    role: "Data Analyst",
    image: "https://i.pravatar.cc/300?img=47",
  },
  {
    name: "Rajesh Verma",
    role: "Surveyor",
    image: "https://i.pravatar.cc/300?img=15",
  },
  {
    name: "Sara Khan",
    role: "Team Coordinator",
    image: "https://i.pravatar.cc/300?img=32",
  },
  {
    name: "Sara Khan",
    role: "Team Coordinator",
    image: "https://i.pravatar.cc/300?img=32",
  },
  {
    name: "Sara Khan",
    role: "Team Coordinator",
    image: "https://i.pravatar.cc/300?img=32",
  },
  {
    name: "Sara Khan",
    role: "Team Coordinator",
    image: "https://i.pravatar.cc/300?img=32",
  },
  {
    name: "Sara Khan",
    role: "Team Coordinator",
    image: "https://i.pravatar.cc/300?img=32",
  },
];

const teamActivity = [
  { title: "Reports Filed", value: 230, colorClass: "blue" },
  { title: "Verifications", value: 185, colorClass: "orange" },
  { title: "Active Tasks", value: 29, colorClass: "darkblue" },
];

//Team end======================================================================================



//User start======================================================================================

const usersList = [
  {
    name: "Rahul Gupta",
    status: "Active",
    image: "https://i.pravatar.cc/100?img=11",
  },
  {
    name: "Priya Singh",
    status: "Active",
    image: "https://i.pravatar.cc/100?img=47",
  },
  {
    name: "Anil Kumar",
    status: "Pro",
    image: "https://i.pravatar.cc/100?img=15",
  },
  {
    name: "Sonia Mehta",
    status: "Basic",
    image: "https://i.pravatar.cc/100?img=32",
  },
];

const userStats = [
  { label: "Total Users", value: "1,250" },
  { label: "Active Users", value: "940" },
  { label: "New Signups", value: "65" },
];

const reportsSubmittedList = [
  { label: "Today Submitted", value: "18" },
  { label: "This Week", value: "74" },
  { label: "This Month", value: "210" },
];

const userActivityList = [
  "Rahul Gupta submitted a flood report",
  "Priya Singh verified a road condition",
  "Anil Kumar updated profile details",
  "Sonia Mehta joined the platform",
];

//User end======================================================================================

const StatCard: React.FC<StatCardProps> = ({ title, value, accent }) => {
  return (
    <div className="stat-card" style={{ ["--accent" as any]: accent }}>
      <div className="stat-card-title">{title}</div>
      <div className="stat-card-value" style={{ color: accent }}>
        {value}
      </div>
      <div className="stat-card-bar" />
    </div>
  );
};

const AdminDashboard: React.FC = () => {
const [selectedType, setSelectedType] = useState("All");
const [selectedStatus, setSelectedStatus] = useState("All");
const [showAdminMenu, setShowAdminMenu] = useState(false);
const [activePage, setActivePage] = useState("Dashboard");

  const adminMenuRef = useRef<HTMLDivElement | null>(null);

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

  const handleLogout = () => {
    alert("Logout clicked");
    setShowAdminMenu(false);
  };

  const renderDashboardPage = () => {
    return (
      <section className="dashboard-wrapper">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="typeSelect">Type:</label>
            <div className="real-select-box">
              <select
                id="typeSelect"
                value={selectedType}
                onChange={(e) =>{setSelectedType(e.target.value);
                                       //Dashboard=>Status
                }}
              >
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <FiChevronDown className="select-arrow-icon" />
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="statusSelect">Status:</label>
            <div className="real-select-box">
              <select
                id="statusSelect"
                value={selectedStatus}
                onChange={
                    (e) => {setSelectedStatus(e.target.value);
                                   //Dashboard=>Status
                    }
                }
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <FiChevronDown className="select-arrow-icon" />
            </div>
          </div>

          
        </div>

        <div className="stats-row">
          {stats.map((stat) => (
            <StatCard                   //Dashboard=>reports number
              key={stat.title}
              title={stat.title}
              value={stat.value}
              accent={stat.accent}
            />
          ))}

          
        </div>

        <div className="cards-only-section">
          <div className="info-card">
            <div className="info-card-header">
              <h3>Alerts</h3>
            </div>

            <div className="info-card-body scrollable-card-body">
              {alerts.map((alert, index) => (
                <div key={index} className="list-item">
                  <span className={`bullet ${alert.color}`} />
                  <span>{alert.text} </span>                 
                </div>
              ))}
            </div>
          </div>

          <div className="info-card scrollable-card-body">
            <div className="info-card-header">
              <h3>Recent Reports</h3>
            </div>

            <div className="info-card-body">
              {recentReports.map((report, index) => (
                <div key={index} className="list-item">
                  <span className="bullet blue" />
                  <span>{report}</span>                 
                </div>
              ))}
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
            {verificationRequests.map((item, index) => (
              <div className="verification-request-row" key={index}>
                <div className="verification-request-text">
                  <h4>{item.title}</h4>
                  <p>{item.meta}</p>
                </div>

                <div className="verification-request-right">
                  <span
                    className={`verification-status-text ${item.status.toLowerCase()}`}
                  >
                    {item.status}
                  </span>

                  <button
                    className={`verification-action-btn ${item.actionClass}`}
                  >
                    {item.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="verification-card status-card">
          <h3 className="verification-card-title">Verification Status</h3>

          <div className="verification-status-list">
            <div className="verification-status-row">
              <span>Pending</span>
              <strong>54%</strong>
            </div>
            <div className="verification-status-row">
              <span>Reviewed</span>
              <strong>32%</strong>
            </div>
            <div className="verification-status-row">
              <span>Rejected</span>
              <strong>14%</strong>
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
              {teamMembers.map((member, index) => (
                <div className="team-member-card" key={index}>
                  <div className="team-member-image">
                    <img src={member.image} alt={member.name} />
                  </div>
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              ))}
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
                    <span className={`activity-icon ${item.colorClass}`}>↗</span>
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
              {usersList.map((user, index) => (
                <div className="user-row" key={index}>
                  <div className="user-row-left">
                    <div className="user-avatar">
                      <img src={user.image} alt={user.name} />
                    </div>
                    <span className="user-name">{user.name}</span>
                  </div>

                  <div className="user-row-right">
                    <span
                      className={`user-badge ${user.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {user.status}
                    </span>

                    <button className="user-view-btn">View</button>
                  </div>
                </div>
              ))}
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
              {userActivityList.map((item, index) => (
                <div className="user-activity-row" key={index}>
                  <span className="bullet blue" />
                  <span>{item}</span>
                </div>
              ))}
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
        <div className="sidebar-top">
        </div>
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
            <button className="topbar-icon-btn">
              <FiBell />
              <span className="notification-badge">3</span>
            </button>

            <button className="topbar-icon-btn">
              <FiMail />
            </button>

            <div className="admin-dropdown-wrapper" ref={adminMenuRef}>
              <div
                className="admin-profile"
                onClick={() => setShowAdminMenu((prev) => !prev)}
              >
                <img
                  src="https://i.pravatar.cc/100?img=12"        //admin Profile picture 
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
                    onClick={handleLogout}                  //Clicking logout
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