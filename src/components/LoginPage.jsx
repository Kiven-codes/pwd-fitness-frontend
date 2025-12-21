import { useState } from 'react';
import { login, register } from '../services/api';

function LoginPage({ onLoginSuccess, accessibility, setAccessibility }) {
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    disability_type: 'Wheelchair User',
    contact_info: '',
    username: '',
    password: '',
    role: 'PWD'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(loginForm.username, loginForm.password);
      onLoginSuccess(user);

      // Always speak the greeting message
      const greetingMessage = `Hello ${user.name || 'User'}, welcome to the P W D Fitness Tracker application.`;

      const utterance = new SpeechSynthesisUtterance(greetingMessage);
      utterance.lang = 'en-US'; // Set language
      utterance.pitch = 1; // Set pitch
      utterance.rate = 1; // Set rate
      speechSynthesis.speak(utterance); // Speak the greeting regardless of voiceEnabled
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(registerForm);
      alert('Registration successful! Please login.');
      setShowRegister(false);
      setRegisterForm({
        name: '', age: '', gender: 'Male', disability_type: 'Wheelchair User',
        contact_info: '', username: '', password: '', role: 'PWD'
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const speak = (text) => {
    if (accessibility.voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`min-vh-100 d-flex align-items-center justify-content-center ${
      accessibility.highContrast ? 'bg-dark text-warning' : 'bg-light'
    }`}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className={`card shadow-lg ${
              accessibility.highContrast ? 'bg-dark border-warning' : ''
            }`}>
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <h1 className={accessibility.largeText ? 'display-3' : 'display-4'}>
                    <i className="bi bi-heart-pulse-fill text-danger"></i> PWD Fitness
                  </h1>
                  <p className={accessibility.largeText ? 'lead fs-4' : 'lead'}>
                    Health & Fitness Tracking System
                  </p>
                  <p className="text-muted mt-2" style={{ fontSize: accessibility.largeText ? '1.2rem' : '0.9rem' }}>
                    Note: For PC and laptop only
                  </p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                {/* Login Form */}
                {!showRegister ? (
                  <form onSubmit={handleLogin}>
                    <h3 className={`mb-4 ${accessibility.largeText ? 'fs-2' : ''}`}>Login</h3>

                    <div className="mb-3">
                      <label className={`form-label ${accessibility.largeText ? 'fs-4' : ''}`}>
                        Username
                      </label>
                      <input
                        type="text"
                        className={`form-control ${accessibility.largeText ? 'form-control-lg' : ''}`}
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className={`form-label ${accessibility.largeText ? 'fs-4' : ''}`}>
                        Password
                      </label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`form-control ${accessibility.largeText ? 'form-control-lg' : ''}`}
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className={`btn btn-primary w-100 ${accessibility.largeText ? 'btn-lg' : ''}`}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Logging in...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Login
                        </>
                      )}
                    </button>

                    <div className="text-center mt-3">
                      <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => setShowRegister(true)}
                      >
                        Don't have an account? Register
                      </button>
                    </div>
                  </form>
                ) : (
                  // Register Form
                  <form onSubmit={handleRegister}>
                    <h3 className={`mb-4 ${accessibility.largeText ? 'fs-2' : ''}`}>Register</h3>

                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Age</label>
                        <input
                          type="number"
                          className="form-control"
                          value={registerForm.age}
                          onChange={(e) => setRegisterForm({ ...registerForm, age: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Gender</label>
                        <select
                          className="form-select"
                          value={registerForm.gender}
                          onChange={(e) => setRegisterForm({ ...registerForm, gender: e.target.value })}
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Disability Type</label>
                      <select
                        className="form-select"
                        value={registerForm.disability_type}
                        onChange={(e) => setRegisterForm({ ...registerForm, disability_type: e.target.value })}
                      >
                        <option>Wheelchair User</option>
                        <option>Visually Impaired</option>
                        <option>Mobility Impairment</option>
                        <option>Hearing Impaired</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Email/Contact</label>
                      <input
                        type="email"
                        className="form-control"
                        value={registerForm.contact_info}
                        onChange={(e) => setRegisterForm({ ...registerForm, contact_info: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        value={registerForm.username}
                        onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <div className="input-group">
                        <input
                          type={showRegisterPassword ? "text" : "password"}
                          className="form-control"
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        >
                          {showRegisterPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-success w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Registering...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus-fill me-2"></i>
                          Register
                        </>
                      )}
                    </button>

                    <div className="text-center mt-3">
                      <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => setShowRegister(false)}
                      >
                        Already have an account? Login
                      </button>
                    </div>
                  </form>
                )}

                {/* Accessibility Controls */}
                <div className="mt-4 pt-4 border-top">
                  <h6 className="mb-3">Accessibility Options</h6>
                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      className={`btn btn-sm ${
                        accessibility.largeText ? 'btn-primary' : 'btn-outline-primary'
                      }`}
                      onClick={() => setAccessibility({ ...accessibility, largeText: !accessibility.largeText })}
                    >
                      <i className="bi bi-fonts me-1"></i> Large Text
                    </button>
                    <button
                      className={`btn btn-sm ${
                        accessibility.highContrast ? 'btn-warning' : 'btn-outline-warning'
                      }`}
                      onClick={() => setAccessibility({ ...accessibility, highContrast: !accessibility.highContrast })}
                    >
                      <i className="bi bi-eye-fill me-1"></i> High Contrast
                    </button>
                    <button
                      className={`btn btn-sm ${
                        accessibility.voiceEnabled ? 'btn-success' : 'btn-outline-success'
                      }`}
                      onClick={() => {
                        const newState = !accessibility.voiceEnabled;
                        setAccessibility({ ...accessibility, voiceEnabled: newState });
                        if (newState) speak('Voice assistance enabled');
                      }}
                    >
                      <i className="bi bi-volume-up-fill me-1"></i> Voice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;