import axios from "axios";

let API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://hrms-site.onrender.com"
    : "http://localhost:8000";

// Sanitize common misconfigurations
if (API_BASE_URL.startsWith(":")) {
  API_BASE_URL = `http://localhost${API_BASE_URL}`;
} else if (API_BASE_URL.startsWith("//")) {
  API_BASE_URL = `http:${API_BASE_URL}`;
} else if (!/^https?:\/\//i.test(API_BASE_URL)) {
  if (/^[\w.-]+:\d+$/i.test(API_BASE_URL)) {
    API_BASE_URL = `http://${API_BASE_URL}`;
  }
}

// Remove trailing slash
API_BASE_URL = API_BASE_URL.replace(/\/$/, "");

export { API_BASE_URL };

// Simple cache implementation
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (url, params) => `${url}?${JSON.stringify(params || {})}`;
const isCacheValid = (timestamp) => Date.now() - timestamp < CACHE_DURATION;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {},
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for caching
api.interceptors.request.use(
  (config) => {
    // Ensure correct Content-Type
    // - For FormData: let Axios set multipart/form-data with boundary
    // - For JSON: use application/json
    const isFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;
    if (isFormData) {
      if (config.headers) {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
      }
    } else {
      config.headers = config.headers || {};
      if (!config.headers["Content-Type"] && !config.headers["content-type"]) {
        config.headers["Content-Type"] = "application/json";
      }
    }

    // Skip caching for POST, PUT, DELETE requests
    if (config.method?.toLowerCase() !== 'get') {
      return config;
    }
    
    const cacheKey = getCacheKey(config.url, config.params);
    const cached = cache.get(cacheKey);
    
    if (cached && isCacheValid(cached.timestamp)) {
      // Return cached data as adapter
      config.adapter = () => Promise.resolve({
        data: cached.data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        fromCache: true,
      });
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling and caching
api.interceptors.response.use(
  (response) => {
    // Cache GET requests
    if (response.config.method?.toLowerCase() === 'get' && !response.fromCache) {
      const cacheKey = getCacheKey(response.config.url, response.config.params);
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
    }
    
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error("Network Error:", error.request);
    } else {
      // Error setting up request
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Employee APIs
export const employeeAPI = {
  create: (data) => {
    // Clear cache after creating employee
    return api.post("/api/employees", data).finally(() => {
      cache.clear();
    });
  },
  list: (skip = 0, limit = 100) =>
    api.get("/api/employees", { params: { skip, limit } }),
  get: (employeeId) => api.get(`/api/employees/${employeeId}`),
  delete: (employeeId) => {
    // Clear cache after deleting employee
    return api.delete(`/api/employees/${employeeId}`).finally(() => {
      cache.clear();
    });
  },
};

// Attendance APIs
export const attendanceAPI = {
  mark: (data) => {
    // Clear cache after marking attendance
    return api.post("/api/attendance", data).finally(() => {
      cache.clear();
    });
  },
  getByEmployee: (employeeId, startDate = null, endDate = null) =>
    api.get(`/api/attendance/employee/${employeeId}`, {
      params: { start_date: startDate, end_date: endDate },
    }),
  list: () => api.get("/api/attendance"),
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get("/api/dashboard/stats"),
};

// Health Check API
export const healthAPI = {
  check: () => api.get("/api/health"),
};

// Cache utilities
export const cacheUtils = {
  clear: () => cache.clear(),
  size: () => cache.size,
  clearExpired: () => {
    const now = Date.now();
    for (const [key, value] of cache.entries()) {
      if (!isCacheValid(value.timestamp)) {
        cache.delete(key);
      }
    }
  },
};

export default api;
