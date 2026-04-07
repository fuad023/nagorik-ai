import React from 'react';
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
    MDBNavbarLink,
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import '../styles/Landing.css';

const Landing: React.FC = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/registration');
    };

    const handleReport = () => {
        navigate('/login');
    };

    return (
        <div className="landing-page">
            {/* Navigation */}
            <MDBNavbar expand="lg" light bgColor="white" className="shadow-sm sticky-top">
                <MDBContainer>
                    <MDBNavbarBrand href="#">
                        <MDBIcon fas icon="city" size="2x" className="text-primary me-2" />
                        <span className="fw-bold text-primary">Nagorik-AI</span>
                    </MDBNavbarBrand>
                    <MDBNavbarNav className="ms-auto d-flex flex-row">
                        <MDBNavbarItem>
                            <MDBNavbarLink href="#features">Features</MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem className="ms-3">
                            <MDBNavbarLink href="#about">About</MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem className="ms-3">
                            <MDBBtn color="primary" size="sm" onClick={handleLogin}>
                                Sign In
                            </MDBBtn>
                        </MDBNavbarItem>
                    </MDBNavbarNav>
                </MDBContainer>
            </MDBNavbar>

            {/* Hero Section */}
            <section className="hero-section">
                <MDBContainer className="py-5">
                    <MDBRow className="align-items-center min-vh-75">
                        <MDBCol md="6" className="text-center text-md-start">
                            <div className="hero-content animate-fade-in">
                                <MDBTypography tag="h1" className="display-3 fw-bold mb-4 text-primary">
                                    Empower Citizens to Report and Resolve Local Issues
                                </MDBTypography>
                                <MDBTypography tag="p" className="lead text-muted mb-4 fs-5">
                                    Join thousands of citizens using AI-powered tools to make your community better.
                                    Report issues, track progress, and get real-time updates—all in one place.
                                </MDBTypography>
                                <div className="cta-buttons">
                                    <MDBBtn
                                        color="primary"
                                        size="lg"
                                        className="me-3 mb-3 pulse-animation"
                                        onClick={handleReport}
                                    >
                                        <MDBIcon fas icon="flag" className="me-2" />
                                        Report an Issue
                                    </MDBBtn>
                                    <MDBBtn outline color="primary" size="lg" className="mb-3" href="#features">
                                        Learn More
                                    </MDBBtn>
                                </div>
                            </div>
                        </MDBCol>
                        <MDBCol md="6" className="text-center">
                            <div className="hero-illustration animate-slide-in">
                                <MDBIcon fas icon="city" size="10x" className="text-primary opacity-25" />
                            </div>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </section>

            {/* Feature Highlights */}
            <section id="features" className="features-section py-5 bg-light pb-5">
                <MDBContainer>
                    <div className="text-center mb-5 animate-fade-in">
                        <MDBTypography tag="h2" className="display-5 fw-bold mb-3">
                            Smart Civic Solutions
                        </MDBTypography>
                        <MDBTypography tag="p" className="text-muted fs-5 max-w-700 mx-auto">
                            Powerful, AI-driven tools that bridge the gap between citizens and sustainable urban development.
                        </MDBTypography>
                    </div>

                    <MDBRow className="g-4">
                        {/* Feature 1 */}
                        <MDBCol md="6" lg="4">
                            <MDBCard className="feature-card h-100 border-0 shadow-sm glass-hover">
                                <MDBCardBody className="text-center p-5">
                                    <div className="feature-icon-wrapper mb-4 bg-primary-soft rounded-circle mx-auto">
                                        <MDBIcon fas icon="brain" size="3x" className="text-primary" />
                                    </div>
                                    <MDBTypography tag="h5" className="fw-bold mb-3">
                                        AI-Powered Analysis
                                    </MDBTypography>
                                    <MDBTypography tag="p" className="text-muted">
                                        Our sophisticated AI algorithms automatically prioritize and categorize reports, ensuring urgent issues get the attention they deserve.
                                    </MDBTypography>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>

                        {/* Feature 2 */}
                        <MDBCol md="6" lg="4">
                            <MDBCard className="feature-card h-100 border-0 shadow-sm glass-hover">
                                <MDBCardBody className="text-center p-5">
                                    <div className="feature-icon-wrapper mb-4 bg-success-soft rounded-circle mx-auto">
                                        <MDBIcon fas icon="shield-alt" size="3x" className="text-success" />
                                    </div>
                                    <MDBTypography tag="h5" className="fw-bold mb-3">
                                        Verified Transparency
                                    </MDBTypography>
                                    <MDBTypography tag="p" className="text-muted">
                                        Track every report with verifiable blockchain-inspired records. Direct accountability from submission to resolution.
                                    </MDBTypography>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>

                        {/* Feature 3 */}
                        <MDBCol md="6" lg="4">
                            <MDBCard className="feature-card h-100 border-0 shadow-sm glass-hover">
                                <MDBCardBody className="text-center p-5">
                                    <div className="feature-icon-wrapper mb-4 bg-warning-soft rounded-circle mx-auto">
                                        <MDBIcon fas icon="chart-line" size="3x" className="text-warning" />
                                    </div>
                                    <MDBTypography tag="h5" className="fw-bold mb-3">
                                        Real-Time Insights
                                    </MDBTypography>
                                    <MDBTypography tag="p" className="text-muted">
                                        Dive into data-driven city analytics. See how your neighborhood is improving with live heatmaps and trend analysis.
                                    </MDBTypography>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>

                        {/* Feature 4 */}
                        <MDBCol md="6" lg="4">
                            <MDBCard className="feature-card h-100 border-0 shadow-sm glass-hover">
                                <MDBCardBody className="text-center p-5">
                                    <div className="feature-icon-wrapper mb-4 bg-info-soft rounded-circle mx-auto">
                                        <MDBIcon fas icon="comments" size="3x" className="text-info" />
                                    </div>
                                    <MDBTypography tag="h5" className="fw-bold mb-3">
                                        Community Hub
                                    </MDBTypography>
                                    <MDBTypography tag="p" className="text-muted">
                                        Engage with other citizens, vote on proposed city improvements, and participate in local governance discussions.
                                    </MDBTypography>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>

                        {/* Feature 5 */}
                        <MDBCol md="6" lg="4">
                            <MDBCard className="feature-card h-100 border-0 shadow-sm glass-hover">
                                <MDBCardBody className="text-center p-5">
                                    <div className="feature-icon-wrapper mb-4 bg-danger-soft rounded-circle mx-auto">
                                        <MDBIcon fas icon="mobile-alt" size="3x" className="text-danger" />
                                    </div>
                                    <MDBTypography tag="h5" className="fw-bold mb-3">
                                        Mobile First
                                    </MDBTypography>
                                    <MDBTypography tag="p" className="text-muted">
                                        Report issues on the go. Attach photos, GPS locations, and voice notes directly from your smartphone for instant reporting.
                                    </MDBTypography>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>

                        {/* Feature 6 */}
                        <MDBCol md="6" lg="4">
                            <MDBCard className="feature-card h-100 border-0 shadow-sm glass-hover">
                                <MDBCardBody className="text-center p-5">
                                    <div className="feature-icon-wrapper mb-4 bg-secondary-soft rounded-circle mx-auto">
                                        <MDBIcon fas icon="hands-helping" size="3x" className="text-secondary" />
                                    </div>
                                    <MDBTypography tag="h5" className="fw-bold mb-3">
                                        Volunteer Network
                                    </MDBTypography>
                                    <MDBTypography tag="p" className="text-muted">
                                        Connect with local volunteer groups and participate in community cleanup or improvement programs directly.
                                    </MDBTypography>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </section>

            {/* About Section */}
            <section id="about" className="about-section py-5">
                <MDBContainer>
                    <MDBRow className="align-items-center py-5">
                        <MDBCol lg="6" className="mb-4 mb-lg-0 animate-fade-in">
                            <div className="about-image-container position-relative">
                                <div className="about-image rounded shadow-lg p-5 bg-primary text-white text-center">
                                    <MDBIcon fas icon="lightbulb" size="10x" className="opacity-25" />
                                    <div className="about-overlay">
                                        <MDBTypography tag="h3" className="fw-bold">Innovation For All</MDBTypography>
                                    </div>
                                </div>
                                <div className="about-floating-card shadow-lg p-3 bg-white rounded position-absolute bottom-0 end-0 m-4 animate-bounce">
                                    <div className="d-flex align-items-center">
                                        <MDBIcon fas icon="award" size="2x" className="text-warning me-2" />
                                        <span className="fw-bold">Top Civic Tech 2026</span>
                                    </div>
                                </div>
                            </div>
                        </MDBCol>
                        <MDBCol lg="6" className="ps-lg-5">
                            <MDBTypography tag="h5" className="text-primary fw-bold text-uppercase mb-3">
                                About Nagorik-AI
                            </MDBTypography>
                            <MDBTypography tag="h2" className="display-6 fw-bold mb-4">
                                Pioneering the Future of Digital Civic Engagement
                            </MDBTypography>
                            <MDBTypography tag="p" className="text-muted fs-5 mb-4">
                                At Nagorik-AI, we believe that the technology should empower citizens, not isolate them. Founded in 2026, our mission is to create a seamless interface between city dwellers and the infrastructure that supports them.
                            </MDBTypography>
                            <MDBRow className="g-3 mb-4">
                                <MDBCol sm="6">
                                    <div className="d-flex align-items-center mb-2">
                                        <MDBIcon fas icon="check-circle" className="text-primary me-2" />
                                        <span className="fw-semibold">Community-Led Mission</span>
                                    </div>
                                </MDBCol>
                                <MDBCol sm="6">
                                    <div className="d-flex align-items-center mb-2">
                                        <MDBIcon fas icon="check-circle" className="text-primary me-2" />
                                        <span className="fw-semibold">AI For Social Good</span>
                                    </div>
                                </MDBCol>
                                <MDBCol sm="6">
                                    <div className="d-flex align-items-center mb-2">
                                        <MDBIcon fas icon="check-circle" className="text-primary me-2" />
                                        <span className="fw-semibold">Transparent Operations</span>
                                    </div>
                                </MDBCol>
                                <MDBCol sm="6">
                                    <div className="d-flex align-items-center mb-2">
                                        <MDBIcon fas icon="check-circle" className="text-primary me-2" />
                                        <span className="fw-semibold">Sustainable Growth</span>
                                    </div>
                                </MDBCol>
                            </MDBRow>
                            <MDBBtn outline color="primary" size="lg" className="rounded-pill">
                                Read Our Story
                            </MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </section>

            {/* Trust & Community Section */}
            <section className="trust-section py-5">
                <MDBContainer>
                    <MDBRow className="align-items-center">
                        <MDBCol md="6" className="mb-4 mb-md-0">
                            <MDBTypography tag="h2" className="display-6 fw-bold mb-4">
                                Building Trust Through Transparency
                            </MDBTypography>
                            <MDBTypography tag="p" className="text-muted fs-5 mb-4">
                                Join a community dedicated to making our cities better. Every report matters, and
                                every voice is heard.
                            </MDBTypography>

                            {/* Stats */}
                            <MDBRow className="g-3">
                                <MDBCol xs="6">
                                    <div className="stat-card p-3 bg-light rounded">
                                        <MDBTypography tag="h3" className="text-primary fw-bold mb-0">
                                            5,247
                                        </MDBTypography>
                                        <MDBTypography tag="p" className="text-muted mb-0 small">
                                            Issues Resolved
                                        </MDBTypography>
                                    </div>
                                </MDBCol>
                                <MDBCol xs="6">
                                    <div className="stat-card p-3 bg-light rounded">
                                        <MDBTypography tag="h3" className="text-success fw-bold mb-0">
                                            12,893
                                        </MDBTypography>
                                        <MDBTypography tag="p" className="text-muted mb-0 small">
                                            Active Citizens
                                        </MDBTypography>
                                    </div>
                                </MDBCol>
                            </MDBRow>
                        </MDBCol>

                        <MDBCol md="6">
                            <MDBCard className="border-0 shadow-lg">
                                <MDBCardBody className="p-4">
                                    <div className="mb-3">
                                        <MDBIcon fas icon="quote-left" size="2x" className="text-primary opacity-50" />
                                    </div>
                                    <MDBTypography tag="p" className="fs-5 mb-3">
                                        "Nagorik-AI has transformed how we engage with our local government. The
                                        transparency and speed of issue resolution is incredible!"
                                    </MDBTypography>
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-placeholder bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                            style={{ width: '50px', height: '50px' }}>
                                            <MDBIcon fas icon="user" size="lg" />
                                        </div>
                                        <div>
                                            <MDBTypography tag="p" className="fw-bold mb-0">
                                                Sarah Ahmed
                                            </MDBTypography>
                                            <MDBTypography tag="p" className="text-muted small mb-0">
                                                Community Member
                                            </MDBTypography>
                                        </div>
                                    </div>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </section>

            {/* Progress Tracker Preview */}
            <section className="tracker-preview py-5 bg-light">
                <MDBContainer>
                    <div className="text-center mb-5">
                        <MDBTypography tag="h2" className="display-6 fw-bold mb-3">
                            Track Every Step of the Journey
                        </MDBTypography>
                        <MDBTypography tag="p" className="text-muted fs-5">
                            Full transparency from report to resolution
                        </MDBTypography>
                    </div>

                    <MDBRow className="justify-content-center">
                        <MDBCol md="8">
                            <MDBCard className="border-0 shadow">
                                <MDBCardBody className="p-4">
                                    <div className="timeline">
                                        <div className="timeline-item completed">
                                            <div className="timeline-badge bg-success">
                                                <MDBIcon fas icon="check" />
                                            </div>
                                            <div className="timeline-content">
                                                <MDBTypography tag="h6" className="fw-bold">
                                                    Report Submitted
                                                </MDBTypography>
                                                <MDBTypography tag="p" className="text-muted small mb-0">
                                                    Your issue has been received
                                                </MDBTypography>
                                            </div>
                                        </div>

                                        <div className="timeline-item completed">
                                            <div className="timeline-badge bg-success">
                                                <MDBIcon fas icon="check" />
                                            </div>
                                            <div className="timeline-content">
                                                <MDBTypography tag="h6" className="fw-bold">
                                                    Under Review
                                                </MDBTypography>
                                                <MDBTypography tag="p" className="text-muted small mb-0">
                                                    Authorities are reviewing your report
                                                </MDBTypography>
                                            </div>
                                        </div>

                                        <div className="timeline-item active">
                                            <div className="timeline-badge bg-primary pulse">
                                                <MDBIcon fas icon="cog" spin />
                                            </div>
                                            <div className="timeline-content">
                                                <MDBTypography tag="h6" className="fw-bold">
                                                    In Progress
                                                </MDBTypography>
                                                <MDBTypography tag="p" className="text-muted small mb-0">
                                                    Work is underway to resolve the issue
                                                </MDBTypography>
                                            </div>
                                        </div>

                                        <div className="timeline-item">
                                            <div className="timeline-badge bg-secondary">
                                                <MDBIcon fas icon="flag-checkered" />
                                            </div>
                                            <div className="timeline-content">
                                                <MDBTypography tag="h6" className="fw-bold text-muted">
                                                    Resolved
                                                </MDBTypography>
                                                <MDBTypography tag="p" className="text-muted small mb-0">
                                                    Issue successfully resolved
                                                </MDBTypography>
                                            </div>
                                        </div>
                                    </div>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </section>

            {/* Final CTA */}
            <section className="final-cta py-5 bg-primary text-white">
                <MDBContainer className="text-center">
                    <MDBTypography tag="h2" className="display-5 fw-bold mb-4">
                        Ready to Make a Difference?
                    </MDBTypography>
                    <MDBTypography tag="p" className="fs-5 mb-4 opacity-75">
                        Join the movement of empowered citizens transforming their communities
                    </MDBTypography>
                    <MDBBtn color="light" size="lg" onClick={handleRegister}>
                        <MDBIcon fas icon="rocket" className="me-2" />
                        Get Started Now
                    </MDBBtn>
                </MDBContainer>
            </section>

            {/* Footer */}
            <footer className="bg-dark text-white py-4">
                <MDBContainer>
                    <MDBRow>
                        <MDBCol md="6" className="text-center text-md-start mb-3 mb-md-0">
                            <MDBTypography tag="p" className="mb-0">
                                © 2026 Nagorik-AI. All rights reserved.
                            </MDBTypography>
                        </MDBCol>
                        <MDBCol md="6" className="text-center text-md-end">
                            <MDBIcon fab icon="facebook" size="lg" className="me-3 cursor-pointer" />
                            <MDBIcon fab icon="twitter" size="lg" className="me-3 cursor-pointer" />
                            <MDBIcon fab icon="instagram" size="lg" className="cursor-pointer" />
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </footer>
        </div>
    );
};

export default Landing;
