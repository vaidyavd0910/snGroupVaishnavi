import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const authService = {
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const response = await axios.get(`${API_URL}/users/profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  },

  logout() {
    localStorage.removeItem('token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  async sendOTP(data) {
    try {
      const response = await axios.post(`${API_URL}/users/send-otp`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async verifyOTP(data) {
    try {
      const response = await axios.post(`${API_URL}/users/verify-otp`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/users/register`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getDonationHistory() {
    try {
      const response = await axios.get(`${API_URL}/donations/history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching donation history:', error);
      return [];
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await axios.put(`${API_URL}/users/profile`, profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default authService; 