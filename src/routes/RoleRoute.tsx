import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useProfile } from "@/features/profile/hooks/useProfile";
import type { Role } from "@/shared/types/role";

interface RoleRouteProps {
  allowedRoles: Role[];
}

export default function RoleRoute({
  allowedRoles,
}: RoleRouteProps) {
  const location = useLocation();

  const {
    data: profile,
    isPending,
    error,
  } = useProfile();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error || !profile) {
    return <Navigate to="/home" replace />;
  }

  if (!allowedRoles.includes(profile.role as Role)) {
    return (
      <Navigate
        to="/home"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}