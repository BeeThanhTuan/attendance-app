import { ScanFace, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FaceRequiredPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh items-center justify-center bg-white px-6 animate-slide-up-ios">
      <main className="w-full max-w-[400px] text-center">
        {/* =====================================================
            FACE ICON
        ====================================================== */}

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
          <ScanFace
            size={38}
            strokeWidth={1.8}
            className="text-blue-600"
          />
        </div>

        {/* =====================================================
            TITLE
        ====================================================== */}

        <h1 className="mt-7 text-[25px] font-bold tracking-tight text-slate-900">
          Đăng ký khuôn mặt
        </h1>

        <p className="mx-auto mt-3 max-w-[350px] text-sm leading-6 text-slate-500">
          Bạn chưa đăng ký khuôn mặt. Hãy hoàn tất đăng ký để sử dụng
          chức năng chấm công và xem lịch sử chấm công.
        </p>

        {/* =====================================================
            MAIN ACTION
        ====================================================== */}

        <button
          type="button"
          onClick={() => navigate("/face-registration")}
          className="
            mt-8
            flex h-12 w-full
            items-center justify-center gap-3
            rounded-4xl
            bg-blue-600
            px-5
            text-sm font-bold text-white
            shadow-sm shadow-blue-600/20
            transition-all
            hover:bg-blue-700
            active:scale-[0.98]
          "
        >
          <ScanFace size={20} strokeWidth={2.2} />

          <span>Đăng ký khuôn mặt</span>
        </button>

        {/* =====================================================
            BACK
        ====================================================== */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="
            mt-4
            inline-flex h-10
            items-center justify-center
            px-4
            text-sm font-semibold
            text-slate-500
            transition-colors
            hover:text-slate-700
            active:text-slate-900
            underline
          "
        >
          Quay lại
        </button>

        {/* =====================================================
            NOTE
        ====================================================== */}

        <div className="mt-7 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-400">
          <LockKeyhole size={13} strokeWidth={1.8} />
          <span>Bạn chỉ cần đăng ký khuôn mặt một lần.</span>
        </div>
      </main>
    </div>
  );
}