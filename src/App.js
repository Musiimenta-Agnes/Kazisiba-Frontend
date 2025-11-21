import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Public Website Pages
import AboutUs from './pages/About';
import ContactUs from './pages/Contact';
import Projects from './pages/Projects';
import OurFooter from './components/Footer';
import OurHeader from './components/Header';
import HeroSection from './components/HeroSection';
// import WhatsAppButton from './components/WhatsappButton';
import FAQPage from './pages/Questions';
import Gallery from './pages/Gallery';
import ProjectsInProcess from './pages/ProjectsInProcess';
import Materials from './pages/Materials';

// Admin Pages
import LoginPage from './pages/Login';
import ProtectedRoute from './dashboard/components/ProtectedRoute';
import AdminProfile from './admin/AdminProfile';
import DashboardLayout from './admin/SideBarLayout';
import AdminDashboard from './admin/AdminDashboard';
import UploadManager from './admin/UploadManager';
import UniversalAdminPanel from './admin/AdminPanel';
import AdminDashboardSummary from './admin/dashBoardSummary';

function LayoutWrapper() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/kazisiba-admin');

  return (
    <>
      {!isAdminPage && <OurHeader />}

      <Routes>
        {/* Admin Pages */}
        <Route path="/kazisiba-admin/login" element={<LoginPage />} />

        <Route 
          path="/kazisiba-admin/admin/very/secure" 
          element={
            <ProtectedRoute>
              <DashboardLayout><AdminDashboard /></DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/kazisiba-admin/admin/very/secure/upload" 
          element={
            <ProtectedRoute>
              <DashboardLayout><UploadManager /></DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/kazisiba-admin/admin/very/secure/admin-panel"
          element={
            <ProtectedRoute>
              <DashboardLayout><UniversalAdminPanel /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/kazisiba-admin/admin/very/secure/profile" 
          element={
            <ProtectedRoute>
              <DashboardLayout><AdminProfile /></DashboardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/kazisiba-admin/admin/very/secure/profile" 
          element={
            <ProtectedRoute>
              <DashboardLayout><AdminDashboardSummary/></DashboardLayout>
            </ProtectedRoute>
          } 
        />


        {/* Public Website Pages */}
        <Route path="/" element={<HeroSection />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/completed-projects" element={<Projects />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/questions" element={<FAQPage />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/process" element={<ProjectsInProcess />} />
      </Routes>

      {!isAdminPage && <OurFooter />}
    </>
  );
}


function App() {
  return (
    <Router>
      <div className="container-fluid">
        <ToastContainer position="top-center" autoClose={3000} />
        <LayoutWrapper />
      </div>
    </Router>
  );
}

export default App;
