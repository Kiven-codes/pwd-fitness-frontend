export function Navbar({ user, onLogout, accessibility }) {
  return (
    <nav className={`navbar navbar-expand-lg shadow-sm ${
      accessibility.highContrast 
        ? 'navbar-dark bg-dark border-bottom border-warning' 
        : 'navbar-light bg-white'
    }`}>
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <i className="bi bi-heart-pulse-fill text-danger me-2"></i>
          <span className={accessibility.largeText ? 'fs-4' : ''}>
            PWD Fitness Tracker
          </span>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item me-3">
              <span className={`navbar-text ${accessibility.largeText ? 'fs-5' : ''}`}>
                <i className="bi bi-person-circle me-2"></i>
                {user.name}
                <small className="text-muted ms-2">({user.role})</small>
              </span>
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-danger" onClick={onLogout}>
                <i className="bi bi-box-arrow-right me-1"></i>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;