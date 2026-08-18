import { createBrowserRouter, Navigate } from "react-router-dom";

import MobileLayout from "@/layouts/MobileLayout";

import ProtectedRoute from "@/routes/ProtectedRoute";
import FaceRegisteredRoute from "@/routes/FaceRegisteredRoute";
import FaceNotRegisteredRoute from "@/routes/FaceNotRegisteredRoute";
import RoleRoute from "@/routes/RoleRoute";
import { ROLE } from "@/shared/types/role";

import HomePage from "@/features/home/pages/HomePage";
import AttendancePage from "@/features/attendance/pages/AttendancePage";
import CheckinPage from "@/features/attendance/pages/CheckinPage";
import CheckoutPage from "@/features/attendance/pages/CheckoutPage";


import HistoryPage from "@/features/history/pages/HistoryPage";
import AttendanceDetailPage from "@/features/history/pages/AttendanceDetailPage";

import ProfilePage from "@/features/profile/pages/ProfilePage";

import FaceRegistrationPage from "@/features/face-registration/pages/FaceRegistrationPage";
import FaceReRegistrationPage from "@/features/face-registration/pages/FaceReRegistrationPage";
import FaceRequiredPage from "@/features/face-registration/pages/FaceRequiredPage";

import LoginPage from "@/features/auth/pages/LoginPage";
import AttendanceConfirmationPage from "@/features/attendance-confirmation/pages/AttendanceConfirmationPage";
import AttendanceConfirmationDetailPage from "@/features/attendance-confirmation/pages/AttendanceConfirmationDetailPage";

export const router = createBrowserRouter([
  {
    element: <MobileLayout />,
    children: [
      // =====================================================
      // LOGIN
      // =====================================================

      {
        path: "/login",
        element: <LoginPage />,
      },

      // =====================================================
      // PROTECTED
      // =====================================================

      {
        element: <ProtectedRoute />,
        children: [
          // -------------------------------------------------
          // DEFAULT
          // -------------------------------------------------

          {
            index: true,
            element: <Navigate to="/home" replace />,
          },

          // -------------------------------------------------
          // HOME
          // -------------------------------------------------

          {
            path: "/home",
            element: <HomePage />,
          },

          // -------------------------------------------------
          // PROFILE
          // -------------------------------------------------

          {
            path: "/profile",
            element: <ProfilePage />,
          },

          {
              element: (
                <RoleRoute
                  allowedRoles={[ROLE.ADMIN, ROLE.MANAGER]}
                />
              ),
              children: [
                {
                  path: "/attendance-confirmation",
                  element: <AttendanceConfirmationPage />,
                },
                {
                  path: "/attendance-confirmation/:employeeId",
                  element: <AttendanceConfirmationDetailPage />,
                },
              ],
            },

          // =================================================
          // FACE NOT REGISTERED
          // =================================================

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

          // =================================================
          // FACE REGISTERED
          // =================================================

          {
            element: <FaceRegisteredRoute />,
            children: [
              // ---------------------------------------------
              // FACE RE-REGISTRATION
              // ---------------------------------------------

              {
                path: "/face-reregistration",
                element: <FaceReRegistrationPage />,
              },

              // ---------------------------------------------
              // ATTENDANCE
              // ---------------------------------------------

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

              // ---------------------------------------------
              // HISTORY
              // ---------------------------------------------

              {
                path: "/history",
                element: <HistoryPage />,
              },

              {
                path: "/history/:date",
                element: <AttendanceDetailPage />,
              },

              // =================================================
              // ATTENDANCE CONFIRMATION
              // Chỉ ADMIN + MANAGER
              // =================================================

            ],
            
          },
        ],
      },
    ],
  },
]);