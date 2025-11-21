import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUpload, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import './SideBar.css';

const TopNav = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);
  const handleLinkClick = () => {
    if (isMobile) setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // ===========================
  //  LOGOUT FUNCTION
  // ===========================
  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminName');
    sessionStorage.removeItem('adminPhone');

    navigate('/kazisiba-admin/login', { replace: true });
  };

  return (
    <div className="topnav-container">
      {/* Logo on left */}
      <div className="topnav-logo">
        <img src="/images/logo.png" alt="Logo" />
      </div>

      {/* Toggle button on far right for mobile */}
      {isMobile && (
        <button onClick={handleToggle} className="topnav-toggle">
          <i className="bi bi-list"></i>
        </button>
      )}

      {/* Links */}
      <Nav
        className={`topnav-links ${isMobile ? (isOpen ? 'open' : 'closed') : ''}`}
      >
        <Nav.Link
          as={Link}
          to="/kazisiba-admin/admin/very/secure"
          className={isActive('/kazisiba-admin/admin/very/secure') ? 'active-link' : ''}
          onClick={handleLinkClick}
        >
          <FaHome /> Dashboard
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/kazisiba-admin/admin/very/secure/upload"
          className={isActive('/kazisiba-admin/admin/very/secure/upload') ? 'active-link' : ''}
          onClick={handleLinkClick}
        >
          <FaUpload /> Upload Content
        </Nav.Link>

         {/* NEW LINK TO UNIVERSAL ADMIN PANEL */}
          <Nav.Link
            as={Link}
            to="/kazisiba-admin/admin/very/secure/admin-panel"
            className={isActive('/kazisiba-admin/admin/very/secure/admin-panel') ? 'active-link' : ''}
            onClick={handleLinkClick}
          >
            <i className="bi bi-tools"></i> Admin Panel
          </Nav.Link>
  

        {/* LOGOUT BUTTON */}
        <Nav.Link
          onClick={handleLogout}
          className="logout-link"
          style={{ cursor: "pointer", color: "orange" }}
        >
          <FaSignOutAlt /> Logout
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default TopNav;
