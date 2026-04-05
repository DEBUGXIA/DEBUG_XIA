import axios from 'axios';

// API base URL - configure this based on your environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/../token/refresh/`, {
            refresh: refreshToken,
          });
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          apiClient.defaults.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/SingIn';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ENDPOINTS ====================
export const authAPI = {
  signup: async (data) => {
    try {
      const response = await apiClient.post('/users/signup/', data);
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  signin: async (email, password) => {
    try {
      const response = await apiClient.post('/users/signin/', { email, password });
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    apiClient.defaults.headers.Authorization = '';
  },

  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/users/me/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// ==================== USER PROFILE ENDPOINTS ====================
export const profileAPI = {
  getProfile: async () => {
    try {
      const response = await apiClient.get('/profiles/');
      return response.data[0] || response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await apiClient.put('/users/update_profile/', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateMyProfile: async (data) => {
    try {
      const response = await apiClient.patch('/profiles/update_my_profile/', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// ==================== ERROR LOG ENDPOINTS ====================
export const errorAPI = {
  getErrors: async (filters = {}) => {
    try {
      const response = await apiClient.get('/errors/', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createError: async (errorData) => {
    try {
      const response = await apiClient.post('/errors/', errorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateError: async (id, data) => {
    try {
      const response = await apiClient.patch(`/errors/${id}/`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteError: async (id) => {
    try {
      await apiClient.delete(`/errors/${id}/`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  markResolved: async (id) => {
    try {
      const response = await apiClient.put(`/errors/${id}/mark_resolved/`, {});
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getStatistics: async () => {
    try {
      const response = await apiClient.get('/errors/statistics/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getErrorsByType: async (errorType) => {
    try {
      const response = await apiClient.get('/errors/', {
        params: { error_type: errorType },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getErrorsBySeverity: async (severity) => {
    try {
      const response = await apiClient.get('/errors/', {
        params: { severity },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// ==================== CODE EXECUTION ENDPOINTS ====================
export const executionAPI = {
  getExecutions: async (filters = {}) => {
    try {
      const response = await apiClient.get('/executions/', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  executeCode: async (language, code) => {
    try {
      const response = await apiClient.post('/executions/', { language, code });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getStatistics: async () => {
    try {
      const response = await apiClient.get('/executions/statistics/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// ==================== ANALYSIS ENDPOINTS ====================
export const analysisAPI = {
  getAnalysis: async (filters = {}) => {
    try {
      const response = await apiClient.get('/analysis/', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createAnalysis: async (analysisData) => {
    try {
      const response = await apiClient.post('/analysis/', analysisData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAnalysisByType: async (analysisType) => {
    try {
      const response = await apiClient.get('/analysis/by_type/', {
        params: { type: analysisType },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default apiClient;
