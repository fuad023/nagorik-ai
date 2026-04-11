import React from 'react';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBIcon,
    MDBTypography,
    MDBBtn,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="about-page bg-light min-vh-100">
            {/* Navigation */}
            <MDBNavbar expand="lg" light bgColor="white" className="shadow-sm sticky-top">
                <MDBContainer>
                    <MDBNavbarBrand href="#" onClick={() => navigate('/')}>
                        <MDBIcon fas icon="city" size="2x" className="text-primary me-2" />
                        <span className="fw-bold text-primary">Nagorik-AI</span>
                    </MDBNavbarBrand>
                    <MDBNavbarNav className="ms-auto d-flex flex-row">
                        <MDBNavbarItem>
                            <MDBNavbarLink onClick={() => navigate('/landing')} className="cursor-pointer">Home</MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem className="ms-3">
                            <MDBBtn color="primary" size="sm" onClick={() => navigate('/login')}>
                                Sign In
                            </MDBBtn>
                        </MDBNavbarItem>
                    </MDBNavbarNav>
                </MDBContainer>
            </MDBNavbar>

            {/* Hero Section */}
            <section className="bg-primary text-white py-5 text-center">
                <MDBContainer className="py-5">
                    <MDBTypography tag="h1" className="display-3 fw-bold mb-4 animate-fade-in">
                        About Nagorik-AI
                    </MDBTypography>
                    <MDBTypography tag="p" className="lead fs-4 opacity-75 mx-auto max-w-700">
                        Bridging the gap between citizens and smart infrastructure, one report at a time.
                    </MDBTypography>
                </MDBContainer>
            </section>

            {/* Mission Section */}
            <section className="py-5">
                <MDBContainer>
                    <MDBRow className="align-items-center py-5">
                        <MDBCol lg="6" className="mb-4 mb-lg-0">
                            <div className="rounded-4 shadow-lg p-5 bg-white text-center position-relative overflow-hidden">
                                <div className="position-absolute top-0 start-0 w-100 h-100 bg-primary opacity-10"></div>
                                <MDBIcon fas icon="globe" size="8x" className="text-primary mb-4 position-relative z-index-1" />
                                <MDBTypography tag="h3" className="fw-bold position-relative z-index-1">Our Mission</MDBTypography>
                            </div>
                        </MDBCol>
                        <MDBCol lg="6" className="ps-lg-5">
                            <MDBTypography tag="h2" className="display-6 fw-bold mb-4">
                                Empowering Communities Through Technology
                            </MDBTypography>
                            <MDBTypography tag="p" className="text-muted fs-5 mb-4">
                                Founded with the vision to create seamless interactions between citizens and public services, Nagorik-AI leverages advanced artificial intelligence to handle local issues effectively.
                            </MDBTypography>
                            <ul className="list-unstyled text-muted fs-5">
                                <li className="mb-3"><MDBIcon fas icon="check-circle" className="text-success me-3" /> Fostering transparent governance.</li>
                                <li className="mb-3"><MDBIcon fas icon="check-circle" className="text-success me-3" /> Streamlining issue resolution with AI.</li>
                                <li className="mb-3"><MDBIcon fas icon="check-circle" className="text-success me-3" /> Enhancing local infrastructure efficiency.</li>
                            </ul>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </section>

            {/* Core Values Section */}
            <section className="bg-white py-5">
                <MDBContainer className="py-5">
                    <div className="text-center mb-5">
                        <MDBTypography tag="h2" className="display-5 fw-bold mb-3">
                            Our Core Values
                        </MDBTypography>
                        <MDBTypography tag="p" className="text-muted fs-5">
                            The principles that guide everything we build and do.
                        </MDBTypography>
                    </div>

                    <MDBRow className="g-4">
                        <MDBCol md="4">
                            <MDBCard className="h-100 border-0 shadow-sm glass-hover">
                                <MDBCardBody className="text-center p-5">
                                    <div className="mb-4 bg-primary-soft rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px', backgroundColor: 'rgba(59, 113, 202, 0.1)'}}>
                                        <MDBIcon fas icon="users" size="2x" className="text-primary" />
                                    </div>
                                    <MDBTypography tag="h5" className="fw-bold mb-3">Community First</MDBTypography>
                                    <MDBTypography tag="p" className="text-muted">
                                        We believe that the best solutions come from the people who experience the problems firsthand.
                                    </MDBTypography>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        <MDBCol md="4">
                            <MDBCard className="h-100 border-0 shadow-sm glass-hover">
                                <MDBCardBody className="text-center p-5">
                                    <div className="mb-4 bg-success-soft rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px', backgroundColor: 'rgba(20, 164, 77, 0.1)'}}>
                                        <MDBIcon fas icon="shield-alt" size="2x" className="text-success" />
                                    </div>
                                    <MDBTypography tag="h5" className="fw-bold mb-3">Transparency</MDBTypography>
                                    <MDBTypography tag="p" className="text-muted">
                                        Building trust by keeping our operations, data handling, and outcomes clear and accessible.
                                    </MDBTypography>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        <MDBCol md="4">
                            <MDBCard className="h-100 border-0 shadow-sm glass-hover">
                                <MDBCardBody className="text-center p-5">
                                    <div className="mb-4 bg-warning-soft rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px', backgroundColor: 'rgba(228, 161, 27, 0.1)'}}>
                                        <MDBIcon fas icon="lightbulb" size="2x" className="text-warning" />
                                    </div>
                                    <MDBTypography tag="h5" className="fw-bold mb-3">Innovation</MDBTypography>
                                    <MDBTypography tag="p" className="text-muted">
                                        Continuously evolving our tools to adopt the latest in AI and data science for urban development.
                                    </MDBTypography>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
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
            
            <style>{`
                .glass-hover {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .glass-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
                }
                .max-w-700 {
                    max-width: 700px;
                }
                .cursor-pointer {
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default About;
