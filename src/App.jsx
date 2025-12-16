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
import { loadUserData, deleteExercise } from './services/api';

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

  // Check for saved user session
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
    if (user) loadDashboardData(user.id);
  };

  // Admin actions
  const handleUpdateExercise = (exerciseId) => {
    alert(`Update exercise ${exerciseId} (implement your modal or form here)`);
  };

  const handleDeleteExercise = async (exerciseId) => {
    if (!window.confirm('Are you sure you want to delete this exercise?')) return;
    try {
      await deleteExercise(exerciseId);
      alert('Exercise deleted successfully');
      refreshData();
    } catch (error) {
      alert('Error deleting exercise: ' + error.message);
    }
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        accessibility={accessibility}
        setAccessibility={setAccessibility}
      />
    );
  }

  return (
    <div className={`min-vh-100 ${accessibility.highContrast ? 'bg-dark text-warning' : 'bg-light'}`}>
      <Navbar user={user} onLogout={handleLogout} accessibility={accessibility} />
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
            {activeTab === 'dashboard' && (
              <>
                {user.role === 'PWD' && (
                  <Dashboard
                    user={user}
                    weeklyStats={weeklyStats}
                    assignments={assignments}
                    exercises={exercises} // ✅ Important fix
                    accessibility={accessibility}
                    onRefresh={refreshData}
                    loading={false} // optional: add loading indicator if needed
                  />
                )}
                {(user.role === 'THERAPIST' || user.role === 'CAREGIVER') && (
                  <TherapistDashboard user={user} accessibility={accessibility} />
                )}
                {user.role === 'ADMIN' && (
                  <AdminDashboard user={user} accessibility={accessibility} />
                )}
              </>
            )}

            {activeTab === 'exercises' && (
              <ExercisesPage
                exercises={exercises}
                accessibility={accessibility}
                user={user}
                onUpdate={handleUpdateExercise}
                onDelete={handleDeleteExercise}
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
              <EducationPage education={education} accessibility={accessibility} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
