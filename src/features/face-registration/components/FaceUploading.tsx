import {
  Loader2,
  XCircle,
  RefreshCw,
  ScanFace,
} from "lucide-react";

interface CapturedFrame {
  index: number;
  image: string;
}

interface Props {
  images: CapturedFrame[];

  status: "uploading" | "error";

  error?: string | null;

  onRetry: () => void;
}

const REQUIRED_FRAMES = 3;

export default function FaceUploading({
  images,
  status,
  error,
  onRetry,
}: Props) {
  const sortedImages = [...images].sort(
    (a, b) => a.index - b.index,
  );

  const uploadedCount = sortedImages.length;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-white px-6">
      <main className="flex w-full max-w-[400px] flex-col items-center text-center">
        {/* =====================================================
            PREVIEW
        ====================================================== */}

        <div className="w-full">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">
              Dữ liệu khuôn mặt
            </p>

            <p className="text-xs font-semibold text-slate-400">
              {uploadedCount}/{REQUIRED_FRAMES}
            </p>
          </div>

          <div className="flex justify-center gap-3">
            {Array.from(
              { length: REQUIRED_FRAMES },
              (_, index) => {
                const frameIndex = index + 1;

                const image = sortedImages.find(
                  (item) =>
                    item.index === frameIndex,
                );

                return (
                  <div
                    key={frameIndex}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div
                      className={`
                        relative
                        h-[70px] w-[70px]
                        overflow-hidden
                        rounded-xl
                        bg-slate-100
                        ring-1
                        transition-all
                        ${
                          image
                            ? "ring-slate-200"
                            : "ring-slate-100"
                        }
                      `}
                    >
                      {image ? (
                        <img
                          src={image.image}
                          alt={`Frame ${frameIndex}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ScanFace
                            size={22}
                            strokeWidth={1.7}
                            className="text-slate-300"
                          />
                        </div>
                      )}
                    </div>

                    <span className="text-[9px] font-semibold text-slate-400">
                      Frame {frameIndex}
                    </span>
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* =====================================================
            UPLOADING
        ====================================================== */}

        {status === "uploading" && (
          <section className="mt-14 flex w-full flex-col items-center">
            <div
              className="
                flex h-20 w-20
                items-center justify-center
                rounded-full
                bg-blue-50
              "
            >
              <Loader2
                size={36}
                strokeWidth={2}
                className="animate-spin text-blue-600"
              />
            </div>

            <h1 className="mt-7 text-[24px] font-extrabold tracking-tight text-slate-900">
              Đang đăng ký khuôn mặt
            </h1>

            <p className="mt-3 max-w-[340px] text-sm leading-6 text-slate-500">
              3 frame khuôn mặt đã được thu thập.
              Hệ thống đang xử lý dữ liệu, vui lòng
              chờ trong giây lát.
            </p>

            {/* Progress */}

            <div className="mt-7 w-full max-w-[300px]">
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-blue-600" />
              </div>

              <p className="mt-2 text-[11px] font-medium text-slate-400">
                Đang xử lý dữ liệu...
              </p>
            </div>
          </section>
        )}

        {/* =====================================================
            ERROR
        ====================================================== */}

        {status === "error" && (
          <section className="mt-12 flex w-full flex-col items-center">
            <div
              className="
                flex h-20 w-20
                items-center justify-center
                rounded-full
                bg-rose-50
              "
            >
              <XCircle
                size={38}
                strokeWidth={1.8}
                className="text-rose-500"
              />
            </div>

            <h1 className="mt-7 text-[24px] font-bold tracking-tight text-slate-900">
              Đăng ký thất bại
            </h1>

            <p className="mt-3 max-w-[340px] text-sm leading-6 text-slate-500">
              Không thể hoàn tất đăng ký khuôn mặt.
              Vui lòng kiểm tra lại và thử lại.
            </p>

            {/* Error */}

            {error && (
              <div
                className="
                  mt-5
                  w-full
                  rounded-2xl
                  bg-rose-50
                  px-4 py-3
                  text-left
                "
              >
                <p className="text-xs font-bold leading-5 text-rose-600">
                  {error}
                </p>
              </div>
            )}

            {/* Retry */}

            <button
              type="button"
              onClick={onRetry}
              className="
                mt-7
                flex h-12 w-full
                items-center justify-center gap-2.5
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
              <RefreshCw
                size={19}
                strokeWidth={2.3}
              />

              <span>Đăng ký lại</span>
            </button>
          </section>
        )}

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <p className="mt-10 text-[11px] font-medium text-slate-400">
          Vui lòng không đóng trình duyệt trong quá trình xử lý.
        </p>
      </main>
    </div>
  );
}