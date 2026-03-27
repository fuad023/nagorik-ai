import { Navigate, Route, Routes } from 'react-router';
import Landing from './views/Landing';
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

function App() {
  return (
    <>
      <Routes>
        {/* Redirect root to Landing Page */}
        <Route path="/" element={<Navigate to="/landing" replace />} />

        {/* Public Landing Page */}
        <Route path="/landing" element={<Landing />} />

        {/* Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* New Pages */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/submit-report" element={<ReportForm />} />
        <Route path="/history" element={<ReportHistory />} />
        <Route path="/location-picker" element={<LocationPicker />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        <Route path='/report' element = {<ReportForm/>}/>

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

