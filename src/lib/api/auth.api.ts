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
  formData.append("remember", String(payload.remember ?? true));

  const { data } = await api.post<LoginResponse>(
    "/auth/login",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  // Chỉ lưu Access Token
  //
  // Refresh Token:
  // - không được lưu localStorage
  // - Backend lưu trong HttpOnly Cookie
  localStorage.setItem(
    "access_token",
    data.access_token,
  );

  return data;
};


/* ========================================
 * Refresh
 * ======================================== */

export const refreshTokenApi =
  async (): Promise<RefreshTokenResponse> => {
    // Refresh Token nằm trong HttpOnly Cookie.
    //
    // withCredentials: true trong axios
    // sẽ tự động gửi Cookie lên Backend.

    const { data } =
      await api.post<RefreshTokenResponse>(
        "/auth/refresh",
      );

    localStorage.setItem(
      "access_token",
      data.access_token,
    );

    return data;
  };


/* ========================================
 * Logout
 * ======================================== */

export const logoutApi = async (): Promise<void> => {
  try {
    // Backend:
    // 1. lấy refresh_token từ Cookie
    // 2. revoke token
    // 3. delete Cookie

    await api.post("/auth/logout");
  } finally {
    // Dù API logout có lỗi thì
    // FE vẫn phải xóa access token.
    localStorage.removeItem("access_token");
  }
};