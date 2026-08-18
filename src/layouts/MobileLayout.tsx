import { Outlet, useLocation } from "react-router-dom";
import BottomNavigation from "@/shared/components/BottomNavigation";
import PWAInstallBanner from "@/shared/components/PWAInstallBanner";

const HIDE_NAVIGATION_ROUTES = [
  "/attendance/check-in",
  "/attendance/check-out",
  "/face-registration",
  "/face-reregistration",
  "/face-required",
  "/login",
];

export default function MobileLayout() {
  const location = useLocation();

  const isHistoryDetail =
    location.pathname.startsWith("/history/") &&
    location.pathname !== "/history";

  const isAttendanceConfirmationDetail =
    location.pathname.startsWith("/attendance-confirmation/");

  const shouldHideNavigation =
    HIDE_NAVIGATION_ROUTES.includes(location.pathname) ||
    isHistoryDetail ||
    isAttendanceConfirmationDetail;

  return (
    <div className="relative mx-auto h-dvh w-full max-w-[430px] overflow-hidden bg-white">
      <main className="flex h-full flex-col">
        <Outlet />
      </main>

      {!shouldHideNavigation && <BottomNavigation />}
      <PWAInstallBanner />
    </div>
  );
}