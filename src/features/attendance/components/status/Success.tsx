import { CheckCircle2, ScanFace } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className="flex h-dvh flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
        <CheckCircle2 size={44} strokeWidth={2.5} />
      </div>

      <h1 className="mt-6 text-2xl font-bold text-slate-800">
        Chấm công thành công!
      </h1>

      <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
        Thông tin chấm công của bạn đã được ghi nhận trên hệ thống.
      </p>

      <button
        type="button"
        onClick={() => navigate("/attendance")}
        className="
          mt-8
          flex items-center justify-center gap-2
          rounded-2xl
          bg-blue-500
          px-8 py-3.5
          text-sm font-semibold text-white
          transition
          hover:bg-blue-600
          active:scale-95
        "
      >
        <ScanFace size={18} />
        Trở về
      </button>
    </div>
  );
}