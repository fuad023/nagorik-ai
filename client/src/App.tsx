import { Navigate, Route, Routes } from 'react-router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Landing from './views/Landing';
import About from './views/About';
import Dashboard from './views/Dashboard';
import Login from './views/login';
import Registration from './views/registration';
import Profile from './views/Profile';

import ReportHistory from './views/ReportHistory';
import LocationPicker from './views/LocationPicker';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Toaster } from 'react-hot-toast';
import ReportForm from './views/ReportForm';
import AdminDashboard from './views/AdminDashboard';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';
import { secrets } from './secrets';

const AuthenticatedLayout = () => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="app-layout">
      <Navbar />
      <div className="layout-content">
        <Outlet />
      </div>
    </div>
  );
};

const GuestRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <GoogleOAuthProvider clientId={secrets.googleClientId || ''}>
      <>
        <Routes>
          {/* Redirect root to Landing Page */}
          <Route path="/" element={<Navigate to="/landing" replace />} />

          {/* Public Landing/Auth Routes (Only for Guests) */}
          <Route path="/landing" element={<GuestRoute><Landing /></GuestRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/registration" element={<GuestRoute><Registration /></GuestRoute>} />
          <Route path="/location-picker" element={<LocationPicker />} />

          {/* Authenticated Global Layout Routes */}
          <Route element={<AuthenticatedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/submit-report" element={<ReportForm />} />
            <Route path="/history" element={<ReportHistory />} />
            <Route path="/report" element={<ReportForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

        </Routes>
        <Toaster
          position="top-center"
          toastOptions={{
            error: {
              duration: 5000,
            },
          }}
        />
      </>
    </GoogleOAuthProvider>
  );
}

export default App;

