import React, { useEffect, useRef, useState } from 'react';
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
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBBadge,
} from 'mdb-react-ui-kit';
import '../styles/profile.css';
import { useNavigate } from 'react-router-dom';
import ApiClient from '../api';
import toast from 'react-hot-toast';
import { secrets } from '../secrets';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface ReportStats {
  total: number;
  resolved: number;
  pending: number;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<ReportStats>({ total: 0, resolved: 0, pending: 0 });
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored) as User;
      setUser(u);
      // Load per-user avatar
      const savedAvatar = localStorage.getItem(`avatar_${u.id}`);
      if (savedAvatar) setAvatarSrc(savedAvatar);
    }
  }, []);

  // Fetch real report stats
  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      try {
        const response = await fetch(`${secrets.backendEndpoint}/api/v1/reports?mine=true&paginate=100`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            const all: any[] = data.data;
            const resolved = all.filter((r) => r.status === 'resolved').length;
            setStats({ total: all.length, resolved, pending: all.length - resolved });
          }
        }
      } catch (e) {
        console.error('Failed to load report stats', e);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = async () => {
    await ApiClient.logout();
    navigate('/login');
  };

  // --- Photo upload ---
  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarSrc(dataUrl);
      if (user) localStorage.setItem(`avatar_${user.id}`, dataUrl);
      toast.success('Profile photo updated!');
    };
    reader.readAsDataURL(file);
  };

  // --- Change Password ---
  const handleChangePassword = async () => {
    if (!newPassword || !currentPassword) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    setPasswordLoading(true);
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${secrets.backendEndpoint}/api/change-password`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || 'Password changed successfully!');
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.message || 'Failed to change password.');
      }
    } catch (e) {
      toast.error('Network error. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const fullName = user ? `${user.first_name} ${user.last_name}` : 'Loading...';
  const initials = user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : '?';

  return (
    <div className="profile-page bg-light min-vh-100">
      {/* Top Navigation */}
      <MDBNavbar expand="lg" light bgColor="white" className="shadow-sm sticky-top">
        <MDBContainer fluid>
          <MDBNavbarBrand href="#" onClick={() => navigate('/landing')}>
            <MDBIcon fas icon="city" size="2x" className="text-primary me-2" />
            <span className="fw-bold text-primary">Nagorik-AI</span>
          </MDBNavbarBrand>
          <MDBNavbarNav className="ms-auto d-flex flex-row align-items-center">
            <MDBNavbarItem className="me-3 position-relative">
              <MDBIcon fas icon="bell" size="lg" className="text-muted cursor-pointer" />
              <MDBBadge color="danger" notification pill className="notification-badge">
                3
              </MDBBadge>
            </MDBNavbarItem>
            <MDBNavbarItem className="me-3">
              <div
                className="user-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center cursor-pointer"
                onClick={() => navigate('/dashboard')}
              >
                <MDBIcon fas icon="home" />
              </div>
            </MDBNavbarItem>
            <MDBNavbarItem className="me-4">
              <div
                className="user-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center cursor-pointer"
                onClick={() => navigate('/admin')}
              >
                <MDBIcon fas icon="fa-lock" />
              </div>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBContainer>
      </MDBNavbar>

      <MDBContainer className="py-5 h-100 profile-container">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="10" xl="8">
            <div className="mb-3 text-start">
              <MDBBtn color="light" size="sm" className="shadow-sm rounded-pill text-primary fw-bold px-3" onClick={() => navigate(-1)}>
                <MDBIcon fas icon="arrow-left" className="me-1" /> Back
              </MDBBtn>
            </div>
            <MDBCard className="profile-card">
              {/* Header */}
              <div className="profile-header text-white d-flex flex-row" style={{ backgroundColor: '#0288d1', height: '220px', borderRadius: '15px 15px 0 0' }}>
                <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                  {/* Clickable avatar */}
                  <div
                    className="avatar-wrapper position-relative"
                    style={{ cursor: 'pointer' }}
                    onClick={handleAvatarClick}
                    title="Click to change photo"
                  >
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt="Profile"
                        className="img-thumbnail mt-4 mb-2 profile-avatar"
                        style={{ width: '150px', height: '150px', objectFit: 'cover', zIndex: 1, borderRadius: '50%' }}
                      />
                    ) : (
                      <div
                        className="img-thumbnail mt-4 mb-2 profile-avatar d-flex align-items-center justify-content-center bg-white text-primary fw-bold"
                        style={{ width: '150px', height: '150px', zIndex: 1, borderRadius: '50%', fontSize: '2.5rem' }}
                      >
                        {initials}
                      </div>
                    )}
                    {/* Camera overlay */}
                    <div
                      className="position-absolute d-flex align-items-center justify-content-center rounded-circle"
                      style={{ bottom: 8, right: 0, width: 36, height: 36, backgroundColor: '#ff9800', zIndex: 2, boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
                    >
                      <MDBIcon fas icon="camera" style={{ color: '#fff', fontSize: '0.85rem' }} />
                    </div>
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <div className="ms-3" style={{ marginTop: '130px' }}>
                  <MDBTypography tag="h3" className="mb-0 fw-bold user-name">{fullName}</MDBTypography>
                  <MDBCardText className="text-white-50">{user?.email ?? ''}</MDBCardText>
                </div>
              </div>

              <MDBCardBody className="text-black p-4">
                {/* Stats */}
                <div className="d-flex justify-content-end text-center py-1 stats-section">
                  <div className="stat-card px-3">
                    <MDBCardText className="mb-2 h5 fw-bold stat-number text-primary">{stats.total}</MDBCardText>
                    <MDBCardText className="small text-muted mb-0 stat-label"><MDBIcon fas icon="flag" className="me-1 text-warning" />Reports Submitted</MDBCardText>
                  </div>
                  <div className="stat-card px-3">
                    <MDBCardText className="mb-2 h5 fw-bold stat-number text-success">{stats.resolved}</MDBCardText>
                    <MDBCardText className="small text-muted mb-0 stat-label"><MDBIcon fas icon="check-circle" className="me-1 text-success" />Issues Resolved</MDBCardText>
                  </div>
                  <div className="stat-card px-3">
                    <MDBCardText className="mb-2 h5 fw-bold stat-number text-info">{stats.pending}</MDBCardText>
                    <MDBCardText className="small text-muted mb-0 stat-label"><MDBIcon fas icon="spinner" className="me-1 text-info" />Pending</MDBCardText>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="mb-5 mt-4">
                  <MDBTypography tag="h5" className="section-title mb-4 pb-2 border-bottom fw-bold text-dark">
                    <MDBIcon fas icon="user-circle" className="me-2 text-primary" /> Personal Details
                  </MDBTypography>
                  <MDBRow className="gx-4 gy-4">
                    <MDBCol md="6">
                      <MDBCard className="info-card h-100 shadow-0 border bg-light">
                        <MDBCardBody className="p-3">
                          <span className="text-muted small text-uppercase fw-bold"><MDBIcon fas icon="user" className="me-2" />First Name</span>
                          <MDBCardText className="mb-0 fw-500 mt-2">{user?.first_name ?? '—'}</MDBCardText>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                    <MDBCol md="6">
                      <MDBCard className="info-card h-100 shadow-0 border bg-light">
                        <MDBCardBody className="p-3">
                          <span className="text-muted small text-uppercase fw-bold"><MDBIcon fas icon="user" className="me-2" />Last Name</span>
                          <MDBCardText className="mb-0 fw-500 mt-2">{user?.last_name ?? '—'}</MDBCardText>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                    <MDBCol md="12">
                      <MDBCard className="info-card h-100 shadow-0 border bg-light">
                        <MDBCardBody className="p-3">
                          <span className="text-muted small text-uppercase fw-bold"><MDBIcon fas icon="envelope" className="me-2" />Email</span>
                          <MDBCardText className="mb-0 fw-500 mt-2">{user?.email ?? '—'}</MDBCardText>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                  </MDBRow>
                </div>

                {/* Actions */}
                <div className="d-flex justify-content-between align-items-center pt-3 mt-4 border-top">
                  <MDBBtn outline color="primary" className="action-btn px-4 shadow-sm" rounded onClick={() => setShowPasswordModal(true)}>
                    <MDBIcon fas icon="key" className="me-2" />Change Password
                  </MDBBtn>
                  <MDBBtn outline color="danger" className="action-btn px-4 shadow-sm" rounded onClick={handleLogout}>
                    <MDBIcon fas icon="sign-out-alt" className="me-2" />Logout
                  </MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>

        {/* Change Password Modal */}
        <MDBModal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} tabIndex="-1">
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle><MDBIcon fas icon="key" className="me-2 text-primary" />Change Password</MDBModalTitle>
                <MDBBtn className="btn-close" color="none" onClick={() => setShowPasswordModal(false)} />
              </MDBModalHeader>
              <MDBModalBody>
                <div className="mb-3">
                  <MDBInput
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <MDBInput
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <MDBInput
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn color="secondary" onClick={() => setShowPasswordModal(false)}>Cancel</MDBBtn>
                <MDBBtn color="primary" onClick={handleChangePassword} disabled={passwordLoading}>
                  {passwordLoading ? <><MDBIcon fas icon="spinner" className="me-2 fa-spin" />Saving...</> : <><MDBIcon fas icon="check" className="me-2" />Update Password</>}
                </MDBBtn>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </MDBContainer>
    </div>
  );
};

export default Profile;
