import { Navigate, Outlet } from "react-router-dom";

import { useProfile } from "@/features/profile/hooks/useProfile";

export default function FaceRegisteredRoute() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile?.face.registered) {
    return <Navigate to="/face-required" replace />;
  }

  return <Outlet />;
}