import {Info, MoveRight } from "lucide-react";
import type { Profile } from "@/features/profile/types/profile.types";

interface Props {
  profile: Profile;
}

function formatTime(time?: string) {
  if (!time) return "--:--";
  return time.slice(0, 5);
}

function getCheckInStartTime(
  startTime?: string,
  beforeMinutes: number = 0,
) {
  if (!startTime) return "--:--";
  const parts = startTime.split(":");
  if (parts.length < 2) return "--:--";

  const hour = Number(parts[0]);
  const minute = Number(parts[1]);
  if (isNaN(hour) || isNaN(minute)) return "--:--";

  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  date.setMinutes(date.getMinutes() - beforeMinutes);

  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ShiftCard({ profile }: Props) {
  const workShift = profile?.work_shift;
  if (!workShift) return null;

  const {
    name,
    start_time,
    end_time,
    allow_checkin_before_minutes = 0,
  } = workShift;

  const shiftStart = formatTime(start_time);
  const shiftEnd = formatTime(end_time);

  const checkInStart = getCheckInStartTime(
    start_time,
    allow_checkin_before_minutes,
  );

  return (
    <div className="rounded-2xl bg-white p-5 border border-slate">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center justify-between w-full gap-2">
          <h2 className="text-base font-semibold text-slate-800">
            Ca làm việc của bạn
          </h2>
          {name && (
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 border border-blue-100/80">
              {name}
            </span>
          )}
        </div>

      </div>

      {/* Shift Time Window Box */}
      <div className="rounded-2xl bg-slate-50/80 border border-slate-100 p-4">
        <div className="flex items-center justify-around">
          {/* Start Time */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-slate-500 mb-1">
              Giờ vào ca
            </span>
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {shiftStart}
            </span>
          </div>

          {/* Arrow Divider */}
          <div className="flex items-center justify-center px-2">
            <MoveRight size={20} className="text-slate-400" />
          </div>

          {/* End Time */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-slate-500 mb-1">
              Giờ tan ca
            </span>
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {shiftEnd}
            </span>
          </div>
        </div>
      </div>

      {/* Checkin Info Notice */}
      <div className="mt-3.5 flex items-center gap-2 rounded-xl bg-blue-50/60 border border-blue-100/80 px-3.5 py-2.5 text-xs text-blue-900 font-medium">
        <Info size={15} className="text-blue-600 shrink-0" />
        <span>
          Có thể chấm công từ{" "}
          <strong className="font-bold text-blue-700">{checkInStart}</strong>
          {allow_checkin_before_minutes > 0 && (
            <span className="text-blue-600/80 font-normal">
              {" "}(trước {allow_checkin_before_minutes} phút)
            </span>
          )}
        </span>
      </div>
    </div>
  );
}