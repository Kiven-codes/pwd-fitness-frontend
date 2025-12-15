export function ExercisesPage({ exercises, accessibility }) {
  return (
    <div>
      <h2 className={`mb-4 ${accessibility.largeText ? 'display-5' : ''}`}>
        <i className="bi bi-bicycle me-2"></i>
        Exercise Library
      </h2>

      <div className="row g-4">
        {exercises.map((exercise) => (
          <div key={exercise.exercise_id} className="col-md-6 col-lg-4">
            <div className={`card h-100 ${
              accessibility.highContrast ? 'bg-dark border-warning' : ''
            }`}>
              <div className="card-body">
                <h5 className={`card-title ${accessibility.largeText ? 'fs-4' : ''}`}>
                  {exercise.exercise_name}
                </h5>
                <p className={`card-text ${accessibility.largeText ? 'fs-5' : ''}`}>
                  {exercise.description}
                </p>
                
                <div className="mt-3">
                  <span className={`badge me-2 ${
                    exercise.difficulty_level === 'Easy'
                      ? 'bg-success'
                      : exercise.difficulty_level === 'Medium'
                      ? 'bg-warning text-dark'
                      : 'bg-danger'
                  }`}>
                    {exercise.difficulty_level}
                  </span>
                  {exercise.target_muscle_group && (
                    <span className="badge bg-info">
                      {exercise.target_muscle_group}
                    </span>
                  )}
                </div>

                {exercise.equipment_needed && (
                  <p className="mt-3 mb-0 small">
                    <strong><i className="bi bi-tools me-1"></i>Equipment:</strong>{' '}
                    {exercise.equipment_needed}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {exercises.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <p className="text-muted mt-3">No exercises available</p>
        </div>
      )}
    </div>
  );
}

export default ExercisesPage;