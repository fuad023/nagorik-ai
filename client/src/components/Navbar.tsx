import React from 'react';
import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiUser, FiLogOut, FiLock, FiPlusCircle } from 'react-icons/fi';

const Navigation: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('avatar_5');
        navigate('/landing', { replace: true });
    };

    return (
        <Navbar bg="white" expand="lg" className="shadow-sm sticky-top px-3">
            <Container fluid>
                <Navbar.Brand 
                    className="fw-bold text-primary d-flex align-items-center" 
                    onClick={() => navigate('/dashboard')}
                    style={{ cursor: 'pointer' }}
                >
                    <i className="fas fa-city fa-lg me-2" />
                    Nagorik-AI
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="align-items-center gap-3">
                        {/* Notifications */}
                        <Nav.Item className="position-relative" style={{ cursor: 'pointer' }}>
                            <FiBell size={22} className="text-muted" />
                            <Badge 
                                bg="danger" 
                                pill 
                                className="position-absolute top-0 start-100 translate-middle"
                                style={{ fontSize: '0.65rem' }}
                            >
                                3
                            </Badge>
                        </Nav.Item>

                        {/* New Report Link */}
                        <Nav.Item>
                            <div
                                onClick={() => navigate('/submit-report')}
                                className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                style={{ width: '38px', height: '38px', cursor: 'pointer' }}
                                title="Create New Report"
                            >
                                <FiPlusCircle size={20} />
                            </div>
                        </Nav.Item>

                        {/* Profile Link */}
                        <Nav.Item>
                            <div
                                onClick={() => navigate('/profile')}
                                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                style={{ width: '38px', height: '38px', cursor: 'pointer' }}
                                title="My Profile"
                            >
                                <FiUser size={18} />
                            </div>
                        </Nav.Item>

                        {/* Admin Link */}
                        <Nav.Item>
                            <div
                                onClick={() => navigate('/admin')}
                                className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                style={{ width: '38px', height: '38px', cursor: 'pointer' }}
                                title="Admin Dashboard"
                            >
                                <FiLock size={18} />
                            </div>
                        </Nav.Item>

                        {/* Logout */}
                        <Nav.Item>
                            <button 
                                className="btn btn-link text-muted text-decoration-none d-flex align-items-center gap-2 px-0"
                                onClick={handleLogout}
                            >
                                <FiLogOut size={18} />
                                Logout
                            </button>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
