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
import { MDBIcon } from "mdb-react-ui-kit";

const menuItems = [
  { label: "Dashboard", icon: <FiGrid /> },
  { label: "Verification", icon: <FiCheckSquare /> },
  { label: "Teams", icon: <FiUsers /> },
  { label: "Users", icon: <FiUser /> },
];

const alerts = [
  { color: "red", text: "High flood report detected in Mirpur 10" },
  { color: "orange", text: "Multiple dust complaints in Uttara area" },
  { color: "green", text: "Narrow road risk flagged in Old Dhaka" },
  { color: "blue", text: "Pending reports crossed daily threshold" },
];

const recentReports = [
  "New flood report submitted from Badda",
  "Verification team accepted Dhanmondi case",
  "Traffic issue updated in Mohammadpur",
  "Resolved report archived from Farmgate",
  "Critical infrastructure update in Gulshan",
];

const verificationRequests = [
  { title: "Narrow Street Issue", meta: "Street issue verification | 2:00 pm.", status: "Pending", action: "Review", actionClass: "blue" },
  { title: "Flooded Area Report", meta: "Flood report verification | 2:00 pm.", status: "Verified", action: "View", actionClass: "green" },
  { title: "Dusty Road Incident", meta: "Road damage verification | 2:00 pm.", status: "Verified", action: "View", actionClass: "blue" },
];

const teamMembers = [
  { name: "Amit Sharma", role: "Field Inspector", image: "https://i.pravatar.cc/300?img=12" },
  { name: "Neha Patel", role: "Data Analyst", image: "https://i.pravatar.cc/300?img=47" },
  { name: "Rajesh Verma", role: "Surveyor", image: "https://i.pravatar.cc/300?img=15" },
  { name: "Sara Khan", role: "Team Coordinator", image: "https://i.pravatar.cc/300?img=32" },
];

const AdminDashboard: React.FC = () => {
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const adminMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setShowAdminMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowAdminMenu(false);
    window.location.href = "/landing";
  };

  const renderDashboardPage = () => (
    <section className="dashboard-wrapper">
      <div className="dashboard-header animate-fade-in">
        <h1>Dashboard Overview</h1>
      </div>

      <div className="bento-grid">
        <div className="bento-card large shadow-premium">
          <div className="stat-icon-wrapper bg-primary-soft"><FiGrid /></div>
          <div className="stat-value">128</div>
          <div className="stat-label">Total Reports</div>
          <div className="stat-growth growth-up">
            <MDBIcon fas icon="arrow-up" className="me-1" />
            <span>+14.2%</span>
            <span className="text-muted ms-2 fw-normal">since last month</span>
          </div>
        </div>

        <div className="bento-card medium">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="stat-icon-wrapper bg-amber-soft"><FiBell /></div>
              <div className="stat-value">24</div>
              <div className="stat-label">Pending Verification</div>
            </div>
            <div className="progress-ring-mini"></div>
          </div>
        </div>

        <div className="bento-card">
          <div className="stat-icon-wrapper bg-purple-soft"><FiCheckSquare /></div>
          <div className="stat-value">34</div>
          <div className="stat-label">Flood Cases</div>
        </div>

        <div className="bento-card">
          <div className="stat-icon-wrapper bg-pink-soft"><FiUsers /></div>
          <div className="stat-value">22</div>
          <div className="stat-label">Dust Reports</div>
        </div>
      </div>

      <div className="info-section-grid">
        <div className="glass-card">
          <div className="glass-card-header">
            <h3>System Alerts</h3>
            <a href="#view-all" className="action-link">View All</a>
          </div>
          <div className="scrollable-card-body">
            {alerts.map((alert, index) => (
              <div key={index} className="modern-list-item">
                <span className={`bullet ${alert.color}`} />
                <div className="item-content">
                  <h4>{alert.text}</h4>
                  <p>Reported 2 hours ago • Regional Office 4</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <div className="glass-card-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="scrollable-card-body">
            {recentReports.map((report, index) => (
              <div key={index} className="modern-list-item">
                <div className="item-icon bg-primary-soft"><FiUser /></div>
                <div className="item-content">
                  <h4>{report}</h4>
                  <p>Verified by admin • 10:45 AM</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  const renderVerificationPage = () => (
    <section className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1>Verification Requests</h1>
      </div>
      <div className="glass-card">
        {verificationRequests.map((item, index) => (
          <div className="verification-request-row" key={index}>
            <div className="verification-request-text">
              <h4>{item.title}</h4>
              <p>{item.meta}</p>
            </div>
            <div className="verification-request-right">
              <span className={`verification-status-text status-${item.status.toLowerCase()}`}>{item.status}</span>
              <button className={`verification-action-btn ${item.actionClass}`}>{item.action}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const renderTeamsPage = () => (
    <section className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1>Our Strategic Teams</h1>
      </div>
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
    </section>
  );

  const renderActivePage = () => {
    switch (activePage) {
      case "Verification": return renderVerificationPage();
      case "Teams": return renderTeamsPage();
      case "Users": return renderDashboardPage(); // Placeholder for Users
      default: return renderDashboardPage();
    }
  };

  return (
    <div className="admin-dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-top">
          <MDBIcon fas icon="city" size="2x" className="text-white" />
          <span className="sidebar-logo-text">Nagorik-AI</span>
        </div>
        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <div
              key={item.label}
              className={`sidebar-item ${activePage === item.label ? "active" : ""}`}
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
            <button className="topbar-icon-btn"><FiBell /><span className="notification-badge">3</span></button>
            <button className="topbar-icon-btn"><FiMail /></button>
            
            <div className="admin-dropdown-wrapper" ref={adminMenuRef}>
              <div className="admin-profile" onClick={() => setShowAdminMenu((prev) => !prev)}>
                <img src="https://i.pravatar.cc/100?img=12" alt="Admin" className="admin-avatar" />
                <span className="admin-name">Admin</span>
                <FiChevronDown className="admin-dropdown-icon" />
              </div>

              {showAdminMenu && (
                <div className="admin-dropdown-menu">
                  <button className="admin-dropdown-item" onClick={handleLogout}>Logout</button>
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