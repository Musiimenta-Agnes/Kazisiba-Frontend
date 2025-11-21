// pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/LogIn.css'

function LoginPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  const [username, setUsername] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const navigate = useNavigate();
    const location = useLocation();
  const from = location.state?.from?.pathname || "/kazisiba-admin/admin/very/secure";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/login`, {
        username,
        telephone,
        password
      });

      const token = response.data.access_token;
      const admin = response.data.admin;

      // Store session
      sessionStorage.setItem('adminToken', token);
      sessionStorage.setItem('adminName', admin.username);
      sessionStorage.setItem('adminPhone', admin.telephone);

      // Clear form
      setUsername('');
      setTelephone('');
      setPassword('');

      // Redirect to dashboard
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontSize: '0.9rem' }}>
      <h4 style={{ textAlign: 'center', paddingTop: '30px' }} className="text-primary">
        Admin Sign In
      </h4>

      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <form onSubmit={handleSubmit} autoComplete="off" className="login-form" data-aos="fade-up">
            {/* Username */}
            <div>
              <label>Name:</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="off"
              />
            </div>
            <br />

            {/* Telephone */}
            <div>
              <label>Telephone:</label>
              <input
                type="tel"
                className="form-control"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                required
                autoComplete="off"
              />
            </div>
            <br />

            {/* Password */}
            <div>
              <label>Password:</label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
              <button
                type="submit"
                className="login-btn btn btn-primary"
                style={{ width: '50%', padding: '10px' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>

            {/* Error */}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </form>
        </div>
      </div>
      <br /><br />
    </div>
  );
}

export default LoginPage;
