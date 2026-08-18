import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
  CalendarCheck2,
  AlertCircle,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginForm } from "../schemas/login.schema";
import { useLogin } from "../hooks/useLogin";
import { useAuthStore } from "@/stores/auth.store";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const loginMutation = useLogin();

  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      employee_code: "",
      password: "",
      remember: true,
    },
  });

  const onSubmit = (values: LoginForm) => {
    setErrorMessage(null);

    loginMutation.mutate(values, {
      onSuccess: (data) => {
        login(data.access_token);

        navigate("/home", {
          replace: true,
        });
      },

      onError: (error: any) => {
        const message =
          error?.response?.data?.detail || "Mã nhân viên hoặc mật khẩu không chính xác";
        setErrorMessage(message);
      },
    });
  };

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-white select-none">
      {/* =====================================================
       * HERO HEADER (Flexible height, centered content)
       * ===================================================== */}
      <section className="relative flex-1 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 px-6 pt-6 pb-12 text-center text-white rounded-b-[36px]">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-sm" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-cyan-300/15 blur-sm" />

        {/* Decorative dots pattern */}
        <div
          className="pointer-events-none absolute right-2 top-4 h-24 w-24 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.7) 1.5px, transparent 1.5px)",
            backgroundSize: "12px 12px",
          }}
        />

        {/* Hero content */}
        <div className="relative flex flex-col items-center">
          {/* App Logo */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg shadow-blue-900/20 ring-4 ring-white/20">
            <CalendarCheck2
              size={36}
              strokeWidth={2.2}
              className="text-blue-600"
            />
          </div>

          <h1 className="mt-3 text-xl font-extrabold tracking-tight text-white drop-shadow-sm">
            Chào mừng trở lại!
          </h1>

          <p className="mt-1 max-w-[260px] text-xs text-white/85 leading-relaxed">
            Đăng nhập để tiếp tục sử dụng hệ thống chấm công
          </p>
        </div>
      </section>

      {/* =====================================================
       * LOGIN FORM CARD (Auto height & w-full)
       * ===================================================== */}
      <section className="relative -mt-8 w-full shrink-0 rounded-t-[32px] bg-white px-6 pt-7 pb-4 z-10 shadow-[0_-8px_30px_rgba(15,23,42,0.08)]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Đăng nhập tài khoản
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Vui lòng nhập thông tin bên dưới để đăng nhập
            </p>
          </div>

          {/* Fields */}
          <div className="space-y-3.5">
            {/* Employee Code */}
            <div>
              <label
                htmlFor="employee_code"
                className="mb-1 block text-xs font-semibold text-slate-700"
              >
                Mã nhân viên
              </label>
              <div className="relative">
                <UserRound
                  size={18}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="employee_code"
                  {...register("employee_code")}
                  type="text"
                  autoComplete="username"
                  placeholder="Nhập mã nhân viên"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              {errors.employee_code && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.employee_code.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-xs font-semibold text-slate-700"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <LockKeyhole
                  size={18}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="password"
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:text-slate-600 active:scale-90"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600 font-medium">
                <input
                  {...register("remember")}
                  type="checkbox"
                  className="h-3.5 w-3.5 cursor-pointer rounded border-slate-300 accent-blue-600"
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          {/* Error Alert Banner */}
          {errorMessage && (
            <div className="flex items-center gap-2.5  py-2.5 text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} className="shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="h-11 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-semibold text-white shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </div>

          {/* Bottom decoration */}
          <div className="relative h-9 w-full overflow-hidden opacity-75 pt-1">
            <div className="absolute -bottom-6 -left-4 h-14 w-[110%] rounded-[50%] bg-blue-50/80" />
            <div className="absolute bottom-0 left-[10%] h-5 w-3.5 rounded-t-sm bg-blue-100/70" />
            <div className="absolute bottom-0 left-[22%] h-8 w-5 rounded-t-sm bg-blue-100/70" />
            <div className="absolute bottom-0 left-[35%] h-6 w-3.5 rounded-t-sm bg-blue-50/70" />
            <div className="absolute bottom-0 left-[48%] h-9 w-6 rounded-t-sm bg-blue-100/70" />
            <div className="absolute bottom-0 left-[64%] h-7 w-4 rounded-t-sm bg-blue-50/70" />
            <div className="absolute bottom-0 left-[76%] h-10 w-5 rounded-t-sm bg-blue-100/70" />
          </div>
        </form>
      </section>
    </div>
  );
}
