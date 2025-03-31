
import axios from 'axios';

const API_URL = 'http://localhost:8000'; // FastAPI default port

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  user_id: string;
  content: string;
  timestamp: string;
  type: 'user' | 'bot';
}

export interface Credential {
  id: string;
  user_id: string;
  service: string;
  details: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsData {
  daily_sessions: { day: string; count: number }[];
  user_activity: {
    active_users: number;
    total_messages: number;
    average_session_duration: string;
  };
  system_metrics: {
    cpu_usage: number;
    memory_usage: number;
    storage_usage: number;
    network_bandwidth: number;
  };
}

// Auth token handling
let authToken: string | null = null;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Authentication
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    // FastAPI expects form data for OAuth2 login
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await axios.post(`${API_URL}/token`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Save token for future requests
    authToken = response.data.access_token;
    
    // Store in localStorage for persistence
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userId', response.data.user_id);
    localStorage.setItem('userRole', response.data.role);
    localStorage.setItem('userName', response.data.name);
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (data: RegisterData): Promise<User> => {
  try {
    const response = await api.post('/register', data);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logout = (): void => {
  authToken = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userName');
};

// Initialize auth from localStorage
export const initializeAuth = (): boolean => {
  const token = localStorage.getItem('authToken');
  if (token) {
    authToken = token;
    return true;
  }
  return false;
};

// User Management
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export const createUser = async (userData: Omit<RegisterData, 'id' | 'lastActive'>): Promise<User> => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const toggleUserStatus = async (userId: string): Promise<User> => {
  try {
    const response = await api.patch(`/users/${userId}/status`);
    return response.data;
  } catch (error) {
    console.error('Error toggling user status:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await api.delete(`/users/${userId}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Chat functionalities
export const fetchChatSessions = async (): Promise<ChatSession[]> => {
  try {
    const response = await api.get('/chat/sessions');
    return response.data;
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    throw error;
  }
};

export const fetchChatSession = async (sessionId: string): Promise<ChatSession> => {
  try {
    const response = await api.get(`/chat/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat session:', error);
    throw error;
  }
};

export const createChatSession = async (title: string): Promise<ChatSession> => {
  try {
    const response = await api.post('/chat/sessions', { title });
    return response.data;
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
};

export const sendChatMessage = async (sessionId: string, content: string): Promise<ChatMessage> => {
  try {
    const response = await api.post(`/chat/sessions/${sessionId}/messages`, { content });
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

// Credential management
export const fetchCredentials = async (): Promise<Credential[]> => {
  try {
    const response = await api.get('/credentials');
    return response.data;
  } catch (error) {
    console.error('Error fetching credentials:', error);
    throw error;
  }
};

export const addCredential = async (service: string, details: Record<string, any>): Promise<Credential> => {
  try {
    const response = await api.post('/credentials', { service, details });
    return response.data;
  } catch (error) {
    console.error('Error adding credential:', error);
    throw error;
  }
};

export const deleteCredential = async (credentialId: string): Promise<void> => {
  try {
    await api.delete(`/credentials/${credentialId}`);
  } catch (error) {
    console.error('Error deleting credential:', error);
    throw error;
  }
};

// Admin analytics
export const fetchAnalytics = async (): Promise<AnalyticsData> => {
  try {
    const response = await api.get('/admin/analytics');
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

export default {
  login,
  register,
  logout,
  initializeAuth,
  fetchUsers,
  fetchCurrentUser,
  createUser,
  toggleUserStatus,
  deleteUser,
  fetchChatSessions,
  fetchChatSession,
  createChatSession,
  sendChatMessage,
  fetchCredentials,
  addCredential,
  deleteCredential,
  fetchAnalytics,
};
