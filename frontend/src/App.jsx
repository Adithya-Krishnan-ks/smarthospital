import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSelection from './pages/LoginSelection';
import AdminLogin from './pages/AdminLogin';
import DoctorLogin from './pages/DoctorLogin';
import PatientLogin from './pages/PatientLogin';
import RegisterPatient from './pages/RegisterPatient';
import ForgotPassword from './pages/ForgotPassword';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSelection />} />

        {/* Login Routes */}
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/doctor" element={<DoctorLogin />} />
        <Route path="/login/patient" element={<PatientLogin />} />
        <Route path="/register" element={<RegisterPatient />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Dashboard Routes (Protected) */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* Legacy redir support */}

        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />

        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
