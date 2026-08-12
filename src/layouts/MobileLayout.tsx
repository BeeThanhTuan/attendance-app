import { Outlet, useLocation } from "react-router-dom";
import BottomNavigation from "@/shared/components/BottomNavigation";

const HIDE_NAVIGATION_ROUTES = ["/attendance/check-in", "/attendance/check-out", "/face-registration", "/face-reregistration", "/face-required", "/login"];

export default function MobileLayout() {
  const location = useLocation();
  const isHistoryDetail = location.pathname.startsWith("/history/") && location.pathname !== "/history";
  const shouldHideNavigation = HIDE_NAVIGATION_ROUTES.includes(location.pathname) || isHistoryDetail;

  return (
    <div className="mx-auto h-dvh w-full max-w-[430px] bg-white relative overflow-hidden">
      <main className="flex h-full flex-col">
        <Outlet />
      </main>

      {!shouldHideNavigation && <BottomNavigation />}
    </div>
  );
}