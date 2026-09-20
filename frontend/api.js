// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Token management
const getToken = () => localStorage.getItem('steg_token');
const setToken = (token) => localStorage.setItem('steg_token', token);
const removeToken = () => localStorage.removeItem('steg_token');
const getUser = () => JSON.parse(localStorage.getItem('steg_user') || 'null');
const setUser = (user) => localStorage.setItem('steg_user', JSON.stringify(user));
const removeUser = () => localStorage.removeItem('steg_user');

// API Request helper
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() && { 'Authorization': `Bearer ${getToken()}` })
    },
    ...options
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth API
const authAPI = {
  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  },

  register: async (userData) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: userData
    });
  },

  getMe: async () => {
    return await apiRequest('/auth/me');
  },

  logout: () => {
    removeToken();
    removeUser();
    window.location.href = 'index.html';
  },

  isAuthenticated: () => !!getToken()
};

// Stagiaires API
const stagiairesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/stagiaires?${queryString}`);
  },

  getOne: async (id) => {
    return await apiRequest(`/stagiaires/${id}`);
  },

  create: async (stagiaireData) => {
    return await apiRequest('/stagiaires', {
      method: 'POST',
      body: stagiaireData
    });
  },

  update: async (id, stagiaireData) => {
    return await apiRequest(`/stagiaires/${id}`, {
      method: 'PUT',
      body: stagiaireData
    });
  },

  delete: async (id) => {
    return await apiRequest(`/stagiaires/${id}`, {
      method: 'DELETE'
    });
  },

  getStats: async () => {
    return await apiRequest('/stagiaires/stats/dashboard');
  }
};

// Export for global use
window.API = { auth: authAPI, stagiaires: stagiairesAPI, getUser, getToken };
