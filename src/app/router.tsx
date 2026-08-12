import { createBrowserRouter, Navigate } from "react-router-dom";

import MobileLayout from "@/layouts/MobileLayout";

import ProtectedRoute from "@/routes/ProtectedRoute";
import FaceRegisteredRoute from "@/routes/FaceRegisteredRoute";

import HomePage from "@/features/home/pages/HomePage";
import AttendancePage from "@/features/attendance/pages/AttendancePage";
import CheckinPage from "@/features/attendance/pages/CheckinPage";
import CheckoutPage from "@/features/attendance/pages/CheckoutPage";
import HistoryPage from "@/features/history/pages/HistoryPage";
import AttendanceDetailPage from "@/features/history/pages/AttendanceDetailPage";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import FaceRegistrationPage from "@/features/face-registration/pages/FaceRegistrationPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import FaceRequiredPage from "@/features/face-registration/pages/FaceRequiredPage";
import FaceNotRegisteredRoute from "@/routes/FaceNotRegisteredRoute";
import FaceReRegistrationPage from "@/features/face-registration/pages/FaceReRegistrationPage";

export const router = createBrowserRouter([
  {
    element: <MobileLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Navigate to="/home" replace />,
          },

          {
            path: "/home",
            element: <HomePage />,
          },

          {
            path: "/profile",
            element: <ProfilePage />,
          },

          // Chỉ cho người CHƯA đăng ký khuôn mặt
          {
            element: <FaceNotRegisteredRoute />,
            children: [
              {
                path: "/face-required",
                element: <FaceRequiredPage />,
              },
              {
                path: "/face-registration",
                element: <FaceRegistrationPage />,
              },
            ],
          },

          // Chỉ cho người ĐÃ đăng ký khuôn mặt
          {
            element: <FaceRegisteredRoute />,
            children: [
              {
                path: "/face-reregistration",
                element: <FaceReRegistrationPage />,
              },
              {
                path: "/attendance",
                element: <AttendancePage />,
              },
              {
                path: "/attendance/check-in",
                element: <CheckinPage />,
              },
              {
                path: "/attendance/check-out",
                element: <CheckoutPage />,
              },
              {
                path: "/history",
                element: <HistoryPage />,
              },
              {
                path: "/history/:date",
                element: <AttendanceDetailPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
