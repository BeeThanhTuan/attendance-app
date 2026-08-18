import { refreshTokenApi } from "@/lib/api/auth.api";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";


export default function ProtectedRoute() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      const accessToken = localStorage.getItem("access_token");

      // -----------------------------------------
      // 1. Đã có access token
      // -----------------------------------------
      if (accessToken) {
        setAuthenticated(true);
        setChecking(false);
        return;
      }

      // -----------------------------------------
      // 2. Không có access token
      //    → thử dùng HttpOnly refresh cookie
      // -----------------------------------------
      try {
        const data = await refreshTokenApi();

        useAuthStore.getState().login(data.access_token);
        setAuthenticated(true);
      } catch {
        useAuthStore.getState().logout();
        setAuthenticated(false);
      } finally {
        setChecking(false);
      }
    };

    restoreSession();
  }, []);

  // -----------------------------------------
  // Đang kiểm tra session
  // -----------------------------------------
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-sm text-slate-500">
          Đang kiểm tra phiên đăng nhập...
        </div>
      </div>
    );
  }

  // -----------------------------------------
  // Không đăng nhập được
  // -----------------------------------------
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // -----------------------------------------
  // Đã đăng nhập
  // -----------------------------------------
  return <Outlet />;
}