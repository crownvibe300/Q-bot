// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API utility functions
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  // POST request
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // PUT request
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }
}

// Create singleton instance
const apiService = new ApiService();

// Authentication API methods
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await apiService.post('/auth/register', userData);
    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiService.post('/auth/login', credentials);
    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Logout user
  logout: async () => {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    return apiService.get('/auth/me');
  },

  // Google OAuth login
  googleLogin: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Get stored user data
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get stored token
  getStoredToken: () => {
    return localStorage.getItem('authToken');
  }
};

// User API methods
export const userAPI = {
  // Get user profile
  getProfile: async () => {
    return apiService.get('/users/profile');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return apiService.put('/users/profile', profileData);
  }
};

// Conversation API methods
export const conversationAPI = {
  // Get conversation history
  getHistory: async (page = 1, limit = 10) => {
    return apiService.get(`/conversations?page=${page}&limit=${limit}`);
  },

  // Get specific conversation
  getConversation: async (conversationId) => {
    return apiService.get(`/conversations/${conversationId}`);
  },

  // Save conversation
  saveConversation: async (conversationData) => {
    return apiService.post('/conversations', conversationData);
  },

  // Update conversation
  updateConversation: async (conversationId, conversationData) => {
    return apiService.put(`/conversations/${conversationId}`, conversationData);
  },

  // Delete conversation
  deleteConversation: async (conversationId) => {
    return apiService.delete(`/conversations/${conversationId}`);
  },

  // Search conversations
  searchConversations: async (query) => {
    return apiService.get(`/conversations/search?q=${encodeURIComponent(query)}`);
  }
};

// Health check
export const healthAPI = {
  check: async () => {
    return apiService.get('/health');
  }
};

export default apiService;
