const API_BASE_URL = 'https://api-app-8efk.onrender.com/api';

// ============================================
// SAFE FETCH
// ============================================

export const safeFetch = async (url, options = {}) => {
  const response = await fetch(url, options);

  const contentType = response.headers.get('content-type');
  let data;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    throw new Error(
      typeof data === 'string'
        ? data
        : data?.error || data?.message || `Request failed (${response.status})`
    );
  }

  return data;
};

// ============================================
// AUTHENTICATION
// ============================================

export const login = async (username, password) => {
  const data = await safeFetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!data?.user?.id) throw new Error('Invalid user data returned');
  return data.user;
};

export const register = async (userData) =>
  safeFetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

// ============================================
// EXERCISES
// ============================================

export const getExercises = async () => safeFetch(`${API_BASE_URL}/exercises`);

export const getExerciseById = async (id) =>
  safeFetch(`${API_BASE_URL}/exercises/${id}`);

export const updateExercise = async (id, exerciseData) =>
  safeFetch(`${API_BASE_URL}/exercises/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exerciseData)
  });

export const deleteExercise = async (id) =>
  safeFetch(`${API_BASE_URL}/exercises/${id}`, { method: 'DELETE' });

// ============================================
// ASSIGNMENTS
// ============================================

export const getUserAssignments = async (userId) => {
  if (!userId) return [];
  return safeFetch(`${API_BASE_URL}/assignments/user/${userId}`);
};

// Fetch all patients (users with role 'PWD')
export const getPatients = async () => safeFetch(`${API_BASE_URL}/users/all`);

// Assign exercise
export const assignExercise = async (assignmentData) =>
  safeFetch(`${API_BASE_URL}/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assignmentData)
  });

// ============================================
// PROGRESS TRACKING
// ============================================

export const logProgress = async (assignmentId, duration, calories, score, remarks = '') =>
  safeFetch(`${API_BASE_URL}/progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      assignment_id: assignmentId,
      duration_minutes: duration,
      calories_burned: calories,
      progress_score: score,
      remarks
    })
  });

export const getWeeklyProgress = async (userId) => {
  if (!userId) return {};
  return safeFetch(`${API_BASE_URL}/progress/user/${userId}/weekly`);
};

export const getProgressSummary = async (userId) => {
  if (!userId) return {};
  return safeFetch(`${API_BASE_URL}/progress/user/${userId}/summary`);
};

// ============================================
// HEALTH METRICS
// ============================================

export const getHealthMetrics = async (userId, limit = 5) => {
  if (!userId) return [];
  return safeFetch(`${API_BASE_URL}/health-metrics/user/${userId}?limit=${limit}`);
};

export const addHealthMetric = async (userId, metricData) =>
  safeFetch(`${API_BASE_URL}/health-metrics/user/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metricData)
  });

// ============================================
// EDUCATION
// ============================================

export const getEducation = async (category = null) => {
  const url = category
    ? `${API_BASE_URL}/education?category=${category}`
    : `${API_BASE_URL}/education`;
  return safeFetch(url);
};

export const getEducationById = async (id) =>
  safeFetch(`${API_BASE_URL}/education/${id}`);

export const logContentAccess = async (userId, contentId) =>
  safeFetch(`${API_BASE_URL}/education/${contentId}/access`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId })
  });

// ============================================
// DASHBOARD DATA LOADER
// ============================================

export const loadUserData = async (userId) => {
  if (!userId) {
    return {
      exercises: [],
      assignments: [],
      weeklyStats: {},
      healthMetrics: [],
      education: [],
      patients: []
    };
  }

  const safeCall = async (fn) => {
    try {
      return await fn();
    } catch (err) {
      console.error('Data fetch failed:', err.message);
      return null;
    }
  };

  const [exercises, assignments, weeklyStats, healthMetrics, education, patients] =
    await Promise.all([
      safeCall(() => getExercises()),
      safeCall(() => getUserAssignments(userId)),
      safeCall(() => getWeeklyProgress(userId)),
      safeCall(() => getHealthMetrics(userId)),
      safeCall(() => getEducation()),
      safeCall(() => getPatients())
    ]);

  return {
    exercises: exercises || [],
    assignments: assignments || [],
    weeklyStats: weeklyStats || {},
    healthMetrics: healthMetrics || [],
    education: education || [],
    patients: patients || []
  };
};
