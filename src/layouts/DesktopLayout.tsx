import { Outlet } from "react-router-dom";

export default function DesktopLayout() {
  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-800 flex flex-col">
      {/* Desktop Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
