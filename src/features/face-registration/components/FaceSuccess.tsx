import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  title?: string;
  description?: string;
  redirectTo?: string;
  buttonText?: string;
}

export default function FaceSuccess({
  title = "Đăng ký thành công",
  description = "Khuôn mặt của bạn đã được đăng ký thành công. Bạn có thể sử dụng chức năng chấm công ngay bây giờ.",
  redirectTo = "/profile",
  buttonText = "Quay về hồ sơ",
}: Props) {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(redirectTo, {
      replace: true,
    });
  };

  return (
    <div className="flex min-h-dvh justify-center bg-white px-6">
      <main className="flex h-full w-full max-w-[400px] flex-col items-center py-5">
        <section className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-26 w-26 items-center justify-center rounded-full bg-emerald-50">
            <div className="flex h-18 w-18 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-500/20">
              <Check size={30} strokeWidth={3} />
            </div>
          </div>

          <h1 className="text-[25px] font-bold tracking-tight text-slate-900">
            {title}
          </h1>

          <p className="max-w-[340px] text-sm leading-6 text-slate-500">
            {description}
          </p>
        </section>

        <button
          type="button"
          onClick={handleRedirect}
          className="
            flex h-12 w-full
            items-center justify-center
            rounded-4xl
            bg-blue-600
            px-5
            text-sm font-semibold text-white
            shadow-sm shadow-blue-600/20
            transition-all
            hover:bg-blue-700
            active:scale-[0.98]
          "
        >
          {buttonText}
        </button>
      </main>
    </div>
  );
}