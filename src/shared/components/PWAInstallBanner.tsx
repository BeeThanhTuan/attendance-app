import { Download, Share, X } from "lucide-react";
import { useState } from "react";
import { usePWAInstall } from "@/shared/hooks/usePWAInstall";

/**
 * Banner gợi ý cài đặt PWA:
 * - Nếu Android Chrome (canInstall = true): Nút "Cài đặt" để bật prompt native.
 * - Nếu iPhone/iOS (isIOS = true): Hướng dẫn bấm icon Chia sẻ -> Thêm vào MH chính.
 * - Nếu Mobile (isMobile = true) nhưng chưa có prompt: Hướng dẫn vào Menu -> Thêm vào MH chính.
 */
export default function PWAInstallBanner() {
  const { canInstall, isMobile, isIOS, isInstalled, promptInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  // Không hiển thị nếu đã cài app, hoặc bị tắt, hoặc không phải màn hình/thiết bị mobile
  if (isInstalled || dismissed || !isMobile) return null;

  return (
    <div className="fixed bottom-20 inset-x-0 z-50 mx-auto max-w-[430px] px-4 pointer-events-none">
      <div className="flex items-center gap-3 rounded-2xl bg-blue-600 px-4 py-3 shadow-lg shadow-blue-500/30 pointer-events-auto">
        {/* Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
          {isIOS ? <Share size={20} className="text-white" /> : <Download size={20} className="text-white" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-snug">
            {canInstall ? "Cài đặt ứng dụng" : "Thêm ứng dụng ra màn hình chính"}
          </p>
          <p className="text-xs text-blue-100 mt-0.5">
            {canInstall ? (
              "Trải nghiệm như ứng dụng di động"
            ) : isIOS ? (
              <span>Nhấn biểu tượng <strong>Chia sẻ</strong> ➔ chọn <strong>"Thêm vào MH chính"</strong></span>
            ) : (
              <span>Nhấn menu <strong>⋮</strong> trình duyệt ➔ chọn <strong>"Thêm vào MH chính"</strong></span>
            )}
          </p>
        </div>

        {/* Action Button */}
        {canInstall && (
          <button
            type="button"
            onClick={promptInstall}
            className="shrink-0 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-blue-600 active:scale-95 transition-transform"
          >
            Cài đặt
          </button>
        )}

        {/* Dismiss */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 text-white/70 hover:text-white transition-colors p-1"
          aria-label="Đóng"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
