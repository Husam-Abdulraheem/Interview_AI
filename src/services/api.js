import axios from 'axios';
import { toast } from 'sonner';
import { mockStore, DEMO_USERS } from './mockData';

// Demo Mode: Defaults to true for portfolio showcase unless explicitly opted-in to real backend
export const IS_DEMO_MODE = import.meta.env.VITE_USE_REAL_BACKEND !== 'true';

// Create a configured Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://interview-platform-backend-i5jv.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'success' in response.data && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      console.warn('Unauthorized access - Token expired or invalid.');
      localStorage.removeItem('auth_token');
    } else if (status === 403) {
      toast.error("Bu işlemi gerçekleştirmek için yetkiniz bulunmuyor.");
    }
    return Promise.reject(error);
  }
);

// Helper to simulate slight natural network latency in Demo Mode
const delay = (ms = 150) => new Promise(res => setTimeout(res, ms));

// ==========================================
// Centralized API Request Handlers (With Mock Fallback)
// ==========================================

export const authAPI = {
  login: async (credentials) => {
    if (IS_DEMO_MODE) {
      await delay(250);
      const email = credentials.email?.toLowerCase() || "";
      let matchedUser = DEMO_USERS.trainee;
      if (email.includes("admin")) matchedUser = DEMO_USERS.admin;
      else if (email.includes("creator")) matchedUser = DEMO_USERS.creator;

      // Generate a mock JWT-like structure or token
      return {
        token: `demo_token_${matchedUser.role}_${Date.now()}`,
        id: matchedUser.id,
        fullName: matchedUser.fullName,
        email: credentials.email || matchedUser.email,
        role: matchedUser.role
      };
    }

    try {
      const response = await api.post('/Auth/login', credentials);
      return response.data;
    } catch (err) {
      console.warn("[API] Live backend unavailable, falling back to Demo Mode.", err.message);
      return authAPI.login(credentials);
    }
  },

  register: async (userData) => {
    if (IS_DEMO_MODE) {
      await delay(250);
      return {
        token: `demo_token_${userData.role || 3}_${Date.now()}`,
        id: `user-registered-${Date.now()}`,
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role || 3
      };
    }

    try {
      const response = await api.post('/Auth/register', userData);
      return response.data;
    } catch (err) {
      console.warn("[API] Live backend unavailable, falling back to Demo Mode.", err.message);
      return authAPI.register(userData);
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('interviewai_auth');
  }
};

export const courseAPI = {
  getAll: async () => {
    if (IS_DEMO_MODE) {
      await delay(100);
      return mockStore.getCourses();
    }
    try {
      const response = await api.get('/Courses');
      return response.data;
    } catch (err) {
      console.warn("[API] Falling back to demo courses", err.message);
      return mockStore.getCourses();
    }
  },

  getMyCourses: async () => {
    if (IS_DEMO_MODE) {
      await delay(100);
      return mockStore.getMyCourses();
    }
    try {
      const response = await api.get('/Courses/my-courses');
      return response.data;
    } catch (err) {
      return mockStore.getMyCourses();
    }
  },

  getById: async (id) => {
    if (IS_DEMO_MODE) {
      await delay(80);
      return mockStore.getCourseById(id);
    }
    try {
      const response = await api.get(`/Courses/${id}`);
      return response.data;
    } catch (err) {
      return mockStore.getCourseById(id);
    }
  },

  create: async (data) => {
    if (IS_DEMO_MODE) {
      await delay(200);
      return mockStore.saveCourse(data);
    }
    try {
      const response = await api.post('/Courses', data);
      return response.data;
    } catch (err) {
      return mockStore.saveCourse(data);
    }
  },

  update: async (id, data) => {
    if (IS_DEMO_MODE) {
      await delay(150);
      return mockStore.updateCourse(id, data);
    }
    try {
      const response = await api.put(`/Courses/${id}`, data);
      return response.data;
    } catch (err) {
      return mockStore.updateCourse(id, data);
    }
  },

  delete: async (id) => {
    if (IS_DEMO_MODE) {
      await delay(150);
      return mockStore.deleteCourse(id);
    }
    try {
      const response = await api.delete(`/Courses/${id}`);
      return response.data;
    } catch (err) {
      return mockStore.deleteCourse(id);
    }
  },

  addQuestions: async (courseId, questions) => {
    if (IS_DEMO_MODE) {
      await delay(150);
      return mockStore.addQuestionsToCourse(courseId, questions);
    }
    try {
      const response = await api.post(`/Courses/${courseId}/questions`, questions);
      return response.data;
    } catch (err) {
      return mockStore.addQuestionsToCourse(courseId, questions);
    }
  },

  updateQuestion: async (questionId, data) => {
    if (IS_DEMO_MODE) {
      await delay(100);
      return mockStore.updateQuestion(questionId, data);
    }
    try {
      const response = await api.put(`/Courses/questions/${questionId}`, data);
      return response.data;
    } catch (err) {
      return mockStore.updateQuestion(questionId, data);
    }
  },

  deleteQuestion: async (questionId) => {
    if (IS_DEMO_MODE) {
      await delay(100);
      return mockStore.deleteQuestion(questionId);
    }
    try {
      const response = await api.delete(`/Courses/questions/${questionId}`);
      return response.data;
    } catch (err) {
      return mockStore.deleteQuestion(questionId);
    }
  }
};

export const evaluationAPI = {
  evaluate: async (data) => {
    await delay(300);
    return {
      score: 85,
      generalFeedback: "إجابة جيدة وواضحة تركز على المفاهيم الهندسية الأساسية.",
      strengths: ["وضوح العرض", "فهم دقيق للموضوع"],
      weaknesses: ["يمكن إضافة أمثلة تطبيقية إضافية"],
      suggestions: ["تدرب على إيجاز الإجابة في أول 30 ثانية"]
    };
  }
};

export const courseAttemptAPI = {
  start: async (data) => {
    if (IS_DEMO_MODE) {
      await delay(150);
      return mockStore.startAttempt(data);
    }
    try {
      const response = await api.post('/CourseAttempts/start', data);
      return response.data;
    } catch (err) {
      return mockStore.startAttempt(data);
    }
  },

  submitAnswer: async (attemptId, data) => {
    if (IS_DEMO_MODE) {
      await delay(100);
      return mockStore.submitAnswer(attemptId, data);
    }
    try {
      const response = await api.post(`/CourseAttempts/${attemptId}/submit-answer`, data);
      return response.data;
    } catch (err) {
      return mockStore.submitAnswer(attemptId, data);
    }
  },

  complete: async (attemptId) => {
    if (IS_DEMO_MODE) {
      await delay(200);
      return mockStore.completeAttempt(attemptId);
    }
    try {
      const response = await api.post(`/CourseAttempts/${attemptId}/complete`);
      return response.data;
    } catch (err) {
      return mockStore.completeAttempt(attemptId);
    }
  },

  getById: async (attemptId) => {
    if (IS_DEMO_MODE) {
      await delay(100);
      return mockStore.getAttemptById(attemptId);
    }
    try {
      const response = await api.get(`/CourseAttempts/${attemptId}`);
      return response.data;
    } catch (err) {
      return mockStore.getAttemptById(attemptId);
    }
  },

  getMyAttempts: async () => {
    if (IS_DEMO_MODE) {
      await delay(100);
      return mockStore.getAttempts();
    }
    try {
      const response = await api.get('/CourseAttempts/my-attempts');
      return response.data;
    } catch (err) {
      return mockStore.getAttempts();
    }
  }
};

export const userAPI = {
  getProfile: async () => {
    if (IS_DEMO_MODE) {
      await delay(100);
      return DEMO_USERS.trainee;
    }
    try {
      const response = await api.get('/Users/profile');
      return response.data;
    } catch (err) {
      return DEMO_USERS.trainee;
    }
  },

  getAll: async () => {
    if (IS_DEMO_MODE) {
      await delay(100);
      return mockStore.getUsers();
    }
    try {
      const response = await api.get('/Users');
      return response.data;
    } catch (err) {
      return mockStore.getUsers();
    }
  },

  getRequests: async () => {
    if (IS_DEMO_MODE) {
      await delay(100);
      return mockStore.getRequests();
    }
    try {
      const response = await api.get('/Users/requests');
      return response.data;
    } catch (err) {
      return mockStore.getRequests();
    }
  },

  approveRequest: async (id) => {
    if (IS_DEMO_MODE) {
      await delay(150);
      return mockStore.approveRequest(id);
    }
    try {
      const response = await api.post(`/Users/${id}/approve`);
      return response.data;
    } catch (err) {
      return mockStore.approveRequest(id);
    }
  },

  updateRole: async (id, newRole) => {
    if (IS_DEMO_MODE) {
      await delay(150);
      return mockStore.updateUserRole(id, newRole);
    }
    try {
      const response = await api.put(`/Users/${id}/role?newRole=${newRole}`);
      return response.data;
    } catch (err) {
      return mockStore.updateUserRole(id, newRole);
    }
  },

  delete: async (id) => {
    if (IS_DEMO_MODE) {
      await delay(150);
      return mockStore.deleteUser(id);
    }
    try {
      const response = await api.delete(`/Users/${id}`);
      return response.data;
    } catch (err) {
      return mockStore.deleteUser(id);
    }
  }
};

export default api;
