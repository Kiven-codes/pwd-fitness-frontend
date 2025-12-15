import { useState } from 'react';
import { deleteExercise, updateExercise } from '../services/api';
import { Modal, Button, Form } from 'react-bootstrap';

export function ExercisesPage({ exercises: initialExercises, accessibility, user, refreshData }) {
  const [exercises, setExercises] = useState(initialExercises);
  const [loadingDelete, setLoadingDelete] = useState(null);

  // --- Edit state ---
  const [editingExercise, setEditingExercise] = useState(null);
  const [formData, setFormData] = useState({
    exercise_name: '',
    description: '',
    difficulty_level: 'Easy',
    equipment_needed: '',
    target_muscle_group: ''
  });

  const handleDelete = async (exerciseId) => {
    if (!window.confirm('Are you sure you want to delete this exercise?')) return;

    try {
      setLoadingDelete(exerciseId);
      await deleteExercise(exerciseId);
      setExercises(prev => prev.filter(e => e.exercise_id !== exerciseId));
      refreshData?.();
      alert('✅ Exercise deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('❌ Error deleting exercise. But it may have already been deleted.');
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleEdit = (exercise) => {
    setEditingExercise(exercise);
    setFormData({
      exercise_name: exercise.exercise_name,
      description: exercise.description,
      difficulty_level: exercise.difficulty_level,
      equipment_needed: exercise.equipment_needed || '',
      target_muscle_group: exercise.target_muscle_group || ''
    });
  };

  const handleSaveEdit = async () => {
    try {
      const updated = await updateExercise(editingExercise.exercise_id, formData);
      setExercises(prev => prev.map(e => 
        e.exercise_id === editingExercise.exercise_id ? { ...e, ...formData } : e
      ));
      setEditingExercise(null);
      refreshData?.();
      alert('✅ Exercise updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
      alert('❌ Error updating exercise: ' + error.message);
    }
  };

  return (
    <div>
      <h2 className={`mb-4 ${accessibility.largeText ? 'display-5' : ''}`}>
        <i className="bi bi-bicycle me-2"></i> Exercise Library
      </h2>

      <div className="row g-4">
        {exercises.map((exercise) => (
          <div key={exercise.exercise_id} className="col-md-6 col-lg-4">
            <div className={`card h-100 ${accessibility.highContrast ? 'bg-dark border-warning' : ''}`}>
              <div className="card-body">
                <h5 className={`card-title ${accessibility.largeText ? 'fs-4' : ''}`}>
                  {exercise.exercise_name}
                </h5>
                <p className={`card-text ${accessibility.largeText ? 'fs-5' : ''}`}>
                  {exercise.description}
                </p>
                <div className="mt-3">
                  <span className={`badge me-2 ${
                    exercise.difficulty_level === 'Easy' ? 'bg-success' :
                    exercise.difficulty_level === 'Medium' ? 'bg-warning text-dark' :
                    'bg-danger'
                  }`}>
                    {exercise.difficulty_level}
                  </span>
                  {exercise.target_muscle_group && (
                    <span className="badge bg-info">{exercise.target_muscle_group}</span>
                  )}
                </div>
                {exercise.equipment_needed && (
                  <p className="mt-3 mb-0 small">
                    <strong><i className="bi bi-tools me-1"></i>Equipment:</strong> {exercise.equipment_needed}
                  </p>
                )}
                {user.role === 'ADMIN' && (
                  <div className="mt-3 d-flex gap-2">
                    <button className="btn btn-sm btn-primary" onClick={() => handleEdit(exercise)}>Edit</button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(exercise.exercise_id)}
                      disabled={loadingDelete === exercise.exercise_id}
                    >
                      {loadingDelete === exercise.exercise_id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal show={!!editingExercise} onHide={() => setEditingExercise(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Exercise</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.exercise_name}
                onChange={(e) => setFormData({...formData, exercise_name: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Difficulty</Form.Label>
              <Form.Select
                value={formData.difficulty_level}
                onChange={(e) => setFormData({...formData, difficulty_level: e.target.value})}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Equipment</Form.Label>
              <Form.Control
                type="text"
                value={formData.equipment_needed}
                onChange={(e) => setFormData({...formData, equipment_needed: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Target Muscle</Form.Label>
              <Form.Control
                type="text"
                value={formData.target_muscle_group}
                onChange={(e) => setFormData({...formData, target_muscle_group: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditingExercise(null)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveEdit}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ExercisesPage;