const API_BASE_URL = 'http://localhost:5000/api';

// ============================================
// AUTHENTICATION
// ============================================

export const safeFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
};

export const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Login failed');

  if (!data?.id) throw new Error('Invalid user data returned from server');
  return data; // ✅ now guaranteed to have user.id
};

export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Registration failed');
  return data;
};

// ============================================
// EXERCISES
// ============================================

export const getExercises = async () => {
  const response = await fetch(`${API_BASE_URL}/exercises`);
  if (!response.ok) throw new Error('Failed to fetch exercises');
  return response.json();
};

export const getExerciseById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/exercises/${id}`);
  if (!response.ok) throw new Error('Failed to fetch exercise');
  return response.json();
};

// ============================================
// ASSIGNMENTS
// ============================================

export const getUserAssignments = async (userId, status = 'Active') => {
  if (!userId) return [];
  const response = await fetch(`${API_BASE_URL}/assignments/user/${userId}?status=${status}`);
  if (!response.ok) throw new Error('Failed to fetch assignments');
  return response.json();
};

// ============================================
// PROGRESS TRACKING
// ============================================

export const logProgress = async (assignmentId, duration, calories, score, remarks = '') => {
  const response = await fetch(`${API_BASE_URL}/progress`, {
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

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to log progress');
  return data;
};

export const getWeeklyProgress = async (userId) => {
  if (!userId) return {};
  const response = await fetch(`${API_BASE_URL}/progress/user/${userId}/weekly`);
  if (!response.ok) throw new Error('Failed to fetch weekly progress');
  return response.json();
};

export const getProgressSummary = async (userId) => {
  if (!userId) return {};
  const response = await fetch(`${API_BASE_URL}/progress/user/${userId}/summary`);
  if (!response.ok) throw new Error('Failed to fetch progress summary');
  return response.json();
};

// ============================================
// HEALTH METRICS
// ============================================

export const getHealthMetrics = async (userId, limit = 5) => {
  if (!userId) return [];
  return safeFetch(`${API_BASE_URL}/health-metrics/user/${userId}?limit=${limit}`);
};

export const addHealthMetric = async (userId, metricData) => {
  if (!userId) throw new Error('Invalid userId');
  return safeFetch(`${API_BASE_URL}/health-metrics/user/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metricData)
  });
};

// ============================================
// EDUCATION
// ============================================

export const getEducation = async (category = null) => {
  const url = category ? `${API_BASE_URL}/education?category=${category}` : `${API_BASE_URL}/education`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch education content');
  return response.json();
};

export const getEducationById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/education/${id}`);
  if (!response.ok) throw new Error('Failed to fetch education content');
  return response.json();
};

export const logContentAccess = async (userId, contentId) => {
  if (!userId) throw new Error('Invalid userId');
  const response = await fetch(`${API_BASE_URL}/education/${contentId}/access`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId })
  });
  if (!response.ok) throw new Error('Failed to log content access');
  return response.json();
};

// ============================================
// COMBINED DATA LOADER
// ============================================

export const loadUserData = async (userId) => {
  if (!userId) {
    console.warn('loadUserData blocked: invalid userId', userId);
    return {
      exercises: [],
      assignments: [],
      weeklyStats: {},
      healthMetrics: [],
      education: []
    };
  }

  const safeCall = async (fn) => {
    try {
      return await fn();
    } catch (err) {
      console.error('Data fetch failed:', err);
      return null;
    }
  };

  const [exercises, assignments, weeklyStats, healthMetrics, education] = await Promise.all([
    safeCall(() => getExercises()),
    safeCall(() => getUserAssignments(userId)),
    safeCall(() => getWeeklyProgress(userId)),
    safeCall(() => getHealthMetrics(userId, 5)),
    safeCall(() => getEducation())
  ]);

  return {
    exercises: exercises || [],
    assignments: assignments || [],
    weeklyStats: weeklyStats || {},
    healthMetrics: healthMetrics || [],
    education: education || []
  };
};
