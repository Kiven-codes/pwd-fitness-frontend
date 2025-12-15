import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://api-app-8efk.onrender.com/api';

function TherapistDashboard({ user, accessibility }) {
  const [patients, setPatients] = useState([]);
  const [allPWDs, setAllPWDs] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  const [assignmentForm, setAssignmentForm] = useState({
    pwd_id: '',
    exercise_id: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    frequency: 'Daily'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load all PWD users
      const patientsRes = await fetch(`${API_BASE_URL}/users/patients`);
      if (patientsRes.ok) {
        const patientsData = await patientsRes.json();
        setPatients(patientsData);
        setAllPWDs(patientsData); // also use for dropdown
      } else {
        console.error('Failed to fetch patients:', patientsRes.status);
      }

      // Load exercises
      const exercisesRes = await fetch(`${API_BASE_URL}/exercises`);
      if (exercisesRes.ok) {
        const exercisesData = await exercisesRes.json();
        setExercises(exercisesData);
      } else {
        console.error('Failed to fetch exercises:', exercisesRes.status);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignExercise = async (e) => {
    e.preventDefault();

    if (!assignmentForm.pwd_id || !assignmentForm.exercise_id) {
      alert('Please select both patient and exercise');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: parseInt(assignmentForm.pwd_id),
          exercise_id: parseInt(assignmentForm.exercise_id),
          assigned_by: user.id,
          start_date: assignmentForm.start_date,
          end_date: assignmentForm.end_date || null,
          frequency: assignmentForm.frequency
        })
      });

      if (!response.ok) throw new Error('Failed to assign exercise');

      alert('✅ Exercise assigned successfully!');
      setAssignmentForm({
        pwd_id: '',
        exercise_id: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        frequency: 'Daily'
      });
      loadData();
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  const viewPatientProgress = async (patientId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/user/${patientId}/summary`);
      const data = response.ok ? await response.json() : null;
      setSelectedPatient(data);
    } catch (error) {
      console.error('Error loading patient progress:', error);
    }
  };

  return (
    <div>
      <h2 className={`mb-4 ${accessibility.largeText ? 'display-5' : ''}`}>
        {user.role === 'THERAPIST' ? 'Therapist' : 'Caregiver'} Dashboard
      </h2>

      <div className="row g-4">
        {/* Assign Exercise */}
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">Assign Exercise</div>
            <div className="card-body">
              <form onSubmit={handleAssignExercise}>
                <div className="mb-3">
                  <label>Patient (PWD)</label>
                  <select
                    className="form-select"
                    value={assignmentForm.pwd_id}
                    onChange={e => setAssignmentForm({ ...assignmentForm, pwd_id: e.target.value })}
                    required
                  >
                    <option value="">-- Select Patient --</option>
                    {allPWDs.map(pwd => (
                      <option key={pwd.user_id} value={pwd.user_id}>
                        {pwd.name} ({pwd.disability_type})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label>Exercise</label>
                  <select
                    className="form-select"
                    value={assignmentForm.exercise_id}
                    onChange={e => setAssignmentForm({ ...assignmentForm, exercise_id: e.target.value })}
                    required
                  >
                    <option value="">-- Select Exercise --</option>
                    {exercises.map(ex => (
                      <option key={ex.exercise_id} value={ex.exercise_id}>
                        {ex.exercise_name} ({ex.difficulty_level})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label>Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={assignmentForm.start_date}
                      onChange={e => setAssignmentForm({ ...assignmentForm, start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label>End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={assignmentForm.end_date}
                      onChange={e => setAssignmentForm({ ...assignmentForm, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label>Frequency</label>
                  <select
                    className="form-select"
                    value={assignmentForm.frequency}
                    onChange={e => setAssignmentForm({ ...assignmentForm, frequency: e.target.value })}
                  >
                    <option>Daily</option>
                    <option>3x per week</option>
                    <option>5x per week</option>
                    <option>Weekly</option>
                    <option>Bi-weekly</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-success w-100">Assign Exercise</button>
              </form>
            </div>
          </div>
        </div>

        {/* My Patients */}
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header bg-info text-white">My Patients</div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4"><div className="spinner-border"></div></div>
              ) : patients.length === 0 ? (
                <p className="text-muted text-center">No patients found</p>
              ) : (
                <div className="list-group">
                  {patients.map(patient => (
                    <div key={patient.user_id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <h6>{patient.name}</h6>
                        <small>{patient.disability_type}</small>
                      </div>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => viewPatientProgress(patient.user_id)}>
                        View Progress
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Patient Progress Modal */}
      {selectedPatient && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Patient Progress</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedPatient(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <div className="card text-center bg-primary text-white">
                      <div className="card-body">
                        <h4>{selectedPatient.total_sessions || 0}</h4>
                        <small>Total Sessions</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card text-center bg-success text-white">
                      <div className="card-body">
                        <h4>{selectedPatient.total_minutes || 0}</h4>
                        <small>Total Minutes</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card text-center bg-danger text-white">
                      <div className="card-body">
                        <h4>{selectedPatient.total_calories || 0}</h4>
                        <small>Calories</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card text-center bg-info text-white">
                      <div className="card-body">
                        <h4>{selectedPatient.avg_progress_score?.toFixed(1) || 0}</h4>
                        <small>Avg Score</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedPatient(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TherapistDashboard;