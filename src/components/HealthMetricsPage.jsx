import { addHealthMetric } from '../services/api';

export function HealthMetricsPage({ user, healthMetrics, accessibility, onRefresh }) {

  // ✅ Guard check at the very top
  if (!user) {
    return <p className="text-danger">User not loaded. Please log in first.</p>;
  }

  const handleAddMetric = async () => {
    const weight = prompt('Weight (kg):');
    if (!weight) return;

    const bp = prompt('Blood Pressure (e.g., 120/80):');
    if (!bp) return;

    const mobility = prompt('Mobility Score (1-10):');
    if (!mobility) return;

    const notes = prompt('Notes (optional):') || '';

  try {
    await addHealthMetric(user.id, {
      weight: parseFloat(weight),
      blood_pressure: bp,
      mobility_score: parseInt(mobility),
      notes
    });
    alert('✅ Health metric added successfully!');
    onRefresh();
  } catch (error) {
    alert('❌ Error: ' + error.message);
  }
};

return (
  <div>
      <h2 className={`mb-4 ${accessibility.largeText ? 'display-5' : ''}`}>
        <i className="bi bi-heart-pulse me-2"></i>
        Health Metrics
      </h2>

      {/* Add Metric Button */}
      <div className={`card mb-4 ${accessibility.highContrast ? 'bg-dark border-warning' : ''}`}>
        <div className="card-body">
          <button
            className="btn btn-success"
            onClick={handleAddMetric}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Health Metric
          </button>
        </div>
      </div>

      {/* Recent Metrics */}
      <div className={`card ${accessibility.highContrast ? 'bg-dark border-warning' : ''}`}>
        <div className="card-header">
          <h4 className={`mb-0 ${accessibility.largeText ? 'fs-3' : ''}`}>
            Recent Metrics
          </h4>
        </div>
        <div className="card-body">
          {healthMetrics.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-clipboard-data display-1 text-muted"></i>
              <p className="text-muted mt-3">No health metrics recorded yet</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className={`table table-hover ${
                accessibility.highContrast ? 'table-dark' : ''
              }`}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Weight</th>
                    <th>Blood Pressure</th>
                    <th>Mobility Score</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {healthMetrics.map((metric, idx) => (
                    <tr key={idx}>
                      <td>
                        {new Date(metric.date_recorded).toLocaleDateString()}
                      </td>
                      <td>{metric.weight} kg</td>
                      <td>{metric.blood_pressure}</td>
                      <td>
  <span className="badge bg-info">
    {metric.mobility_score}/10
  </span>
</td>
<td>{metric.notes || '-'}</td>
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

export default HealthMetricsPage;