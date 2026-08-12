import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock, ScanFace } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginForm } from "../schemas/login.schema";

import { useLogin } from "../hooks/useLogin";
import { useAuthStore } from "@/stores/auth.store";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
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
    },
  });

  const onSubmit = (values: LoginForm) => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        login(data.access_token);

        navigate("/home", {
          replace: true,
        });
      },

      onError: (error) => {
        alert("Sai tài khoản hoặc mật khẩu");
      },
    });
  };
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-1 flex-col items-center justify-center p-5 text-white">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
          <ScanFace size={52} strokeWidth={2.2} />
        </div>
        <h1 className="text-3xl font-bold tracking-wide">Attendance Online</h1>
        <p className="mt-2 text-center text-sm text-white/70">
          Face Recognition Attendance System
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full space-y-5 bg-white rounded-t-2xl p-5 pb-15"
      >
        {/* Employee Code */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Mã nhân viên
          </label>

          <div className="relative">
            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              {...register("employee_code")}
              type="text"
              placeholder="Ví dụ: IT25015"
              className="
              h-12
              w-full
              rounded-2xl
              border
              border-slate-300
              bg-white
              pl-11
              pr-4
              outline-none
              transition
              focus:border-[#272450]
              focus:ring-4
              focus:ring-[#5E56E8]/5
            "
            />
          </div>
        </div>
        {errors.employee_code && (
          <p className="mt-1 text-sm text-red-500">
            {errors.employee_code.message}
          </p>
        )}

        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Mật khẩu
          </label>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="
              h-12
              w-full
              rounded-2xl
              border
              border-slate-300
              bg-white
              pl-11
              pr-12
              outline-none
              transition
              focus:border-[#272450]
              focus:ring-4
              focus:ring-[#5E56E8]/5
            "
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}

        {/* Remember */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              className="
                h-4 w-4
                rounded accent-[#312d85]
                cursor-pointer
              "
            />
            Ghi nhớ đăng nhập
          </label>

          <Link
            to="/forgot-password"
            className="text-sm font-medium text-[#302b62]"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Login */}
        <button
          type="submit"
          className="mt-5
          h-12
          w-full
          rounded-2xl
          bg-gradient-to-r from-[#302b62] via-[#4b409d] to-[#5448b7]
          font-semibold
          text-white
          transition
        "
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
