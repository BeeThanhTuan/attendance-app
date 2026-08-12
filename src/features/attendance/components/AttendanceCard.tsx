import { CheckCircle2, Circle, Loader2, MapPin } from "lucide-react";
import type { AttendanceResponse } from "../types/attendance.types";
import { formatTimeString } from "@/utils/date";
import { statusTextMap } from "@/shared/types/attendance";

interface Props {
  attendance?: AttendanceResponse | null;
  isLoading?: boolean;
}

function getAttendanceDateInfo(attendanceDateStr?: string): { label: string; formattedDate: string } {
  let targetDate: Date;

  if (attendanceDateStr) {
    if (attendanceDateStr.includes("T")) {
      targetDate = new Date(attendanceDateStr);
    } else {
      const parts = attendanceDateStr.split("-");
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        targetDate = new Date(year, month, day);
      } else {
        targetDate = new Date(attendanceDateStr);
      }
    }
  } else {
    targetDate = new Date();
  }

  if (isNaN(targetDate.getTime())) {
    targetDate = new Date();
  }

  const rawDayName = targetDate.toLocaleDateString("vi-VN", { weekday: "long" });
  const dayName = rawDayName.charAt(0).toUpperCase() + rawDayName.slice(1);
  const dd = String(targetDate.getDate()).padStart(2, "0");
  const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
  const yyyy = targetDate.getFullYear();
  const formattedDate = `${dayName}, ${dd}/${mm}/${yyyy}`;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

  let label = "Hôm nay";
  if (targetDay.getTime() === today.getTime()) {
    label = "Hôm nay";
  } else if (targetDay.getTime() === yesterday.getTime()) {
    label = "Hôm qua";
  } else {
    label = `${dd}/${mm}/${yyyy}`;
  }

  return { label, formattedDate };
}


export default function AttendanceCard({ attendance, isLoading = false }: Props) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-white p-5 border-slate">
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <Loader2 className="size-6 animate-spin text-blue-600" />
          <span className="text-xs font-medium">Đang tải dữ liệu chấm công...</span>
        </div>
      </div>
    );
  }

  const { label, formattedDate } = getAttendanceDateInfo(attendance?.attendance_date);
  const checkInTime = formatTimeString(attendance?.check_in_at ?? null);
  const checkOutTime = formatTimeString(attendance?.check_out_at ?? null);

  const statusKey = attendance?.status || "not_checked_in";
  const statusConfig = statusTextMap[statusKey] || {
    label: statusKey,
    color: "text-slate-700",
    bg: "bg-slate-50 border-slate-100",
    wave: "bg-slate-400",
  };

  const isCheckedIn = Boolean(attendance?.checked_in);
  const isCheckedOut = Boolean(attendance?.checked_out);

  return (
    <div className="rounded-2xl bg-white p-5 border-slate space-y-4">
      {/* Card Header Date */}
      <div className="flex items-center gap-1.5">
        <h2 className="text-base font-semibold text-slate-800">{label}</h2>
        <span className="text-slate-300">•</span>
        <span className="text-sm text-slate-600 font-medium">{formattedDate}</span>
      </div>

      {/* Current Status Box */}
      <div className={`rounded-2xl border p-4 flex items-center justify-between ${statusConfig.bg}`}>
        <div>
          <p className="text-xs font-medium text-slate-500">Trạng thái hiện tại</p>
          <p className={`text-lg font-bold mt-0.5 ${statusConfig.color}`}>
            {statusConfig.label}
          </p>
        </div>

        {/* Animated Waveform Bars */}
        <div className="flex items-center gap-1 h-6 px-1">
          <span className={`w-1 h-3 rounded-full animate-bounce ${statusConfig.wave}`} style={{ animationDelay: "0ms" }} />
          <span className={`w-1 h-6 rounded-full animate-bounce ${statusConfig.wave}`} style={{ animationDelay: "150ms" }} />
          <span className={`w-1 h-4 rounded-full animate-bounce ${statusConfig.wave}`} style={{ animationDelay: "300ms" }} />
          <span className={`w-1 h-2 rounded-full animate-bounce ${statusConfig.wave}`} style={{ animationDelay: "450ms" }} />
        </div>
      </div>

      {/* Check in / Check out Side-by-side Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Check In Box */}
        <div className="rounded-2xl bg-slate-50/80 border border-slate-100 p-3.5 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500">Chấm công vào</span>

          <div className="my-2">
            <span
              className={`text-2xl font-bold tracking-tight tabular-nums ${isCheckedIn ? "text-emerald-600" : "text-slate-400"
                }`}
            >
              {isCheckedIn ? checkInTime : "--:--"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium">
            {isCheckedIn ? (
              <>
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                <span className="text-slate-600">Đã chấm công</span>
              </>
            ) : (
              <>
                <Circle size={15} className="text-slate-300 shrink-0" />
                <span className="text-slate-400">Chưa chấm công</span>
              </>
            )}
          </div>
        </div>

        {/* Check Out Box */}
        <div className="rounded-2xl bg-slate-50/80 border border-slate-100 p-3.5 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500">Chấm công ra</span>

          <div className="my-2">
            <span
              className={`text-2xl font-bold tracking-tight tabular-nums ${isCheckedOut ? "text-emerald-600" : "text-slate-400"
                }`}
            >
              {isCheckedOut ? checkOutTime : "--:--"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium">
            {isCheckedOut ? (
              <>
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                <span className="text-slate-600">Đã chấm công</span>
              </>
            ) : (
              <>
                <Circle size={15} className="text-slate-300 shrink-0" />
                <span className="text-slate-400">Chưa chấm công</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Location Footer (if available) */}
      {attendance?.location_name && (
        <div className="mt-3.5 flex items-center gap-2 text-xs font-medium text-slate-500 px-1">
          <MapPin size={14} className="text-blue-500 shrink-0" />
          <span className="">{attendance.location_name}</span>
        </div>
      )}
    </div>
  );
}

