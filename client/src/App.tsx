import { Navigate, Route, Routes } from 'react-router';
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

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
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
    <>
      <Routes>
        {/* Redirect root to Landing Page */}
        <Route path="/" element={<Navigate to="/landing" replace />} />

        {/* Public Landing/Auth Routes (Only for Guests) */}
        <Route path="/landing" element={<GuestRoute><Landing /></GuestRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/registration" element={<GuestRoute><Registration /></GuestRoute>} />

        {/* Dashboard Route */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* New Pages */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/submit-report" element={<ProtectedRoute><ReportForm /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><ReportHistory /></ProtectedRoute>} />
        <Route path="/location-picker" element={<LocationPicker />} />

        <Route path='/report' element={<ProtectedRoute><ReportForm /></ProtectedRoute>} />
        <Route path='/admin' element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

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
  );
}

export default App;

