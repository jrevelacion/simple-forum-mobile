import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

let API_URL = 'https://simple-forum-api.onrender.com'; // Default

export const setApiUrl = (url) => {
  API_URL = url;
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error getting token:', error);
  }
  return config;
});

// Auth
export const auth = {
  register: (username, email, password) =>
    api.post('/api/auth/register', { username, email, password }),
  
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),
  
  getMe: () =>
    api.get('/api/auth/me'),
};

// Posts
export const posts = {
  getAll: () =>
    api.get('/api/posts'),
  
  getById: (id) =>
    api.get(`/api/posts/${id}`),
  
  create: (title, content) =>
    api.post('/api/posts', { title, content }),
};

// Comments
export const comments = {
  add: (postId, content) =>
    api.post('/api/comments', { post_id: postId, content }),
};

// Likes
export const likes = {
  add: (postId) =>
    api.post('/api/likes', { post_id: postId }),
  
  remove: (postId) =>
    api.delete(`/api/likes/${postId}`),
  
  check: (postId) =>
    api.get(`/api/likes/${postId}`),
};

// Users
export const users = {
  getProfile: (id) =>
    api.get(`/api/users/${id}`),
  
  updateProfile: (id, bio, avatarUrl) =>
    api.put(`/api/users/${id}`, { bio, avatar_url: avatarUrl }),
};

export default api;
