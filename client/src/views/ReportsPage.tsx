import React, { useEffect, useState } from "react";
import "../styles/ReportsPage.css";

type Report = {
  id: number;
  title: string;
  description: string | null;
  alert: string;
  reporter: {
    id: number;
    first_name: string;
    last_name: string;
  };
};

type ReportsResponse = {
  data: Report[];
};

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("auth_token");

    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/admin/reports", {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }

        const json: ReportsResponse = await response.json();

        const filteredReports = (json.data || []).filter(
          (report) => String(report.reporter?.id) === String(userId)
        );

        setReports(filteredReports);

        if (filteredReports.length > 0) {
          setUserName(
            `${filteredReports[0].reporter.first_name} ${filteredReports[0].reporter.last_name}`
          );
        }
      } catch (error) {
        console.error("Reports page fetch error:", error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [userId]);

  return (
    <div className="reports-page">
      <div className="reports-container">
        <div className="reports-header">
          <h1>Reports by {userName}</h1>
          <p>All submitted reports for this user are shown below.</p>
        </div>

        <div className="reports-grid">
          {loading ? (
            <div className="report-card">
              <div className="report-content">
                <h2>Loading...</h2>
                <p>Please wait while reports are being loaded.</p>
              </div>
            </div>
          ) : reports.length > 0 ? (
            reports.map((report) => (
              <div className="report-card" key={report.id}>
                <div className="report-card-top">
                  <div className="report-avatar">
                    <img
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      alt={report.title}
                    />
                  </div>

                  <div className="reporter-info">
                    <h3>
                      {report.reporter.first_name} {report.reporter.last_name}
                    </h3>
                    <span>
                      {report.alert.charAt(0).toUpperCase() + report.alert.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="report-content">
                  <h2>{report.title}</h2>
                  <p>
                    {report.description
                      ? report.description
                      : "No description available for this report."}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="report-card">
              <div className="report-content">
                <h2>No Reports Found</h2>
                <p>This user has no reports to show.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;