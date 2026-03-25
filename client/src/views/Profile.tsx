import React from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBTypography,
  MDBBtn,
  MDBIcon,
  MDBBadge
} from 'mdb-react-ui-kit';
import '../styles/profile.css';

const Profile: React.FC = () => {
  return (
    <MDBContainer className="py-5 h-100 profile-container">
      <MDBRow className="justify-content-center align-items-center h-100">
        <MDBCol lg="10" xl="8">
          <MDBCard className="profile-card">
            {/* Header with Avatar & Name */}
            <div className="profile-header text-white d-flex flex-row" style={{ backgroundColor: '#0288d1', height: '220px', borderRadius: '15px 15px 0 0' }}>
              <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                <div className="avatar-wrapper position-relative">
                  <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                    alt="Generic placeholder image" className="img-fluid img-thumbnail mt-4 mb-2 profile-avatar"
                    style={{ width: '150px', zIndex: '1', borderRadius: '50%' }} />
                  <MDBBtn floating className="camera-btn position-absolute bottom-0 end-0" style={{ zIndex: '2', backgroundColor: '#ff9800' }}>
                    <MDBIcon fas icon="camera" />
                  </MDBBtn>
                </div>
              </div>
              <div className="ms-3" style={{ marginTop: '130px' }}>
                <MDBTypography tag="h3" className="mb-0 fw-bold user-name">Andy Horwitz</MDBTypography>
                <MDBCardText className="text-white-50">New York, USA</MDBCardText>
              </div>
              <div className="ms-auto mt-auto mb-3 me-4" style={{ zIndex: '1' }}>
                <MDBBtn color="warning" className="fw-bold edit-profile-btn px-4 shadow-sm" style={{ backgroundColor: '#ff9800', border: 'none' }}>
                  <MDBIcon fas icon="pencil-alt" className="me-2" /> Edit Profile
                </MDBBtn>
              </div>
            </div>

            <MDBCardBody className="text-black p-4">
              {/* Stats/Activity Cards */}
              <div className="d-flex justify-content-end text-center py-1 stats-section">
                <div className="stat-card px-3">
                  <MDBCardText className="mb-2 h5 fw-bold stat-number text-primary">25</MDBCardText>
                  <MDBCardText className="small text-muted mb-0 stat-label"><MDBIcon fas icon="flag" className="me-1 text-warning"/> Reports Submitted</MDBCardText>
                </div>
                <div className="stat-card px-3">
                  <MDBCardText className="mb-2 h5 fw-bold stat-number text-success">18</MDBCardText>
                  <MDBCardText className="small text-muted mb-0 stat-label"><MDBIcon fas icon="check-circle" className="me-1 text-success"/> Issues Resolved</MDBCardText>
                </div>
                <div className="stat-card px-3">
                  <MDBCardText className="mb-2 h5 fw-bold stat-number text-info">7</MDBCardText>
                  <MDBCardText className="small text-muted mb-0 stat-label"><MDBIcon fas icon="spinner" className="me-1 text-info"/> Pending</MDBCardText>
                </div>
              </div>

              {/* Personal Details Section */}
              <div className="mb-5 mt-4">
                <MDBTypography tag="h5" className="section-title mb-4 pb-2 border-bottom fw-bold text-dark">
                  <MDBIcon fas icon="user-circle" className="me-2 text-primary" /> Personal Details
                </MDBTypography>
                
                <MDBRow className="gx-4 gy-4">
                  <MDBCol md="6">
                    <MDBCard className="info-card h-100 shadow-0 border bg-light">
                      <MDBCardBody className="p-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted small text-uppercase fw-bold"><MDBIcon fas icon="envelope" className="me-2"/> Email</span>
                          <MDBIcon fas icon="pencil-alt" className="text-muted edit-icon" style={{ cursor: 'pointer' }}/>
                        </div>
                        <MDBCardText className="mb-0 fw-500">andy.horwitz@example.com</MDBCardText>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                  
                  <MDBCol md="6">
                    <MDBCard className="info-card h-100 shadow-0 border bg-light">
                      <MDBCardBody className="p-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted small text-uppercase fw-bold"><MDBIcon fas icon="phone" className="me-2"/> Phone</span>
                          <MDBIcon fas icon="pencil-alt" className="text-muted edit-icon" style={{ cursor: 'pointer' }}/>
                        </div>
                        <MDBCardText className="mb-0 fw-500">+1 (555) 123-4567</MDBCardText>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                  
                  <MDBCol md="12">
                    <MDBCard className="info-card h-100 shadow-0 border bg-light">
                      <MDBCardBody className="p-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted small text-uppercase fw-bold"><MDBIcon fas icon="map-marker-alt" className="me-2"/> Address</span>
                          <MDBIcon fas icon="pencil-alt" className="text-muted edit-icon" style={{ cursor: 'pointer' }}/>
                        </div>
                        <MDBCardText className="mb-0 fw-500">123 Civic Way, Apt 4B, New York, NY 10001</MDBCardText>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                </MDBRow>
              </div>

              {/* Edit/Profile Actions */}
              <div className="d-flex justify-content-between align-items-center pt-3 mt-4 border-top">
                <MDBBtn outline color="primary" className="action-btn px-4 shadow-sm" rounded>
                  <MDBIcon fas icon="key" className="me-2"/> Change Password
                </MDBBtn>
                <MDBBtn outline color="danger" className="action-btn px-4 shadow-sm" rounded>
                  <MDBIcon fas icon="sign-out-alt" className="me-2"/> Logout
                </MDBBtn>
              </div>

            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Profile;
