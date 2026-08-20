import { ChevronLeft, ChevronRight, Check, AlertTriangle } from "lucide-react";

import type { HistoryDayItem } from "@/lib/api/history.api";

interface Props {
  year: number;
  month: number;
  worked_days?: number;
  forgot_checkout_days?: number;
  confirmed_days?: number;
  unconfirmed_days?: number;
  days: HistoryDayItem[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (date: string) => void;
  today: string;
}

const MONTH_NAMES = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

type CellStatus = "completed" | "active" | "missed" | null;

function resolveCellStatus(
  item: HistoryDayItem | undefined,
  dateStr: string,
  today: string,
): CellStatus {
  if (!item || item.status === "not_checked_in") {
    return null;
  }

  if (item.status === "completed") {
    return "completed";
  }

  // Hôm nay đã check-in nhưng chưa checkout
  if (dateStr === today) {
    return "active";
  }

  // Ngày cũ chưa checkout
  if (dateStr < today) {
    return "missed";
  }

  return null;
}

export default function HistoryCalendar({
  year,
  month,
  days,
  worked_days,
  confirmed_days,
  unconfirmed_days,
  forgot_checkout_days,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
  today,
}: Props) {
  // ==========================================================
  // STATUS MAP
  // ==========================================================

  const statusMap: Record<string, HistoryDayItem> = {};

  for (const d of days) {
    statusMap[d.date] = d;
  }

  // ==========================================================
  // CALENDAR
  // ==========================================================

  const firstDay = new Date(year, month - 1, 1).getDay();

  const paddingDays = firstDay === 0 ? 6 : firstDay - 1;

  const totalDays = new Date(year, month, 0).getDate();

  const calendarCells: (number | null)[] = [];

  for (let i = 0; i < paddingDays; i++) {
    calendarCells.push(null);
  }

  for (let d = 1; d <= totalDays; d++) {
    calendarCells.push(d);
  }

  // ==========================================================
  // CURRENT MONTH
  // ==========================================================

  const todayDate = new Date(today);

  const isCurrentMonth =
    year === todayDate.getFullYear() && month === todayDate.getMonth() + 1;

  return (
    <div className="rounded-2xl bg-white px-5 py-4">
      {/* ====================================================== */}
      {/* MONTH NAVIGATOR */}
      {/* ====================================================== */}

      <div className="flex items-center justify-between px-2 pb-3">
        <button
          onClick={onPrevMonth}
          className="
            rounded-xl p-1.5
            text-slate-600
            transition-colors
            hover:bg-slate-100
            active:bg-slate-200
          "
          aria-label="Tháng trước"
        >
          <ChevronLeft size={22} />
        </button>

        <span className="text-md font-bold tracking-tight text-slate-800">
          {MONTH_NAMES[month - 1]} {year}
        </span>

        <button
          onClick={onNextMonth}
          disabled={isCurrentMonth}
          className={`
            rounded-xl p-1.5 transition-colors
            ${
              isCurrentMonth
                ? "cursor-not-allowed text-slate-300"
                : "text-slate-600 hover:bg-slate-100 active:bg-slate-200"
            }
          `}
          aria-label="Tháng sau"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* ====================================================== */}
      {/* CALENDAR */}
      {/* ====================================================== */}

      <div className="rounded-2xl bg-[#a7a2e3]/15 p-3">
        {/* Weekdays */}
        <div className="mb-2 grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((day) => (
            <span
              key={day}
              className="text-[12px] font-semibold text-slate-700"
            >
              {day}
            </span>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarCells.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-10" />;
            }

            const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            const item = statusMap[dateStr];

            const cellStatus = resolveCellStatus(item, dateStr, today);

            const isToday = dateStr === today;
            const isFuture = dateStr > today;

            const isClickable =
              cellStatus === "completed" ||
              cellStatus === "active" ||
              cellStatus === "missed";

            /*
             * ==================================================
             * MÀU CHÍNH = CONFIRMATION STATUS
             *
             * confirmed     -> BLUE
             * unconfirmed   -> AMBER
             * no attendance -> SLATE
             * ==================================================
             */

            let cellColor = "";

            if (item?.confirmed === true) {
              cellColor = `
                border-blue-200
                bg-blue-50
                text-blue-700
                hover:bg-blue-100
              `;
            } else if (item?.confirmed === false) {
              cellColor = `
                border-amber-200
                bg-amber-50
                text-amber-700
                hover:bg-amber-100
              `;
            } else if (isFuture) {
              cellColor = `
                border-transparent
                bg-white
                text-slate-300
              `;
            } else {
              cellColor = `
                border-transparent
                bg-white
                text-slate-600
              `;
            }

            /*
             * ==================================================
             * DẤU CHẤM = ATTENDANCE STATUS
             *
             * completed -> emerald
             * active    -> amber
             * missed    -> rose
             * ==================================================
             */

            let dotColor = "";

            if (cellStatus === "completed") {
              dotColor = "bg-emerald-500";
            } else if (cellStatus === "active") {
              dotColor = "bg-amber-400";
            } else if (cellStatus === "missed") {
              dotColor = "bg-rose-500";
            }

            return (
              <button
                key={`day-${day}`}
                disabled={!isClickable || isFuture}
                onClick={() => {
                  if (isClickable) {
                    onSelectDay(dateStr);
                  }
                }}
                className={`
                  relative
                  flex h-10 w-10
                  items-center justify-center
                  rounded-xl
                  border
                  transition-all
                  focus:outline-none
                  ${cellColor}
                  ${
                    isClickable
                      ? "cursor-pointer active:scale-95"
                      : "cursor-default"
                  }
                  ${isToday ? "ring-2 ring-blue-400 ring-offset-1" : ""}
                `}
              >
                {/* Day number */}
                <span className="text-xs font-bold">{day}</span>

                {/* Attendance status dot */}
                {dotColor && (
                  <span
                    className={`
                      absolute
                      bottom-1
                      left-1/2
                      h-1.5
                      w-1.5
                      -translate-x-1/2
                      rounded-full
                      ${dotColor}
                    `}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ====================================================== */}
      {/* LEGEND */}
      {/* ====================================================== */}

      <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] font-semibold">
          {/* Đã làm */}
          <div className="flex flex-col items-center justify-between gap-1 text-emerald-600 border-slate rounded-xl p-2">
            <div className="w-full flex items-center justify-start gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>Đã làm</span>
            </div>
            <div>
              <span className="text-xl">{worked_days ?? 0}</span>
            </div>
          </div>

          {/* Quên checkout */}
          <div className="flex flex-col items-center gap-1 text-rose-600 border-slate rounded-xl p-2">
            <div className="w-full flex items-center justify-start gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              <span>Quên chấm công ra</span>
            </div>
            <div>
              <span className="text-xl">{forgot_checkout_days ?? 0}</span>
            </div>
          </div>

          {/* Đã xác nhận */}
          <div className="flex flex-col items-center gap-2 text-blue-600 border-slate rounded-xl p-2">
            <div className="w-full flex items-center justify-start gap-2">
              <span className="h-3 w-3 rounded bg-blue-100 ring-1 ring-blue-200" />
              <span>Đã xác nhận</span>
            </div>
            <div>
              <span className="text-xl">{confirmed_days ?? 0}</span>
            </div>
          </div>

          {/* Chưa xác nhận */}
          <div className="flex flex-col items-center gap-2 text-amber-600 border-slate rounded-xl p-2">
            <div className="w-full flex items-center justify-start gap-2">
              <span className="h-3 w-3 rounded bg-amber-100 ring-1 ring-amber-200" />
              <span>Chưa xác nhận</span>
            </div>
            <div>
              <span className="text-xl">{unconfirmed_days ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Giải thích */}
        <p className="mt-3 text-[10px] leading-relaxed text-slate-400">
          Màu nền thể hiện trạng thái xác nhận. Dấu chấm phía dưới thể hiện
          trạng thái chấm công.
        </p>
      </div>
    </div>
  );
}
