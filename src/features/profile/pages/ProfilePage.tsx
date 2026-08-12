import Header from "@/shared/components/Header";
import { User, Hash, Building2, Clock, ScanFace, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import { useAuthStore } from "@/stores/auth.store";
import avatar from "@/assets/avatar-placeholder.png";
export default function ProfilePage() {
  const navigate = useNavigate();

  const logout = useAuthStore((s) => s.logout);
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">Đang tải...</div>
    );
  }

  if (!profile) return null;

  const infoRows = [
    {
      icon: User,
      label: "Họ và tên",
      value: profile.full_name,
    },
    {
      icon: Hash,
      label: "Mã nhân viên",
      value: profile.employee_code,
    },
    {
      icon: Building2,
      label: "Bộ phận",
      value: profile.department,
    },
    {
      icon: Clock,
      label: "Ca làm việc",
      value: `${profile.work_shift.name} (${profile.work_shift.start_time.slice(
        0,
        5,
      )} - ${profile.work_shift.end_time.slice(0, 5)})`,
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <Header title="Hồ sơ" showBack={false} />
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-md bg-white px-5 pb-24 pt-5">
          {/* Avatar */}
          <div className="flex flex-col items-center pb-4">
            <img
              src={profile?.face.avatar_url ?? avatar}
              className="size-24 rounded-full border-3 border-slate-200 object-cover"
            />

            <h2 className="mt-3 text-lg font-bold text-slate-800">
              {profile.full_name}
            </h2>

            <p className="mt-1 rounded-full bg-[#F3F0FF] px-3 py-1 text-[11px] font-semibold text-[#302b62]">
              {profile.employee_code}
            </p>
          </div>

          {/* Information (scroll only) */}
          <div className="flex min-h-0 flex-1 flex-col">
            <h3 className="mb-2 ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Thông tin cá nhân
            </h3>

            <div className="flex-1 overflow-y-auto rounded-2xl bg-white  ring-1 ring-slate-100">
              {infoRows.map(({ icon: Icon, label, value }, index) => (
                <div
                  key={label}
                  className={`flex items-center gap-3 px-4 py-3 ${index !== infoRows.length - 1
                    ? "border-b border-slate-100"
                    : ""
                    }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F3F0FF]">
                    <Icon size={16} className="text-[#302b62]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-slate-400">{label}</p>

                    <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action */}
          <div className="pt-4">
            <h3 className="mb-2 ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Hành động
            </h3>

            <div className="space-y-2.5">
              {profile.face.registered ? (
                <button onClick={() => navigate("/face-reregistration")}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-4xl bg-emerald-600 text-sm font-semibold text-white">
                  <ScanFace size={18} />
                  Đăng ký lại khuôn mặt
                </button>
              ) : (
                <button
                  onClick={() => navigate("/face-registration")}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-4xl bg-blue-500 text-sm font-semibold text-white "
                >
                  <ScanFace size={18} />
                  Đăng ký khuôn mặt
                </button>
              )}

              <button
                onClick={() => {
                  logout();
                  navigate("/login", {
                    replace: true,
                  });
                }}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-4xl border border-red-200 bg-white text-sm font-semibold text-red-500"
              >
                <LogOut size={17} />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
