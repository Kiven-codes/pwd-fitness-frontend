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

  // Exercise form (for both add and edit)
  const [exerciseForm, setExerciseForm] = useState({
    exercise_name: '',
    description: '',
    difficulty_level: 'Easy',
    equipment_needed: '',
    target_muscle_group: ''
  });

  const [editingExercise, setEditingExercise] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load all users
      const usersRes = await fetch(`${API_BASE_URL}/users/all`);
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);

        const pwds = usersData.filter(u => u.role === 'PWD').length;
        const therapists = usersData.filter(u => u.role === 'THERAPIST' || u.role === 'CAREGIVER').length;

        setStats(prev => ({
          ...prev,
          totalUsers: usersData.length,
          totalPWDs: pwds,
          totalTherapists: therapists
        }));
      }

      // Load exercises
      const exercisesRes = await fetch(`${API_BASE_URL}/exercises`);
      if (exercisesRes.ok) {
        const exercisesData = await exercisesRes.json();
        setExercises(exercisesData);
        setStats(prev => ({ ...prev, totalExercises: exercisesData.length }));
      }

      // Load assignments count
      const assignmentsRes = await fetch(`${API_BASE_URL}/assignments/all`);
      if (assignmentsRes.ok) {
        const assignmentsData = await assignmentsRes.json();
        setStats(prev => ({ ...prev, totalAssignments: assignmentsData.length }));
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
        body: JSON.stringify(exerciseForm)
      });

      if (!response.ok) throw new Error('Failed to add exercise');

      alert('✅ Exercise added successfully!');
      setExerciseForm({
        exercise_name: '',
        description: '',
        difficulty_level: 'Easy',
        equipment_needed: '',
        target_muscle_group: ''
      });
      loadData();
      setActiveView('exercises');
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
    setExerciseForm({
      exercise_name: exercise.exercise_name,
      description: exercise.description,
      difficulty_level: exercise.difficulty_level || 'Easy',
      equipment_needed: exercise.equipment_needed || '',
      target_muscle_group: exercise.target_muscle_group || ''
    });
    setActiveView('editExercise');
  };

  const handleUpdateExercise = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/exercises/${editingExercise.exercise_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exerciseForm)
      });

      if (!response.ok) throw new Error('Failed to update exercise');

      alert('✅ Exercise updated successfully!');
      setEditingExercise(null);
      setExerciseForm({
        exercise_name: '',
        description: '',
        difficulty_level: 'Easy',
        equipment_needed: '',
        target_muscle_group: ''
      });
      loadData();
      setActiveView('exercises');
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  const handleDeleteExercise = async (exerciseId, exerciseName) => {
    if (!confirm(`Are you sure you want to delete "${exerciseName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/exercises/${exerciseId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete exercise');
      }

      alert('✅ Exercise deleted successfully!');
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
                  value={exerciseForm.exercise_name}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, exercise_name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={exerciseForm.description}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Difficulty Level</label>
                  <select
                    className="form-select"
                    value={exerciseForm.difficulty_level}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, difficulty_level: e.target.value })}
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
                    value={exerciseForm.target_muscle_group}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, target_muscle_group: e.target.value })}
                    placeholder="e.g., Arms, Legs, Core"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Equipment Needed</label>
                <input
                  type="text"
                  className="form-control"
                  value={exerciseForm.equipment_needed}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, equipment_needed: e.target.value })}
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

      {/* Edit Exercise Form */}
      {activeView === 'editExercise' && editingExercise && (
        <div className={`card ${accessibility.highContrast ? 'bg-dark border-warning' : ''}`}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Edit Exercise</h4>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => {
                setActiveView('exercises');
                setEditingExercise(null);
              }}
            >
              <i className="bi bi-arrow-left me-1"></i> Back
            </button>
          </div>
          <div className="card-body">
            <form onSubmit={handleUpdateExercise}>
              <div className="mb-3">
                <label className="form-label">Exercise Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={exerciseForm.exercise_name}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, exercise_name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={exerciseForm.description}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Difficulty Level</label>
                  <select
                    className="form-select"
                    value={exerciseForm.difficulty_level}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, difficulty_level: e.target.value })}
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
                    value={exerciseForm.target_muscle_group}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, target_muscle_group: e.target.value })}
                    placeholder="e.g., Arms, Legs, Core"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Equipment Needed</label>
                <input
                  type="text"
                  className="form-control"
                  value={exerciseForm.equipment_needed}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, equipment_needed: e.target.value })}
                  placeholder="e.g., Resistance band, Chair"
                />
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-check-circle me-2"></i>
                  Update Exercise
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setActiveView('exercises');
                    setEditingExercise(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Exercises List with Edit/Delete */}
      {activeView === 'exercises' && (
        <div className={`card ${accessibility.highContrast ? 'bg-dark border-warning' : ''}`}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="mb-0">All Exercises</h4>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-success btn-sm" 
                onClick={() => setActiveView('addExercise')}
              >
                <i className="bi bi-plus-circle me-1"></i> Add New
              </button>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setActiveView('overview')}
              >
                <i className="bi bi-arrow-left me-1"></i> Back
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {exercises.map((ex) => (
                <div key={ex.exercise_id} className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="mb-0">{ex.exercise_name}</h5>
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditExercise(ex)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteExercise(ex.exercise_id, ex.exercise_name)}
                            title="Delete"
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      </div>
                      <p className="mb-2 text-muted">{ex.description}</p>
                      <div>
                        <span className={`badge me-2 ${
                          ex.difficulty_level === 'Easy' ? 'bg-success' :
                          ex.difficulty_level === 'Medium' ? 'bg-warning text-dark' : 'bg-danger'
                        }`}>
                          {ex.difficulty_level || 'Easy'}
                        </span>
                        {ex.target_muscle_group && (
                          <span className="badge bg-info">{ex.target_muscle_group}</span>
                        )}
                      </div>
                      {ex.equipment_needed && (
                        <p className="mb-0 mt-2 small text-muted">
                          <i className="bi bi-tools me-1"></i>
                          {ex.equipment_needed}
                        </p>
                      )}
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