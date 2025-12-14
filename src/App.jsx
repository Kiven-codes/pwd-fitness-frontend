// ============================================
// src/App.jsx - Main Application Component
// ============================================

import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import TherapistDashboard from './components/TherapistDashboard';
import AdminDashboard from './components/AdminDashboard';
import ExercisesPage from './components/ExercisesPage';
import HealthMetricsPage from './components/HealthMetricsPage';
import EducationPage from './components/EducationPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { loadUserData } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data State
  const [exercises, setExercises] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState({
    total_sessions: 0,
    total_minutes: 0,
    total_calories: 0,
    avg_progress_score: 0
  });
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [education, setEducation] = useState([]);
  
  // Accessibility State
  const [accessibility, setAccessibility] = useState({
    largeText: false,
    highContrast: false,
    voiceEnabled: false
  });

  // Check for saved user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
      loadDashboardData(userData.id);
    }
  }, []);

  // Load all dashboard data
  const loadDashboardData = async (userId) => {
    try {
      const data = await loadUserData(userId);
      setExercises(data.exercises || []);
      setAssignments(data.assignments || []);
      setWeeklyStats(data.weeklyStats || {});
      setHealthMetrics(data.healthMetrics || []);
      setEducation(data.education || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    loadDashboardData(userData.id);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    setActiveTab('dashboard');
  };

  const refreshData = () => {
    if (user) {
      loadDashboardData(user.id);
    }
  };

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess}
        accessibility={accessibility}
        setAccessibility={setAccessibility}
      />
    );
  }

  // Main application view
  return (
    <div className={`min-vh-100 ${accessibility.highContrast ? 'bg-dark text-warning' : 'bg-light'}`}>
      <Navbar 
        user={user}
        onLogout={handleLogout}
        accessibility={accessibility}
      />

      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-md-3 col-lg-2 mb-4">
            <Sidebar 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              accessibility={accessibility}
              setAccessibility={setAccessibility}
            />
          </div>

          <div className="col-md-9 col-lg-10">
            {/* Role-based Dashboard */}
            {activeTab === 'dashboard' && (
              <>
                {user.role === 'PWD' && (
                  <Dashboard
                    user={user}
                    weeklyStats={weeklyStats}
                    assignments={assignments}
                    accessibility={accessibility}
                    onRefresh={refreshData}
                  />
                )}
                
                {(user.role === 'THERAPIST' || user.role === 'CAREGIVER') && (
                  <TherapistDashboard
                    user={user}
                    accessibility={accessibility}
                  />
                )}
                
                {user.role === 'ADMIN' && (
                  <AdminDashboard
                    user={user}
                    accessibility={accessibility}
                  />
                )}
              </>
            )}

            {activeTab === 'exercises' && (
              <ExercisesPage
                exercises={exercises}
                accessibility={accessibility}
              />
            )}

            {activeTab === 'health' && user.role === 'PWD' && (
              <HealthMetricsPage
                user={user}
                healthMetrics={healthMetrics}
                accessibility={accessibility}
                onRefresh={refreshData}
              />
            )}

            {activeTab === 'education' && (
              <EducationPage
                education={education}
                accessibility={accessibility}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;