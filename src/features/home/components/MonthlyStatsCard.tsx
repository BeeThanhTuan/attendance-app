import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { getAttendanceHistory } from "@/lib/api/history.api";

export default function MonthlyStatsCard() {
  const navigate = useNavigate();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const monthString = String(month).padStart(2, "0");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["attendance-history", year, month],
    queryFn: () => getAttendanceHistory(month, year),
  });



  return (
    <div className="rounded-2xl bg-white p-5 border border-slate">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-base font-semibold text-slate-800">
          Thống kê tháng {monthString}/{year}
        </h2>
        <button
          type="button"
          onClick={() => navigate("/history")}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          Xem chi tiết
        </button>
      </div>

      {/* Stats Grid: 2 Items (Đã chấm công & Quên check out) */}
      {isLoading ? (
        <div className="flex items-center justify-center py-6 text-slate-400 gap-2">
          <Loader2 size={18} className="animate-spin text-blue-500" />
          <span className="text-xs font-medium">Đang tải thống kê...</span>
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center py-6 text-slate-400">
          <span className="text-xs font-medium">Không thể tải thống kê</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 divide-x divide-slate-100 pt-1">
          {/* Column 1: Đã chấm công */}
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
              {data?.worked_days ?? 0}
            </span>
            <span className="text-xs font-medium text-slate-500 mt-1">
              Đã chấm công
            </span>
          </div>

          {/* Column 2: Quên check out */}
          <div className="flex flex-col items-center justify-center text-center pl-3">
            <span className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
              {data?.forgot_checkout_days ?? 0}
            </span>
            <span className="text-xs font-medium text-slate-500 mt-1">
              Quên chấm công ra
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
