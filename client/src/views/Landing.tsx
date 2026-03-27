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
                                    <MDBBtn outline color="primary" size="lg" className="mb-3">
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
            <section id="features" className="features-section py-5 bg-light">
                <MDBContainer>
                    <div className="text-center mb-5">
                        <MDBTypography tag="h2" className="display-5 fw-bold mb-3">
                            How Nagorik-AI Helps You
                        </MDBTypography>
                        <MDBTypography tag="p" className="text-muted fs-5">
                            Cutting-edge features designed to streamline civic engagement
                        </MDBTypography>
                    </div>

                    <MDBRow className="g-4">
                        {/* Feature 1 */}
                        <MDBCol md="6" lg="3">
                            <MDBCard className="feature-card h-100 border-0 shadow-hover">
                                <MDBCardBody className="text-center p-4">
                                    <div className="feature-icon mb-3">
                                        <MDBIcon fas icon="brain" size="3x" className="text-primary" />
                                    </div>
                                    <MDBTypography tag="h5" className="fw-bold mb-3">
                                        AI-Powered Categorization
                                    </MDBTypography>
                                    <MDBTypography tag="p" className="text-muted">
                                        Our smart AI automatically categorizes your reports and routes them to the
                                        right authorities instantly.
                                    </MDBTypography>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>

                        {/* Feature 2 */}
                        <MDBCol md="6" lg="3">
                            <MDBCard className="feature-card h-100 border-0 shadow-hover">
                                <MDBCardBody className="text-center p-4">
                                    <div className="feature-icon mb-3">
                                        <MDBIcon fas icon="comments" size="3x" className="text-success" />
                                    </div>
                                    <MDBTypography tag="h5" className="fw-bold mb-3">
                                        24/7 Chatbot Assistance
                                    </MDBTypography>
                                    <MDBTypography tag="p" className="text-muted">
                                        Get instant answers to your questions anytime with our intelligent chatbot
                                        assistant.
                                    </MDBTypography>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>

                        {/* Feature 3 */}
                        <MDBCol md="6" lg="3">
                            <MDBCard className="feature-card h-100 border-0 shadow-hover">
                                <MDBCardBody className="text-center p-4">
                                    <div className="feature-icon mb-3">
                                        <MDBIcon fas icon="chart-line" size="3x" className="text-warning" />
                                    </div>
                                    <MDBTypography tag="h5" className="fw-bold mb-3">
                                        Real-Time Issue Tracking
                                    </MDBTypography>
                                    <MDBTypography tag="p" className="text-muted">
                                        Track the status of your reports in real-time and receive updates at every
                                        step.
                                    </MDBTypography>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>

                        {/* Feature 4 */}
                        <MDBCol md="6" lg="3">
                            <MDBCard className="feature-card h-100 border-0 shadow-hover">
                                <MDBCardBody className="text-center p-4">
                                    <div className="feature-icon mb-3">
                                        <MDBIcon fas icon="map-marked-alt" size="3x" className="text-danger" />
                                    </div>
                                    <MDBTypography tag="h5" className="fw-bold mb-3">
                                        Local Alerts
                                    </MDBTypography>
                                    <MDBTypography tag="p" className="text-muted">
                                        Stay informed about issues in your neighborhood with location-based alerts and
                                        updates.
                                    </MDBTypography>
                                </MDBCardBody>
                            </MDBCard>
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
