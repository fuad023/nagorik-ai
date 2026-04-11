import React, { useState } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBTypography,
  MDBBadge,
  MDBIcon,
  MDBBtn
} from 'mdb-react-ui-kit';
import '../styles/report-history.css';
import { secrets } from '../secrets';

interface TimelineStep {
  status: string;
  date: string;
  icon: string;
  completed: boolean;
}

interface Report {
  id: string | number;
  title: string;
  category: string;
  date: string;
  status: string;
  description: string;
  location: string;
  image: string;
  timeline: TimelineStep[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending': return 'danger';
    case 'In Progress': return 'warning';
    case 'Resolved': return 'success';
    default: return 'primary';
  }
};

const ReportHistory: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [reports, setReports] = useState<Report[]>([]);

  React.useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        const response = await fetch(`${secrets.backendEndpoint}/api/v1/reports`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            const parsedReports: Report[] = data.data.map((r: any) => {
              // Convert status from 'pending' to 'Pending' etc to match UI expectations
              const formattedStatus = r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1).replace('-', ' ') : 'Pending';
              
              return {
                id: r.id,
                title: r.title,
                category: r.category || 'General',
                date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: formattedStatus,
                description: r.description,
                location: r.title, // In backend, 'title' currently stores the location string
                image: (r.files && r.files.length > 0) ? r.files[0].url : 'https://images.unsplash.com/photo-1548243407-3a131b74d47d?auto=format&fit=crop&q=80&w=400',
                timeline: [
                  { status: 'Submitted', date: new Date(r.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }), icon: 'clock', completed: true },
                  { status: 'Assigned', date: 'Pending', icon: 'user-tie', completed: formattedStatus !== 'Pending' },
                  { status: 'In Progress', date: 'Pending', icon: 'tools', completed: formattedStatus === 'In Progress' || formattedStatus === 'Resolved' },
                  { status: 'Resolved', date: 'Pending', icon: 'check-circle', completed: formattedStatus === 'Resolved' }
                ]
              };
            });
            setReports(parsedReports);
          }
        }
      } catch (error) {
        console.error("Failed to fetch reports", error);
      }
    };
    fetchReports();
  }, []);

  const filteredReports = filter === 'All' 
    ? reports 
    : reports.filter(r => filter === 'Open' ? r.status !== 'Resolved' : r.status === 'Resolved');

  const toggleExpand = (id: string | number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <MDBContainer className="py-5 report-history-container">
      <MDBRow className="mb-4">
        <MDBCol>
          <h3 className="fw-bold text-dark mb-3">Report History</h3>
          
          {/* Filters */}
          <div className="d-flex gap-2 filter-tabs">
            <MDBBtn 
              color={filter === 'All' ? 'primary' : 'light'} 
              className={`rounded-pill shadow-sm fw-bold px-4 ${filter !== 'All' ? 'text-dark' : ''}`}
              onClick={() => setFilter('All')}
            >
              All
            </MDBBtn>
            <MDBBtn 
              color={filter === 'Open' ? 'warning' : 'light'} 
              className={`rounded-pill shadow-sm fw-bold px-4 ${filter !== 'Open' ? 'text-dark' : 'text-dark'}`}
              onClick={() => setFilter('Open')}
              style={filter === 'Open' ? { backgroundColor: '#ff9800', border: 'none' } : {}}
            >
              Open
            </MDBBtn>
            <MDBBtn 
              color={filter === 'Resolved' ? 'success' : 'light'} 
              className={`rounded-pill shadow-sm fw-bold px-4 ${filter !== 'Resolved' ? 'text-dark' : ''}`}
              onClick={() => setFilter('Resolved')}
            >
              Resolved
            </MDBBtn>
          </div>
        </MDBCol>
      </MDBRow>

      <MDBRow>
        <MDBCol>
          {filteredReports.map((report) => (
            <MDBCard key={report.id} className="mb-4 border-0 shadow-sm report-card overflow-hidden">
              <MDBCardBody className="p-0">
                <div 
                  className="d-flex flex-column flex-md-row cursor-pointer card-content-wrapper" 
                  onClick={() => toggleExpand(report.id)}
                >
                  {/* Thumbnail */}
                  <div className="report-thumbnail-wrapper">
                    <img src={report.image} alt="Report" className="img-fluid report-thumbnail h-100" />
                    <MDBBadge color={getStatusColor(report.status)} className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm fw-bold status-badge z-1" style={{ fontSize: '0.85rem' }}>
                      {report.status}
                    </MDBBadge>
                  </div>
                  
                  {/* Card Main Content */}
                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <MDBTypography tag="h5" className="fw-bold mb-1 report-title text-dark">{report.title}</MDBTypography>
                        <p className="text-muted small mb-0 fw-500">
                          <MDBIcon fas icon="hashtag" className="me-1"/>{report.id} &bull; {report.category}
                        </p>
                      </div>
                      <span className="text-muted small fw-bold"><MDBIcon far icon="calendar-alt" className="me-1"/>{report.date}</span>
                    </div>
                    
                    <p className="text-dark mt-2 mb-3 report-description line-clamp-2">{report.description}</p>
                    
                    <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top border-light">
                      <span className="text-muted small fw-500">
                        <MDBIcon fas icon="map-marker-alt" className="text-danger me-1"/> {report.location}
                      </span>
                      <MDBBtn color="link" className="p-0 text-primary fw-bold text-decoration-none d-flex align-items-center view-details-btn">
                        {expandedId === report.id ? 'Hide Details' : 'View Details'} 
                        <MDBIcon fas icon={expandedId === report.id ? 'chevron-up' : 'chevron-down'} className="ms-2" />
                      </MDBBtn>
                    </div>
                  </div>
                </div>

                {/* Expanded Timeline View */}
                {expandedId === report.id && (
                  <div className="p-4 bg-light border-top timeline-container fade-in">
                    <h6 className="fw-bold text-dark mb-4">Update History</h6>
                    
                    <div className="position-relative px-2 timeline-wrapper">
                      {/* Vertical line indicator */}
                      <div className="position-absolute h-100 timeline-vertical-line" style={{ left: '26px', top: '0', width: '2px', backgroundColor: '#dee2e6' }}></div>
                      
                      {report.timeline.map((step, idx) => (
                        <div key={idx} className="d-flex align-items-start mb-4 position-relative timeline-step">
                          <div 
                            className={`timeline-icon-wrap rounded-circle d-flex align-items-center justify-content-center me-3 z-1 
                               ${step.completed ? (idx === report.timeline.findIndex(s => !s.completed) - 1 || idx === report.timeline.length - 1 && step.completed ? 'bg-primary text-white shadow' : 'bg-success text-white shadow') : 'bg-white text-muted border border-2'}`}
                            style={{ width: '36px', height: '36px' }}
                          >
                            <MDBIcon fas icon={step.icon} />
                          </div>
                          <div>
                            <h6 className={`fw-bold mb-1 ${step.completed ? 'text-dark' : 'text-muted'}`}>{step.status}</h6>
                            <p className="small text-muted mb-0">{step.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 text-end">
                      <MDBBtn outline color="primary" rounded className="fw-bold px-4 me-2 shadow-sm action-btn">
                        <MDBIcon fas icon="map-marked-alt" className="me-2"/> View on Map
                      </MDBBtn>
                      {report.status !== 'Resolved' && (
                        <MDBBtn outline color="secondary" rounded className="fw-bold px-4 shadow-sm action-btn">
                          <MDBIcon fas icon="comment-dots" className="me-2"/> Add Comment
                        </MDBBtn>
                      )}
                    </div>
                  </div>
                )}
              </MDBCardBody>
            </MDBCard>
          ))}
          
          {filteredReports.length === 0 && (
            <div className="text-center py-5">
              <MDBIcon fas icon="box-open" size="3x" className="text-muted mb-3" />
              <h5 className="text-muted">No reports found for this filter.</h5>
            </div>
          )}
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default ReportHistory;
