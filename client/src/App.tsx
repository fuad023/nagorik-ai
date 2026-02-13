import { Navigate, Outlet, Route, Routes } from 'react-router';
import BaseLayout from './views/BaseLayout';
import Home from './views/Home';
import Landing from './views/Landing';
import Dashboard from './views/Dashboard';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Toaster } from 'react-hot-toast';
import Sessions from './views/Sessions';

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

        {/* Old Routes with BaseLayout (kept for backward compatibility) */}
        <Route
          element={
            <BaseLayout>
              <Outlet />
            </BaseLayout>
          }
        >
          <Route path={'/home'} element={<Home />} />
          <Route path={'/sessions'} element={<Sessions />} />
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
  );
}

export default App;

