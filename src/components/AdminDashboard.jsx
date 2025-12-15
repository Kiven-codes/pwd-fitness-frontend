import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://api-app-8efk.onrender.com/api';

function AdminDashboard({ user, accessibility }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPWDs: 0,
    totalTherapists: 0,
    totalExercises: 0,
    totalAssignments: 0
  });
  
  const [users, setUsers] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [activeView, setActiveView] = useState('overview');
  const [loading, setLoading] = useState(false);

  // New exercise form
  const [newExercise, setNewExercise] = useState({
    exercise_name: '',
    description: '',
    difficulty_level: 'Easy',
    equipment_needed: '',
    target_muscle_group: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
  try {
    setLoading(true);

    // Load all users
    const usersRes = await fetch(`${API_BASE_URL}/users/all`); // ✅ updated route
    if (usersRes.ok) {
      const usersData = await usersRes.json();
      setUsers(usersData);

      // Calculate stats
      const pwds = usersData.filter(u => u.role === 'PWD').length;
      const therapists = usersData.filter(u => u.role === 'THERAPIST' || u.role === 'CAREGIVER').length;

      setStats(prev => ({
        ...prev,
        totalUsers: usersData.length,
        totalPWDs: pwds,
        totalTherapists: therapists
      }));
    } else {
      console.error('Failed to fetch users:', usersRes.status);
    }

    // Load exercises
    const exercisesRes = await fetch(`${API_BASE_URL}/exercises`);
    if (exercisesRes.ok) {
      const exercisesData = await exercisesRes.json();
      setExercises(exercisesData);
      setStats(prev => ({ ...prev, totalExercises: exercisesData.length }));
    } else {
      console.error('Failed to fetch exercises:', exercisesRes.status);
    }

    // Load assignments count
    const assignmentsRes = await fetch(`${API_BASE_URL}/assignments/all`);
    if (assignmentsRes.ok) {
      const assignmentsData = await assignmentsRes.json();
      setStats(prev => ({ ...prev, totalAssignments: assignmentsData.length }));
    } else {
      console.error('Failed to fetch assignments:', assignmentsRes.status);
    }

  } catch (error) {
    console.error('Error loading admin data:', error);
  } finally {
    setLoading(false);
  }
};

  const handleAddExercise = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/exercises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExercise)
      });

      if (!response.ok) throw new Error('Failed to add exercise');

      alert('✅ Exercise added successfully!');
      setNewExercise({
        exercise_name: '',
        description: '',
        difficulty_level: 'Easy',
        equipment_needed: '',
        target_muscle_group: ''
      });
      loadData();
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  return (
    <div>
      <h2 className={`mb-4 ${accessibility.largeText ? 'display-5' : ''}`}>
        <i className="bi bi-shield-check me-2"></i>
        Admin Dashboard
      </h2>

      {/* Stats Overview */}
      {activeView === 'overview' && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className={`card text-center ${accessibility.highContrast ? 'bg-dark border-warning text-warning' : 'bg-primary text-white'}`}>
                <div className="card-body">
                  <i className="bi bi-people-fill display-4"></i>
                  <h3 className="mt-2">{stats.totalUsers}</h3>
                  <p className="mb-0">Total Users</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className={`card text-center ${accessibility.highContrast ? 'bg-dark border-warning text-warning' : 'bg-success text-white'}`}>
                <div className="card-body">
                  <i className="bi bi-person-wheelchair display-4"></i>
                  <h3 className="mt-2">{stats.totalPWDs}</h3>
                  <p className="mb-0">PWD Users</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className={`card text-center ${accessibility.highContrast ? 'bg-dark border-warning text-warning' : 'bg-info text-white'}`}>
                <div className="card-body">
                  <i className="bi bi-hospital display-4"></i>
                  <h3 className="mt-2">{stats.totalTherapists}</h3>
                  <p className="mb-0">Therapists</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className={`card text-center ${accessibility.highContrast ? 'bg-dark border-warning text-warning' : 'bg-danger text-white'}`}>
                <div className="card-body">
                  <i className="bi bi-bicycle display-4"></i>
                  <h3 className="mt-2">{stats.totalExercises}</h3>
                  <p className="mb-0">Exercises</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="row g-3">
            <div className="col-md-4">
              <div className={`card ${accessibility.highContrast ? 'bg-dark border-warning' : ''}`}>
                <div className="card-body text-center">
                  <i className="bi bi-person-plus-fill display-1 text-primary"></i>
                  <h5 className="mt-3">Manage Users</h5>
                  <button
                    className="btn btn-primary"
                    onClick={() => setActiveView('users')}
                  >
                    View All Users
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className={`card ${accessibility.highContrast ? 'bg-dark border-warning' : ''}`}>
                <div className="card-body text-center">
                  <i className="bi bi-plus-circle-fill display-1 text-success"></i>
                  <h5 className="mt-3">Add Exercise</h5>
                  <button
                    className="btn btn-success"
                    onClick={() => setActiveView('addExercise')}
                  >
                    Create New Exercise
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className={`card ${accessibility.highContrast ? 'bg-dark border-warning' : ''}`}>
                <div className="card-body text-center">
                  <i className="bi bi-list-check display-1 text-info"></i>
                  <h5 className="mt-3">View Exercises</h5>
                  <button
                    className="btn btn-info text-white"
                    onClick={() => setActiveView('exercises')}
                  >
                    Manage Exercises
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Users List View */}
      {activeView === 'users' && (
        <div className={`card ${accessibility.highContrast ? 'bg-dark border-warning' : ''}`}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="mb-0">All Users</h4>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveView('overview')}>
              <i className="bi bi-arrow-left me-1"></i> Back
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className={`table table-hover ${accessibility.highContrast ? 'table-dark' : ''}`}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Contact</th>
                    <th>Disability Type</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.user_id}>
                      <td>{u.user_id}</td>
                      <td>{u.name}</td>
                      <td>{u.username}</td>
                      <td>
                        <span className={`badge ${
                          u.role === 'PWD' ? 'bg-primary' :
                          u.role === 'THERAPIST' ? 'bg-success' :
                          u.role === 'CAREGIVER' ? 'bg-info' : 'bg-danger'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{u.contact_info || '-'}</td>
                      <td>{u.disability_type || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Exercise Form */}
      {activeView === 'addExercise' && (
        <div className={`card ${accessibility.highContrast ? 'bg-dark border-warning' : ''}`}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Add New Exercise</h4>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveView('overview')}>
              <i className="bi bi-arrow-left me-1"></i> Back
            </button>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddExercise}>
              <div className="mb-3">
                <label className="form-label">Exercise Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newExercise.exercise_name}
                  onChange={(e) => setNewExercise({ ...newExercise, exercise_name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={newExercise.description}
                  onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Difficulty Level</label>
                  <select
                    className="form-select"
                    value={newExercise.difficulty_level}
                    onChange={(e) => setNewExercise({ ...newExercise, difficulty_level: e.target.value })}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Target Muscle Group</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newExercise.target_muscle_group}
                    onChange={(e) => setNewExercise({ ...newExercise, target_muscle_group: e.target.value })}
                    placeholder="e.g., Arms, Legs, Core"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Equipment Needed</label>
                <input
                  type="text"
                  className="form-control"
                  value={newExercise.equipment_needed}
                  onChange={(e) => setNewExercise({ ...newExercise, equipment_needed: e.target.value })}
                  placeholder="e.g., Resistance band, Chair"
                />
              </div>

              <button type="submit" className="btn btn-success">
                <i className="bi bi-plus-circle me-2"></i>
                Add Exercise
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Exercises List */}
      {activeView === 'exercises' && (
        <div className={`card ${accessibility.highContrast ? 'bg-dark border-warning' : ''}`}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="mb-0">All Exercises</h4>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveView('overview')}>
              <i className="bi bi-arrow-left me-1"></i> Back
            </button>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {exercises.map((ex) => (
                <div key={ex.exercise_id} className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h5>{ex.exercise_name}</h5>
                      <p className="mb-2">{ex.description}</p>
                      <div>
                        <span className={`badge me-2 ${
                          ex.difficulty_level === 'Easy' ? 'bg-success' :
                          ex.difficulty_level === 'Medium' ? 'bg-warning text-dark' : 'bg-danger'
                        }`}>
                          {ex.difficulty_level}
                        </span>
                        {ex.target_muscle_group && (
                          <span className="badge bg-info">{ex.target_muscle_group}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;