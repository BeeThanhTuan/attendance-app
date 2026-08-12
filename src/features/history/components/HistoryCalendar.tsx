import { ChevronLeft, ChevronRight, Check, AlertTriangle } from "lucide-react";
import type { HistoryDayItem } from "@/lib/api/history.api";

interface Props {
  year: number;
  month: number; // 1-12
  worked_days: number;
  forgot_checkout_days: number;
  days: HistoryDayItem[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (date: string) => void;
  today: string; // YYYY-MM-DD
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
  if (!item || item.status === "not_checked_in") return null;

  const { status } = item;

  if (status === "completed") return "completed";

  // Hôm nay đã check in nhưng chưa check out → vàng (bất kể tên status cụ thể)
  if (dateStr === today) return "active";

  // Ngày trước hôm nay mà chưa hoàn thành → quên check out → đỏ
  if (dateStr < today) return "missed";

  return null;
}

export default function HistoryCalendar({
  year,
  month,
  days,
  worked_days,
  forgot_checkout_days,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
  today,
}: Props) {
  // Build status lookup map: date string → HistoryDayItem
  const statusMap: Record<string, HistoryDayItem> = {};
  for (const d of days) {
    statusMap[d.date] = d;
  }

  // First weekday of the month (0=Sun..6=Sat) → convert to Mo=0..Su=6
  const firstDay = new Date(year, month - 1, 1).getDay();
  const paddingDays = firstDay === 0 ? 6 : firstDay - 1;
  const totalDays = new Date(year, month, 0).getDate();

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < paddingDays; i++) calendarCells.push(null);
  for (let d = 1; d <= totalDays; d++) calendarCells.push(d);




  // Prevent navigation beyond current month
  const todayDate = new Date(today);
  const isCurrentMonth =
    year === todayDate.getFullYear() && month === todayDate.getMonth() + 1;

  return (
    <div className="rounded-2xl bg-white px-5 p-4">
      {/* Month Navigator Header */}
      <div className="flex items-center justify-between px-2 pb-3">
        <button
          onClick={onPrevMonth}
          className="p-1.5 rounded-xl text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
          aria-label="Tháng trước"
        >
          <ChevronLeft size={22} />
        </button>

        <span className="text-md font-bold text-slate-800 tracking-tight">
          {MONTH_NAMES[month - 1]} {year}
        </span>

        <button
          onClick={onNextMonth}
          disabled={isCurrentMonth}
          className={`p-1.5 rounded-xl transition-colors ${isCurrentMonth
            ? "text-slate-300 cursor-not-allowed"
            : "text-slate-600 hover:bg-slate-100 active:bg-slate-200"
            }`}
          aria-label="Tháng sau"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      <div className="bg-[#a7a2e3]/15 rounded-2xl p-3">
        {/* Weekday Labels */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {WEEKDAYS.map((day) => (
            <span
              key={day}
              className="text-[12px] font-semibold text-slate-700"
            >
              {day}
            </span>
          ))}
        </div>

        {/* Calendar Grid */}
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

            // Only clickable if has a meaningful worked status
            const isClickable =
              cellStatus === "completed" ||
              cellStatus === "active" ||
              cellStatus === "missed";

            return (
              <button
                key={`day-${day}`}
                disabled={!isClickable || isFuture}
                onClick={() => isClickable && onSelectDay(dateStr)}
                className={`flex flex-col h-10 w-10 items-center justify-center bg-white rounded-xs transition-all focus:outline-none ${isClickable
                  ? "cursor-pointer active:scale-95"
                  : "cursor-default"
                  }`}
              >
                <div
                  className={`
                    relative
                    flex h-full w-full
                    items-center justify-center
                    text-xs font-bold
                    transition-all
                    ${cellStatus === "completed"
                      ? "after:absolute after:bottom-1 after:left-1/2 after:h-1.5 after:w-1.5 after:-translate-x-1/2 after:rounded-full after:bg-emerald-500"
                      : cellStatus === "active"
                        ? "after:absolute after:bottom-1 after:left-1/2 after:h-1.5 after:w-1.5 after:-translate-x-1/2 after:rounded-full after:bg-amber-400"
                        : cellStatus === "missed"
                          ? "after:absolute after:bottom-1 after:left-1/2 after:h-1.5 after:w-1.5 after:-translate-x-1/2 after:rounded-full after:bg-rose-500"
                          : isFuture
                            ? "text-slate-300"
                            : "text-slate-600"
                    }
                    ${isToday
                      ? "border border-blue-500 bg-blue-500/30 font-extrabold text-blue-700 rounded-xs"
                      : ""
                    }
                  `}
                >
                  {day}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-around border-t border-slate-100 pt-3 text-[11px] font-semibold">
        <div className="flex items-center gap-1.5 text-emerald-600">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span>Đã làm</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-600">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span>Đang làm</span>
        </div>
        <div className="flex items-center gap-1.5 text-rose-600">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
          <span>Quên chấm công ra</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shrink-0 ">
            <Check size={16} strokeWidth={3} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-emerald-600/80">
              Ngày đã làm
            </p>
            <p className="text-xl font-black text-emerald-700 leading-none mt-0.5">
              {worked_days}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-rose-50 border border-rose-100 p-3 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white shrink-0 ">
            <AlertTriangle size={16} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-rose-600/80">
              Quên chấm công ra
            </p>
            <p className="text-xl font-black text-rose-700 leading-none mt-0.5">
              {forgot_checkout_days}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
