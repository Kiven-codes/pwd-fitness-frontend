// ============================================
// src/components/Sidebar.jsx
// ============================================

export function Sidebar({ activeTab, setActiveTab, accessibility, setAccessibility, userRole }) {
  const speak = (text) => {
    if (accessibility.voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  // Different menu items based on role
  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: 'speedometer2' },
      { id: 'exercises', label: 'Exercises', icon: 'bicycle' },
      { id: 'education', label: 'Education', icon: 'book' }
    ];

    // Add Health Metrics only for PWD
    if (userRole === 'PWD') {
      baseItems.splice(2, 0, { id: 'health', label: 'Health Metrics', icon: 'heart-pulse' });
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className={`card ${accessibility.highContrast ? 'bg-dark border-warning' : ''}`}>
      <div className="card-body">
        <h6 className={`card-title ${accessibility.largeText ? 'fs-4' : ''}`}>
          Navigation
        </h6>
        <div className="d-grid gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`btn text-start ${
                activeTab === item.id
                  ? 'btn-primary'
                  : 'btn-outline-primary'
              }`}
              onClick={() => {
                setActiveTab(item.id);
                speak(item.label);
              }}
            >
              <i className={`bi bi-${item.icon} me-2`}></i>
              {item.label}
            </button>
          ))}
        </div>

        <hr className="my-3" />

        <h6 className={`mt-3 ${accessibility.largeText ? 'fs-5' : ''}`}>
          Accessibility
        </h6>
        <div className="d-grid gap-2">
          <button
            className={`btn btn-sm ${
              accessibility.largeText ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => {
              setAccessibility({ ...accessibility, largeText: !accessibility.largeText });
              speak(accessibility.largeText ? 'Large text disabled' : 'Large text enabled');
            }}
          >
            <i className="bi bi-fonts me-1"></i>
            Large Text
          </button>

          <button
            className={`btn btn-sm ${
              accessibility.highContrast ? 'btn-warning' : 'btn-outline-warning'
            }`}
            onClick={() => {
              setAccessibility({ ...accessibility, highContrast: !accessibility.highContrast });
              speak(accessibility.highContrast ? 'High contrast disabled' : 'High contrast enabled');
            }}
          >
            <i className="bi bi-eye-fill me-1"></i>
            High Contrast
          </button>

          <button
            className={`btn btn-sm ${
              accessibility.voiceEnabled ? 'btn-success' : 'btn-outline-success'
            }`}
            onClick={() => {
              const newState = !accessibility.voiceEnabled;
              setAccessibility({ ...accessibility, voiceEnabled: newState });
              if (newState) speak('Voice assistance enabled');
            }}
          >
            <i className="bi bi-volume-up-fill me-1"></i>
            Voice
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;