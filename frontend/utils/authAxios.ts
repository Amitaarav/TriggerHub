import axios from "axios";

const authAxios = axios.create();

console.log("============== AUTH AXIOS ================")

// Request interceptor to attach JWT token
authAxios.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      console.log("[Auth Debug]", {
        url: config.url,
        hasToken: Boolean(token)
      })
      
      if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth expiration
authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn("[Auth Response Error]", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message ?? error.response?.data?.error,
    });

    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      const currentPath = window.location.pathname;
      const isPublicPath =
        currentPath === "/" ||
        currentPath.startsWith("/login") ||
        currentPath.startsWith("/signup");

      if (!isPublicPath) {
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default authAxios;