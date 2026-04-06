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

// ==================== AUTO-LOGOUT HANDLER ====================
// This will be called when server is unreachable or during logout
let onAutoLogout = null;

// Register callback for auto-logout
export const setAutoLogoutCallback = (callback) => {
  onAutoLogout = callback;
  console.log('[API] Auto-logout callback registered');
};

// Execute auto-logout
const executeAutoLogout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  delete apiClient.defaults.headers.Authorization;
  
  if (onAutoLogout) {
    console.log('[API] ⚠️ Server unreachable - executing auto-logout');
    onAutoLogout();
  }
};

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
      dataType: config.data?.constructor?.name,
      isFormData: config.data instanceof FormData,
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[INTERCEPTOR] ✓ Auth header set`);
    } else {
      console.warn(`[INTERCEPTOR] ⚠ No token found for authenticated request`);
    }
    
    // CRITICAL: When sending FormData, let axios set Content-Type automatically
    // Axios will set multipart/form-data with proper boundary
    if (config.data instanceof FormData) {
      console.log('[INTERCEPTOR] 📦 FormData detected - removing Content-Type header to let axios set it');
      delete config.headers['Content-Type'];
      
      console.log('[INTERCEPTOR] FormData entries:');
      for (let [key, value] of config.data) {
        if (value instanceof File) {
          console.log(`  - ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`  - ${key}: ${value}`);
        }
      }
    }
    
    return config;
  },
  (error) => {
    console.error('[INTERCEPTOR] Request error:', error);
    return Promise.reject(error);
  }
);

// Handle token refresh on 401 and server connectivity
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    console.log('[RESPONSE] Error status:', error.response?.status, 'URL:', originalRequest?.url);
    
    // Handle server connectivity issues (network errors, connection refused, etc.)
    if (!error.response) {
      // Network error - server is likely down or unreachable
      console.error('[RESPONSE] ❌ SERVER UNREACHABLE - Network Error:', error.message);
      executeAutoLogout();
      return Promise.reject({
        message: 'Server is unreachable. Please check your connection.',
        isServerDown: true
      });
    }
    
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
        // Refresh failed - execute auto-logout
        executeAutoLogout();
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
    console.log('[API] Logging out...');
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
      
      // Add cache-busting query parameter instead of headers to avoid CORS issues
      const cacheBuster = `?t=${Date.now()}`;
      const response = await apiClient.get(`/users/me/${cacheBuster}`);
      console.log('[API] getCurrentUser successful:', response.data);
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
      // Add cache-busting query parameter instead of headers
      const cacheBuster = `?t=${Date.now()}`;
      const response = await apiClient.get(`/profiles/me/${cacheBuster}`);
      console.log('[API] Got profile:', response.data);
      console.log('   - Profile image URL:', response.data?.user?.profile_image);
      return response.data;
    } catch (error) {
      console.error('[API] getProfile error:', error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  updateMyProfile: async (data, isFormData = false) => {
    try {
      console.log('[API] Updating profile:', isFormData ? 'FormData with image' : 'JSON data');
      console.log('[API] isFormData param:', isFormData);
      console.log('[API] data is FormData:', data instanceof FormData);
      
      // Send the data - let axios handle it
      // If it's FormData, the interceptor will remove Content-Type
      // and let axios set multipart/form-data with boundary
      const response = await apiClient.put('/profiles/me/', data);
      
      console.log('[API] ✅ Profile updated successfully');
      console.log('[API] Response status:', response.status);
      
      if (response.data.user) {
        console.log('[API] User profile_image:', response.data.user.profile_image);
      }
      
      return response.data;
    } catch (error) {
      console.error('[API] ❌ Error updating profile:', error.response?.status, error.response?.data || error);
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

// ==================== SERVER HEALTH CHECK ====================
export const checkServerHealth = async () => {
  try {
    // Try to reach a simple endpoint that requires no auth
    const response = await axios.get('http://localhost:8000/api/users/me/', {
      timeout: 5000 // 5 second timeout
    });
    console.log('[HEALTH] ✓ Server is reachable');
    return true;
  } catch (error) {
    if (error.message === 'Network Error' || !error.response) {
      console.error('[HEALTH] ❌ Server is unreachable - Network Error');
      executeAutoLogout();
      return false;
    }
    // Other HTTP errors might still mean server is up (just auth issues)
    console.log('[HEALTH] Server responded with status:', error.response?.status);
    return true;
  }
};

// Start periodic health check (every 30 seconds)
let healthCheckInterval = null;

export const startHealthCheck = (interval = 30000) => {
  if (healthCheckInterval) {
    console.log('[HEALTH] Health check already running');
    return;
  }
  
  console.log('[HEALTH] Starting health check every', interval / 1000, 'seconds');
  healthCheckInterval = setInterval(() => {
    checkServerHealth().catch(err => {
      console.error('[HEALTH] Health check error:', err);
    });
  }, interval);
  
  // Initial check
  checkServerHealth().catch(err => {
    console.error('[HEALTH] Initial health check error:', err);
  });
};

export const stopHealthCheck = () => {
  if (healthCheckInterval) {
    console.log('[HEALTH] Stopping health check');
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
  }
};

export default apiClient;
