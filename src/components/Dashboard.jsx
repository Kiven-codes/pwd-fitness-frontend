import { useState, useEffect } from 'react';
import { logProgress } from '../services/api';

const API_BASE_URL = 'https://api-app-8efk.onrender.com/api';

function Dashboard({ user, weeklyStats, accessibility, onRefresh }) {
  const [assignments, setAssignments] = useState([]);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        // Fetch assignments for this PWD
        const assignmentsRes = await fetch(`${API_BASE_URL}/assignments/user/${user.user_id}`);
        const assignmentsData = await assignmentsRes.json();

        // Fetch all exercises
        const exercisesRes = await fetch(`${API_BASE_URL}/exercises`);
        const exercisesData = await exercisesRes.json();
        setExercises(exercisesData);

        // Map exercise details into assignments
        const assignmentsWithExercise = assignmentsData.map(a => {
          const exercise = exercisesData.find(e => e.exercise_id === a.exercise_id);
          return {
            ...a,
            exercise_name: exercise?.exercise_name || 'Unknown',
            difficulty_level: exercise?.difficulty_level || 'Easy',
            target_muscle_group: exercise?.target_muscle_group || 'N/A',
          };
        });

        setAssignments(assignmentsWithExercise);
      } catch (error) {
        console.error('Error loading assignments:', error);
      }
    };

    loadAssignments();
  }, [user.user_id]);

  const handleLogProgress = async (assignmentId, exerciseName) => {
    const duration = prompt(`Log progress for: ${exerciseName}\n\nDuration (minutes):`);
    if (!duration) return;

    const calories = prompt('Calories burned:');
    if (!calories) return;

    const score = prompt('Progress score (1-10):');
    if (!score) return;

    try {
      await logProgress(
        assignmentId,
        parseInt(duration),
        parseInt(calories),
        parseInt(score),
        'Logged from dashboard'
      );
      alert('✅ Progress logged successfully!');
      onRefresh();
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  return (
    <div>
      <h2 className={`mb-4 ${accessibility.largeText ? 'display-5' : ''}`}>
        <i className="bi bi-speedometer2 me-2"></i>
        Dashboard
      </h2>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className={`card text-center h-100 ${
            accessibility.highContrast ? 'bg-dark border-warning text-warning' : 'bg-primary text-white'
          }`}>
            <div className="card-body">
              <i className="bi bi-calendar-check display-4"></i>
              <h3 className="mt-2">{weeklyStats.total_sessions || 0}</h3>
              <p className={`mb-0 ${accessibility.largeText ? 'fs-5' : ''}`}>Weekly Sessions</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className={`card text-center h-100 ${
            accessibility.highContrast ? 'bg-dark border-warning text-warning' : 'bg-success text-white'
          }`}>
            <div className="card-body">
              <i className="bi bi-clock-fill display-4"></i>
              <h3 className="mt-2">{weeklyStats.total_minutes || 0}</h3>
              <p className={`mb-0 ${accessibility.largeText ? 'fs-5' : ''}`}>Total Minutes</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className={`card text-center h-100 ${
            accessibility.highContrast ? 'bg-dark border-warning text-warning' : 'bg-danger text-white'
          }`}>
            <div className="card-body">
              <i className="bi bi-fire display-4"></i>
              <h3 className="mt-2">{weeklyStats.total_calories || 0}</h3>
              <p className={`mb-0 ${accessibility.largeText ? 'fs-5' : ''}`}>Calories Burned</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className={`card text-center h-100 ${
            accessibility.highContrast ? 'bg-dark border-warning text-warning' : 'bg-info text-white'
          }`}>
            <div className="card-body">
              <i className="bi bi-graph-up-arrow display-4"></i>
              <h3 className="mt-2">
                {weeklyStats.avg_progress_score 
                  ? parseFloat(weeklyStats.avg_progress_score).toFixed(1)
                  : '0'}
              </h3>
              <p className={`mb-0 ${accessibility.largeText ? 'fs-5' : ''}`}>Avg Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Assignments */}
      <div className={`card ${accessibility.highContrast ? 'bg-dark border-warning' : ''}`}>
        <div className="card-header">
          <h4 className={`mb-0 ${accessibility.largeText ? 'fs-3' : ''}`}>
            <i className="bi bi-clipboard-check me-2"></i>
            Active Exercise Assignments
          </h4>
        </div>
        <div className="card-body">
          {assignments.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox display-1 text-muted"></i>
              <p className="text-muted mt-3">
                No active assignments. Your therapist will assign exercises soon.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className={`table table-hover ${
                accessibility.highContrast ? 'table-dark' : ''
              } ${accessibility.largeText ? 'table-lg' : ''}`}>
                <thead>
                  <tr>
                    <th>Exercise</th>
                    <th>Difficulty</th>
                    <th>Target Muscle</th>
                    <th>Frequency</th>
                    <th>Assigned By</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment) => (
                    <tr key={assignment.assignment_id}>
                      <td><strong>{assignment.exercise_name}</strong></td>
                      <td>
                        <span className={`badge ${
                          assignment.difficulty_level === 'Easy'
                            ? 'bg-success'
                            : assignment.difficulty_level === 'Medium'
                            ? 'bg-warning text-dark'
                            : 'bg-danger'
                        }`}>
                          {assignment.difficulty_level}
                        </span>
                      </td>
                      <td>{assignment.target_muscle_group || 'N/A'}</td>
                      <td>{assignment.frequency}</td>
                      <td>
                        {assignment.assigned_by_name}<br/>
                        <small className="text-muted">({assignment.assigned_by_role})</small>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleLogProgress(
                            assignment.assignment_id,
                            assignment.exercise_name
                          )}
                        >
                          <i className="bi bi-check-circle me-1"></i> Log Progress
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
