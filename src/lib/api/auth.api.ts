import { api } from "../axios";

import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from "@/features/auth/types/auth.types";

/* ========================================
 * Login
 * ======================================== */

export const loginApi = async (
  payload: LoginRequest,
): Promise<LoginResponse> => {
  const formData = new URLSearchParams();

  formData.append("username", payload.employee_code);
  formData.append("password", payload.password);

  const { data } = await api.post<LoginResponse>("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  // Chỉ lưu Access Token
  localStorage.setItem("access_token", data.access_token);

  return data;
};

/* ========================================
 * Refresh
 * ======================================== */

export const refreshTokenApi = async (): Promise<RefreshTokenResponse> => {
  // Refresh Token nằm trong HttpOnly Cookie
  const { data } = await api.post<RefreshTokenResponse>("/auth/refresh");

  localStorage.setItem("access_token", data.access_token);

  return data;
};

/* ========================================
 * Logout
 * ======================================== */

export const logoutApi = async () => {
  // Backend sẽ tự lấy Cookie và xóa nó
  await api.post("/auth/logout");

  localStorage.removeItem("access_token");
};
