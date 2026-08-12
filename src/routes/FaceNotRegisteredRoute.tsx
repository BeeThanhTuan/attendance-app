import { Navigate, Outlet } from "react-router-dom";

import { useProfile } from "@/features/profile/hooks/useProfile";

export default function FaceNotRegisteredRoute() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return null;
  }

  if (profile?.face.registered) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}