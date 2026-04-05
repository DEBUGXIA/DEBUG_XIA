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

// Initialize token from localStorage on app start
const initializeToken = () => {
  const token = localStorage.getItem('access_token');
  if (token) {
    apiClient.defaults.headers.Authorization = `Bearer ${token}`;
    console.log('[API] Token initialized from localStorage');
  }
};

// Initialize on import
initializeToken();

// Add JWT token to requests (per-request check)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    console.log(`[INTERCEPTOR] ${config.method.toUpperCase()} ${config.url}`, {
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'NONE',
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[INTERCEPTOR] ✓ Auth header set`);
    } else {
      console.warn(`[INTERCEPTOR] ⚠ No token found for authenticated request`);
    }
    return config;
  },
  (error) => {
    console.error('[INTERCEPTOR] Request error:', error);
    return Promise.reject(error);
  }
);

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    console.log('[RESPONSE] Error status:', error.response?.status, 'URL:', originalRequest?.url);
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('[RESPONSE] Got 401, attempting token refresh...');
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          console.log('[RESPONSE] Refresh token found, requesting new access token');
          
          const response = await axios.post('http://localhost:8000/token/refresh/', {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          apiClient.defaults.headers.Authorization = `Bearer ${access}`;
          console.log('[RESPONSE] ✓ Token refreshed successfully');
          
          return apiClient(originalRequest);
        } else {
          console.warn('[RESPONSE] No refresh token found');
        }
      } catch (refreshError) {
        console.error('[RESPONSE] Token refresh failed:', refreshError.response?.status, refreshError.response?.data);
        // Only clear tokens if refresh truly failed
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    
    console.log('[RESPONSE] ✗ Request failed:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ==================== AUTH ENDPOINTS ====================
export const authAPI = {
  signup: async (data) => {
    try {
      console.log('[API] Signup request:', { email: data.email, username: data.username });
      const response = await apiClient.post('/users/signup/', data);
      const { access, refresh } = response.data;
      
      // Save tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Set in default headers
      apiClient.defaults.headers.Authorization = `Bearer ${access}`;
      console.log('[API] Signup successful, token saved');
      
      return response.data;
    } catch (error) {
      console.error('[API] Signup error:', error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  signin: async (email, password) => {
    try {
      console.log('[API] Signin request:', { email });
      const response = await apiClient.post('/users/signin/', { email, password });
      const { access, refresh } = response.data;
      
      // Save tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Set in default headers immediately
      apiClient.defaults.headers.Authorization = `Bearer ${access}`;
      console.log('[API] Signin successful, token saved and set in headers');
      
      return response.data;
    } catch (error) {
      console.error('[API] Signin error:', error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete apiClient.defaults.headers.Authorization;
    console.log('[API] Logout successful');
  },

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('[API] getCurrentUser - Token exists:', !!token);
      
      if (token) {
        apiClient.defaults.headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await apiClient.get('/users/me/');
      console.log('[API] getCurrentUser successful');
      return response.data;
    } catch (error) {
      console.error('[API] getCurrentUser error:', error.response?.status, error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  updateProfile: async (data) => {
    try {
      console.log('[API] Updating user profile:', data);
      const response = await apiClient.put('/users/update_profile/', data);
      console.log('[API] User profile updated successfully');
      return response.data;
    } catch (error) {
      console.error('[API] Error updating profile:', error.response?.data || error);
      throw error.response?.data || error;
    }
  },
};

// ==================== USER PROFILE ENDPOINTS ====================
export const profileAPI = {
  getProfile: async () => {
    try {
      const response = await apiClient.get('/profiles/me/');
      console.log('[API] Got profile:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API] getProfile error:', error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  updateMyProfile: async (data) => {
    try {
      console.log('[API] Updating profile:', data);
      const response = await apiClient.put('/profiles/me/', data);
      console.log('[API] Profile updated successfully');
      return response.data;
    } catch (error) {
      console.error('[API] Error updating profile:', error.response?.data || error);
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
};

// ==================== CODE EXECUTION ENDPOINTS ====================
export const executionAPI = {
  executeCode: async (executionData) => {
    try {
      const response = await apiClient.post('/executions/', executionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getExecutions: async (filters = {}) => {
    try {
      const response = await apiClient.get('/executions/', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// ==================== ANALYSIS ENDPOINTS ====================
export const analysisAPI = {
  analyzeCode: async (analysisData) => {
    try {
      const response = await apiClient.post('/analysis/', analysisData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAnalysis: async (filters = {}) => {
    try {
      const response = await apiClient.get('/analysis/', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default apiClient;
