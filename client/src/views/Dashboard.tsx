import React, { useState } from 'react';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBIcon,
    MDBTypography,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBBadge,
    MDBInput,
    MDBTextArea,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import { secrets } from '../secrets';
import Chatbot from '../components/Chatbot';

interface Report {
    id: number;
    title: string;
    category: string;
    status: 'pending' | 'in-progress' | 'resolved';
    lastUpdated: string;
    rawDate?: string;
    description: string;
    imageUrl?: string;
}

interface NearbyIssue {
    id: number;
    title: string;
    distance: string;
    category: string;
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [showNewReportModal, setShowNewReportModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterDate, setFilterDate] = useState('all');
    const [reportTab, setReportTab] = useState<'mine' | 'all'>('mine');

    const [reports, setReports] = useState<Report[]>([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Clock effect
    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch reports from backend (re-runs whenever tab changes)
    React.useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) return;

                const url = reportTab === 'mine'
                    ? `${secrets.backendEndpoint}/api/v1/reports?mine=true`
                    : `${secrets.backendEndpoint}/api/v1/reports`;

                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.data) {
                        const parsedReports = data.data.map((r: any) => ({
                            id: r.id,
                            title: r.title,
                            category: r.category || 'General',
                            status: r.status || 'pending',
                            lastUpdated: new Date(r.updated_at).toLocaleString(),
                            rawDate: r.updated_at,
                            description: r.description,
                            imageUrl: (r.files && r.files.length > 0) ? r.files[0].url : 'https://images.unsplash.com/photo-1548243407-3a131b74d47d?auto=format&fit=crop&q=80&w=400'
                        }));
                        setReports(parsedReports);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch reports", error);
            }
        };
        fetchReports();
    }, [reportTab]);

    const [nearbyIssues] = useState<NearbyIssue[]>([
        { id: 1, title: 'Water Leakage', distance: '0.5 km', category: 'Water Supply' },
        { id: 2, title: 'Traffic Signal Malfunction', distance: '1.2 km', category: 'Traffic' },
        { id: 3, title: 'Park Maintenance', distance: '2.1 km', category: 'Parks' },
    ]);

    const toggleNewReportModal = () => setShowNewReportModal(!showNewReportModal);

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { color: 'warning' as const, text: 'Pending', icon: 'clock' },
            'in-progress': { color: 'info' as const, text: 'In Progress', icon: 'cog' },
            resolved: { color: 'success' as const, text: 'Resolved', icon: 'check-circle' },
        };

        const config = statusConfig[status as keyof typeof statusConfig];
        return (
            <MDBBadge color={config.color} className="status-badge">
                <MDBIcon fas icon={config.icon} className="me-1" />
                {config.text}
            </MDBBadge>
        );
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('avatar_5');
        navigate('/landing', { replace: true });
    };

    const filteredReports = reports.filter((report) => {
        const matchesSearch =
            report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
        const matchesCategory = filterCategory === 'all' || report.category.toLowerCase() === filterCategory.toLowerCase();
        
        let matchesDate = true;
        if (filterDate !== 'all' && report.rawDate) {
            const rDate = new Date(report.rawDate);
            const now = new Date();
            const diffDays = (now.getTime() - rDate.getTime()) / (1000 * 3600 * 24);
            
            if (filterDate === 'today') {
                matchesDate = rDate.toDateString() === now.toDateString();
            } else if (filterDate === '7days') {
                matchesDate = diffDays <= 7;
            } else if (filterDate === '30days') {
                matchesDate = diffDays <= 30;
            }
        }
        
        return matchesSearch && matchesStatus && matchesCategory && matchesDate;
    });

    return (
        <div className="dashboard-page">
            {/* Main Content */}
            <MDBContainer fluid className="py-4">
                {/* User Greeting */}
                <MDBRow className="mb-4">
                    <MDBCol>
                        <div className="greeting-card p-4 bg-gradient-primary text-white rounded shadow">
                            <MDBRow className="align-items-center">
                                <MDBCol md="8">
                                    <MDBTypography tag="h3" className="fw-bold mb-2">
                                        Welcome back, Citizen!
                                    </MDBTypography>
                                    <div className="digital-clock mb-3">
                                        <MDBIcon far icon="clock" className="me-2" />
                                        <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                        <span className="ms-2 opacity-75 small">{currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <MDBTypography tag="p" className="mb-0 opacity-90">
                                        You have {reports.filter((r) => r.status !== 'resolved').length} active
                                        reports and {nearbyIssues.length} nearby issues
                                    </MDBTypography>
                                </MDBCol>
                                <MDBCol md="4" className="text-md-end">
                                    <MDBBtn
                                        color="light"
                                        size="lg"
                                        className="new-report-btn"
                                        onClick={() => navigate('/submit-report')}
                                    >
                                        <MDBIcon fas icon="plus" className="me-2" />
                                        New Report
                                    </MDBBtn>
                                </MDBCol>
                            </MDBRow>
                        </div>
                    </MDBCol>
                </MDBRow>

                <MDBRow>
                    {/* Left Column - My Reports */}
                    <MDBCol lg="8" className="mb-4">
                        <MDBCard className="border-0 shadow-sm h-100">
                            <MDBCardBody>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <MDBTypography tag="h5" className="fw-bold mb-0">
                                        <MDBIcon fas icon="file-alt" className="me-2 text-primary" />
                                        {reportTab === 'mine' ? 'My Reports' : 'All Reports'}
                                    </MDBTypography>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="btn-group btn-group-sm" role="group">
                                            <button
                                                type="button"
                                                className={`btn ${reportTab === 'mine' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                onClick={() => setReportTab('mine')}
                                            >
                                                <MDBIcon fas icon="user" className="me-1" />My Reports
                                            </button>
                                            <button
                                                type="button"
                                                className={`btn ${reportTab === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                onClick={() => setReportTab('all')}
                                            >
                                                <MDBIcon fas icon="globe" className="me-1" />All Reports
                                            </button>
                                        </div>
                                        <MDBBtn color="link" size="sm" onClick={() => navigate('/history')}>
                                            View All
                                        </MDBBtn>
                                    </div>
                                </div>

                                {/* Search and Filter */}
                                <MDBRow className="mb-4">
                                    <MDBCol md="3" className="mb-2 mb-md-0">
                                        <MDBInput
                                            label="Search reports..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </MDBCol>
                                    <MDBCol md="3" className="mb-2 mb-md-0">
                                        <select
                                            className="form-select"
                                            value={filterCategory}
                                            onChange={(e) => setFilterCategory(e.target.value)}
                                        >
                                            <option value="all">All Categories</option>
                                            <option value="infrastructure">Infrastructure</option>
                                            <option value="roads">Roads</option>
                                            <option value="sanitation">Sanitation</option>
                                            <option value="water supply">Water Supply</option>
                                            <option value="traffic">Traffic</option>
                                            <option value="parks & recreation">Parks & Recreation</option>
                                            <option value="general">General</option>
                                        </select>
                                    </MDBCol>
                                    <MDBCol md="3" className="mb-2 mb-md-0">
                                        <select
                                            className="form-select"
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                        >
                                            <option value="all">All Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                        </select>
                                    </MDBCol>
                                    <MDBCol md="3">
                                        <select
                                            className="form-select"
                                            value={filterDate}
                                            onChange={(e) => setFilterDate(e.target.value)}
                                        >
                                            <option value="all">All Time</option>
                                            <option value="today">Today</option>
                                            <option value="7days">Last 7 Days</option>
                                            <option value="30days">Last 30 Days</option>
                                        </select>
                                    </MDBCol>
                                </MDBRow>

                                {/* Reports List */}
                                <div className="reports-list">
                                    {filteredReports.length === 0 ? (
                                        <div className="text-center py-5 text-muted">
                                            <MDBIcon fas icon="inbox" size="3x" className="mb-3 opacity-50" />
                                            <p>No reports found</p>
                                        </div>
                                    ) : (
                                        filteredReports.map((report) => (
                                            <MDBCard key={report.id} className="report-card mb-3 border-0 shadow-sm">
                                                <MDBCardBody>
                                                    <MDBRow className="align-items-center">
                                                        <MDBCol md="2" className="d-none d-md-block">
                                                            <div className="report-card-img-wrapper rounded overflow-hidden">
                                                                <img 
                                                                    src={report.imageUrl} 
                                                                    alt={report.title} 
                                                                    className="img-fluid w-100 h-100 object-fit-cover"
                                                                    style={{ minHeight: '80px' }}
                                                                />
                                                            </div>
                                                        </MDBCol>
                                                        <MDBCol md="6">
                                                            <MDBTypography tag="h6" className="fw-bold mb-2">
                                                                {report.title}
                                                            </MDBTypography>
                                                            <div className="d-flex align-items-center text-muted small mb-2">
                                                                <MDBIcon fas icon="tag" className="me-1" />
                                                                <span className="me-3">{report.category}</span>
                                                                <MDBIcon fas icon="clock" className="me-1" />
                                                                <span>{report.lastUpdated}</span>
                                                            </div>
                                                            <p className="text-muted small mb-0">{report.description}</p>
                                                        </MDBCol>
                                                        <MDBCol md="4" className="text-md-end">
                                                            {getStatusBadge(report.status)}
                                                            <div className="mt-2">
                                                                <MDBBtn
                                                                    color="link"
                                                                    size="sm"
                                                                    className="text-primary"
                                                                    onClick={() => navigate('/history')}
                                                                >
                                                                    View Details
                                                                </MDBBtn>
                                                            </div>
                                                        </MDBCol>
                                                    </MDBRow>
                                                </MDBCardBody>
                                            </MDBCard>
                                        ))
                                    )}
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>

                    {/* Right Column - Nearby Issues */}
                    <MDBCol lg="4">
                        <MDBCard className="border-0 shadow-sm mb-4">
                            <MDBCardBody>
                                <MDBTypography tag="h5" className="fw-bold mb-4">
                                    <MDBIcon fas icon="map-marker-alt" className="me-2 text-danger" />
                                    Nearby Issues
                                </MDBTypography>

                                {/* Map Placeholder */}
                                <div
                                    className="map-placeholder bg-light rounded mb-3 d-flex align-items-center justify-content-center"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate('/location-picker')}
                                >
                                    <div className="text-center text-muted p-4">
                                        <MDBIcon fas icon="map-marked-alt" size="3x" className="mb-2 text-primary opacity-75" />
                                        <p className="small mb-0 fw-bold">Open Interactive Map</p>
                                    </div>
                                </div>

                                {/* Nearby Issues List */}
                                <div className="nearby-issues-list">
                                    {nearbyIssues.map((issue) => (
                                        <div key={issue.id} className="nearby-issue-item p-3 mb-2 bg-light rounded">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <MDBTypography tag="h6" className="fw-bold mb-1 small">
                                                        {issue.title}
                                                    </MDBTypography>
                                                    <p className="text-muted mb-0 small">
                                                        <MDBIcon fas icon="tag" className="me-1" />
                                                        {issue.category}
                                                    </p>
                                                </div>
                                                <MDBBadge color="light" className="text-dark">
                                                    <MDBIcon fas icon="location-arrow" className="me-1" />
                                                    {issue.distance}
                                                </MDBBadge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </MDBCardBody>
                        </MDBCard>

                        {/* Quick Stats */}
                        <MDBCard className="border-0 shadow-sm mb-4">
                            <MDBCardBody>
                                <MDBTypography tag="h5" className="fw-bold mb-4">
                                    <MDBIcon fas icon="chart-bar" className="me-2 text-success" />
                                    Quick Stats
                                </MDBTypography>

                                <div className="stat-item mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted">Total Reports</span>
                                        <span className="fw-bold fs-5 text-primary">{reports.length}</span>
                                    </div>
                                </div>

                                <div className="stat-item mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted">Resolved</span>
                                        <span className="fw-bold fs-5 text-success">
                                            {reports.filter((r) => r.status === 'resolved').length}
                                        </span>
                                    </div>
                                </div>

                                <div className="stat-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted">Active</span>
                                        <span className="fw-bold fs-5 text-warning">
                                            {reports.filter((r) => r.status !== 'resolved').length}
                                        </span>
                                    </div>
                                </div>
                            </MDBCardBody>
                        </MDBCard>

                        {/* Recent Media (Picture Cart) */}
                        <MDBCard className="border-0 shadow-sm recent-media-card">
                            <MDBCardBody>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <MDBTypography tag="h5" className="fw-bold mb-0">
                                        <MDBIcon fas icon="images" className="me-2 text-info" />
                                        Recent Media
                                    </MDBTypography>
                                    <MDBBtn color="link" size="sm" onClick={() => navigate('/history')}>
                                        View All
                                    </MDBBtn>
                                </div>
                                <div className="recent-media-grid">
                                    {reports.filter(r => r.imageUrl).slice(0, 6).map((report, idx) => (
                                        <div key={idx} className="media-thumb-wrapper" onClick={() => navigate('/history')}>
                                            <img src={report.imageUrl} alt="Recent" className="media-thumb" />
                                            <div className="media-overlay">
                                                <MDBIcon fas icon="eye" />
                                            </div>
                                        </div>
                                    ))}
                                    {reports.filter(r => r.imageUrl).length === 0 && (
                                        <div className="text-center py-4 text-muted w-100">
                                            <MDBIcon fas icon="image" size="2x" className="mb-2 opacity-50" />
                                            <p className="small mb-0">No media found</p>
                                        </div>
                                    )}
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>

            {/* New Report Modal */}
            <MDBModal open={showNewReportModal} onClose={toggleNewReportModal} tabIndex="-1">
                <MDBModalDialog size="lg">
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>
                                <MDBIcon fas icon="flag" className="me-2 text-primary" />
                                Submit New Report
                            </MDBModalTitle>
                            <MDBBtn
                                className="btn-close"
                                color="none"
                                onClick={toggleNewReportModal}
                            ></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <form>
                                <div className="mb-4">
                                    <MDBInput label="Report Title" type="text" required />
                                </div>

                                <div className="mb-4">
                                    <select className="form-select" defaultValue="" required>
                                        <option value="" disabled>
                                            Select Category
                                        </option>
                                        <option value="infrastructure">Infrastructure</option>
                                        <option value="roads">Roads</option>
                                        <option value="sanitation">Sanitation</option>
                                        <option value="water">Water Supply</option>
                                        <option value="traffic">Traffic</option>
                                        <option value="parks">Parks & Recreation</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <MDBInput label="Location" type="text" required />
                                    <small className="text-muted d-block mt-1">
                                        <MDBIcon fas icon="map-marker-alt" className="me-1" />
                                        Enter the location of the issue
                                    </small>
                                </div>

                                <div className="mb-4">
                                    <MDBTextArea label="Description" rows={4} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Upload Photos (Optional)</label>
                                    <input type="file" className="form-control" multiple accept="image/*" />
                                    <small className="text-muted">You can upload up to 5 photos</small>
                                </div>
                            </form>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={toggleNewReportModal}>
                                Cancel
                            </MDBBtn>
                            <MDBBtn color="primary" onClick={toggleNewReportModal}>
                                <MDBIcon fas icon="paper-plane" className="me-2" />
                                Submit Report
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>

            {/* Floating Action Button (Mobile) */}
            <MDBBtn
                color="primary"
                size="lg"
                floating
                className="fab-mobile d-lg-none"
                onClick={() => navigate('/submit-report')}
            >
                <MDBIcon fas icon="plus" size="2x" />
            </MDBBtn>

            {/* Chatbot Component */}
            <Chatbot />
        </div>
    );
};

export default Dashboard;
