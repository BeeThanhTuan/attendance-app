import { motion } from "framer-motion";
import { AlertTriangle} from "lucide-react";

interface ConfirmAllAttendanceModalProps {
  open: boolean;
  employeeName?: string;
  year: number;
  month: number;
  pendingDays: number;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmAllAttendanceModal({
  open,
  employeeName,
  year,
  month,
  pendingDays,
  loading = false,
  onClose,
  onConfirm,
}: ConfirmAllAttendanceModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
        onClick={loading ? undefined : onClose}
      />

      {/* Modal container */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 80,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 80,
            scale: 0.98,
          }}
          transition={{
            duration: 0.28,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            w-full
            max-w-[430px]
            rounded-t-3xl
            bg-white
            px-5
            pb-6
            pt-4
            shadow-2xl
          "
        >
          {/* Drag indicator */}
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-slate-200" />

          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-amber-50
                  text-amber-500
                "
              >
                <AlertTriangle size={21} />
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Xác nhận công
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Xác nhận toàn bộ ngày công
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm leading-5 text-slate-600">
              Bạn đang xác nhận công cho
            </p>

            <p className="mt-1 text-sm font-bold text-slate-800">
              {employeeName ?? "nhân viên"}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Tháng {month}/{year}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="text-xs text-slate-500">Ngày chờ xác nhận</span>

              <span className="text-sm font-bold text-amber-500">
                {pendingDays} ngày
              </span>
            </div>
          </div>

          {/* Warning */}
          <p className="mt-3 px-1 text-[11px] leading-4 text-slate-400">
            Sau khi xác nhận, các ngày công này sẽ được đánh dấu là đã xác nhận
            và không thể xác nhận lại.
          </p>

          {/* Actions */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                h-11
                rounded-xl
                border
                border-slate-200
                bg-white
                text-sm
                font-semibold
                text-slate-600
                transition
                active:scale-[0.98]
                disabled:opacity-50
              "
            >
              Hủy
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="
                h-11
                rounded-xl
                bg-blue-600
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:bg-slate-300
              "
            >
              {loading ? "Đang xác nhận..." : "Xác nhận"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
