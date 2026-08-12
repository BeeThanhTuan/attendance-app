import { Clock, MapPin, ArrowLeft, Check, Loader2, ScanFace } from "lucide-react";
import type { Locations } from "../../types/location.types";

interface Props {
  mode: "check-in" | "check-out";
  location: Locations | null;
  latitude: number | null;
  longitude: number | null;
  faceImage?: string | null;
  isSubmitting?: boolean;
  error?: string | null;
  onBack: () => void;
  onSubmit: () => void | Promise<void>;
}

export default function ConfirmStep({
  mode,
  location,
  faceImage,
  isSubmitting = false,
  error = null,
  onBack,
  onSubmit,
}: Props) {
  const now = new Date();

  const timeString = now.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateString = now.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const isCheckIn = mode === "check-in";

  return (
    <div className="flex h-full flex-col justify-between overflow-y-auto">
      <div>
        <div className="mb-4 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-blue-100">
            <Check className="size-8 text-blue-600" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-slate-800">
            Xác nhận {isCheckIn ? "chấm công vào" : "chấm công ra"}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Vui lòng kiểm tra lại thông tin trước khi xác nhận.
          </p>
        </div>

        <div className="space-y-4 rounded-2xl bg-white p-5 border-slate">
          {/* Thời gian */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">

              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <Clock size={18} className="text-primary" />
              </div>
              
              <span className="text-sm font-semibold text-slate-700">Thời gian</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{timeString}</span>
              <span className="text-slate-300">•</span>
              <span className="text-sm text-slate-500">{dateString}</span>
            </div>
          </div>

          {/* Vị trí */}
          {location && (
            <div className="flex gap-3 border-b border-slate-100 pb-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <MapPin size={18} className="text-primary" />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-sm">
                  {location.location_name}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{location.address}</p>
              </div>
            </div>
          )}

          {/* Ảnh đã chụp */}
          {faceImage && (
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <ScanFace size={18} className="text-primary" />
              </div>

              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Ảnh khuôn mặt</p>
                </div>
                <img
                  src={faceImage}
                  alt="Face preview"
                  className="size-12 rounded-xl object-cover border border-slate-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Thông báo lỗi từ BE nếu có */}
        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 p-4 text-xs font-medium text-red-600 border border-red-200">
            ⚠️ {error}
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex h-12 w-12 items-center justify-center rounded-full border-slate bg-white transition active:scale-95 disabled:opacity-50"
        >
          <ArrowLeft size={18} />
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex flex-1 items-center justify-center gap-2 rounded-4xl bg-blue-600 hover:bg-blue-700 py-3 text-sm font-semibold text-white  transition active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Đang chấm công...
            </>
          ) : (
            `Xác nhận chấm công`
          )}
        </button>
      </div>
    </div>
  );
}