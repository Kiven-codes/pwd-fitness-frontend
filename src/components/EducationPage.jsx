// ============================================
// src/components/EducationPage.jsx
// ============================================

export function EducationPage({ education, accessibility }) {
  const getCategoryBadge = (category) => {
    const badges = {
      'fitness': 'bg-primary',
      'nutrition': 'bg-success',
      'mental health': 'bg-info'
    };
    return badges[category] || 'bg-secondary';
  };

  return (
    <div>
      <h2 className={`mb-4 ${accessibility.largeText ? 'display-5' : ''}`}>
        <i className="bi bi-book me-2"></i>
        Educational Resources
      </h2>

      <div className="row g-4">
        {education.map((content) => (
          <div key={content.content_id} className="col-12">
            <div className={`card ${
              accessibility.highContrast ? 'bg-dark border-warning' : ''
            }`}>
              <div className="card-body">
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0 me-3">
                    <i className="bi bi-book-fill text-primary display-4"></i>
                  </div>
                  <div className="flex-grow-1">
                    <h5 className={`card-title ${accessibility.largeText ? 'fs-3' : ''}`}>
                      {content.title}
                    </h5>
                    <p className={`card-text ${accessibility.largeText ? 'fs-5' : ''}`}>
                      {content.description}
                    </p>
                    
                    <div className="d-flex gap-2 align-items-center">
                      <span className={`badge ${getCategoryBadge(content.category)}`}>
                        {content.category}
                      </span>
                      
                      {content.accessibility_features && (
                        <span className="badge bg-success">
                          <i className="bi bi-universal-access me-1"></i>
                          Accessible
                        </span>
                      )}
                    </div>

                    {content.file_link && (
                      <a
                        href={content.file_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary mt-3"
                      >
                        <i className="bi bi-box-arrow-up-right me-1"></i>
                        View Resource
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {education.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <p className="text-muted mt-3">No educational content available</p>
        </div>
      )}
    </div>
  );
}
export default EducationPage;