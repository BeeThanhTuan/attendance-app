import {
  CheckCircle2,
  Clock3,
  MapPin,
  Loader2,
  CircleDot,
  LogOut,
} from "lucide-react";

import type { AttendanceConfirmationDetail } from "@/features/attendance-confirmation/types/attendance-confirmation.types";
import { formatDateString } from "@/utils/date";

interface AttendanceConfirmationCardProps {
  attendance: AttendanceConfirmationDetail;
  onConfirm: (attendanceId: string) => void;
  confirming?: boolean;
}

export default function AttendanceConfirmationCard({
  attendance,
  onConfirm,
  confirming = false,
}: AttendanceConfirmationCardProps) {
  const {
    attendance_id,
    date,
    status,
    check_in_at,
    check_out_at,
    confirmed,
    confirmed_by,
    confirmed_at,
    location_name,
  } = attendance;

  const isCompleted = check_in_at !== null && check_out_at !== null;

  const isPending = isCompleted && !confirmed;

  const isForgotCheckout =
    status === "forgot_checkout" ||
    (check_in_at !== null && check_out_at === null);

  const formatDate = (value: string) => {
    const date = new Date(value);

    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (value: string | null) => {
    if (!value) {
      return "--:--";
    }

    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(value));
  };

  const getStatus = () => {
    if (confirmed) {
      return {
        label: "Đã xác nhận",
        className: "bg-emerald-50 text-emerald-600",
        icon: <CheckCircle2 size={13} />,
      };
    }

    if (isPending) {
      return {
        label: "Chờ xác nhận",
        className: "bg-amber-50 text-amber-600",
        icon: <Clock3 size={13} />,
      };
    }

    if (isForgotCheckout) {
      return {
        label: "Quên checkout",
        className: "bg-red-50 text-red-500",
        icon: <LogOut size={13} />,
      };
    }

    return {
      label: "Chưa hoàn tất",
      className: "bg-slate-100 text-slate-500",
      icon: <Clock3 size={13} />,
    };
  };

  const statusInfo = getStatus();

  return (
    <article
      className="
        overflow-hidden
        rounded-2xl
        bg-white
        border-slate
        p-3
        space-y-3
      "
    >
      <div className="flex items-start justify-between gap-3 ">
        {/* Date */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800">
                {formatDate(date)}
              </p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div
          className={`
            flex
            shrink-0
            items-center
            gap-1
            rounded-full
            px-2.5
            py-1
            text-[10px]
            font-semibold
            ${statusInfo.className}
          `}
        >
          {statusInfo.icon}

          <span>{statusInfo.label}</span>
        </div>
      </div>

      {/* =====================================================
       * Check in / Check out
       * ===================================================== */}

      <div className="">
        <div className="grid grid-cols-2 gap-2">
          {/* Check in */}
          <TimeBox
            icon={<CircleDot size={14} className="text-emerald-500" />}
            label="Chấm công vào"
            time={formatTime(check_in_at)}
            date={formatDateString(check_in_at)}

          />

          {/* Check out */}
          <TimeBox
            icon={
              <CircleDot
                size={14}
                className={check_out_at ? "text-blue-500" : "text-red-400"}
              />
            }
            label="Chấm công ra"
            time={formatTime(check_out_at)}
            date={formatDateString(check_out_at)}
          />
        </div>
      </div>

      {/* =====================================================
       * Location
       * ===================================================== */}

      {location_name && (
        <div className="flex items-start gap-2">
          <MapPin
            size={14}
            className="
              mt-0.5
              shrink-0
              text-slate-700
            "
          />

          <p className="text-[11px] leading-4 text-slate-500">
            {location_name}
          </p>
        </div>
      )}

      {/* =====================================================
       * Check-in image
       * ===================================================== */}

      {confirmed && confirmed_at && (
        <div
          className="
            rounded-xl
          "
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />

            <div className="flex items-center gap-2 text-slate-500">
              <p className="text-[11px] font-medium">
                Xác nhận bởi {confirmed_by}
              </p>
              <p className="mt-0.5 text-[10px]">
                {formatDateString(confirmed_at)}-
                {formatTime(confirmed_at)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
       * Action
       * ===================================================== */}

      {isPending && (
        <div className="">
          <button
            type="button"
            disabled={confirming}
            onClick={() => onConfirm(attendance_id)}
            className="
              flex
              h-10
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-500
              text-xs
              font-semibold
              text-white
              transition
              hover:bg-[#25204f]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {confirming ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Đang xác nhận...
              </>
            ) : (
              <>
                <CheckCircle2 size={15} />
                Xác nhận công
              </>
            )}
          </button>
        </div>
      )}

      {/* =====================================================
       * Forgot checkout
       * ===================================================== */}

      {isForgotCheckout && !confirmed && (
        <div className="p-4 pt-3">
          <div
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-red-50
              px-3
              py-2.5
              text-[11px]
              text-red-500
            "
          >
            <Clock3 size={14} className="shrink-0" />

            <span>Nhân viên chưa thực hiện checkout.</span>
          </div>
        </div>
      )}
    </article>
  );
}

/* ============================================================
 * Time Box
 * ============================================================ */

function TimeBox({
  icon,
  label,
  time,
  date,
}: {
  icon: React.ReactNode;
  label: string;
  time: string;
  date: string;
}) {
  return (
    <div
      className={`
        rounded-xl
        px-3
        bg-slate-50
        py-2.5
      `}
    >
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[10px] text-slate-400">{label}</span>
      </div>

      <div className="mt-1 flex items-center gap-1 text-sm font-bold text-slate-700">
        <span>{time}</span>
        <span className="text-slate-300">•</span>
        <span className="font-semibold">{date}</span>
      </div>
    </div>
  );
}
