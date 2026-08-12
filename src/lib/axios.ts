import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post("/auth/refresh");

        localStorage.setItem(
          "access_token",
          data.access_token,
        );

        originalRequest.headers.Authorization =
          `Bearer ${data.access_token}`;

        return api(originalRequest);
      } catch {
        localStorage.removeItem("access_token");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);