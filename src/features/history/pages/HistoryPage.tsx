import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Header from "@/shared/components/Header";
import HistoryCalendar from "../components/HistoryCalendar";
import { getAttendanceHistory } from "@/lib/api/history.api";
import { getTodayString } from "@/utils/date";

export default function HistoryPage() {
  const navigate = useNavigate();
  const today = getTodayString();
  const todayDate = new Date();

  const [year, setYear] = useState(todayDate.getFullYear());
  const [month, setMonth] = useState(todayDate.getMonth() + 1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["attendance-history", year, month],
    queryFn: () => getAttendanceHistory(month, year),
  });

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    const nowYear = todayDate.getFullYear();
    const nowMonth = todayDate.getMonth() + 1;
    if (year > nowYear || (year === nowYear && month >= nowMonth)) return;

    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (date: string) => {
    navigate(`/history/${date}`);
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <Header title="Lịch sử" showBack={false}/>
      <div className="flex-1 flex flex-col space-y-4 bg-white rounded-t-2xl">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <Loader2 size={32} className="animate-spin text-violet-500" />
              <span className="text-sm font-medium">Đang tải dữ liệu...</span>
            </div>
          </div>
        ) : isError ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <div className="text-center text-rose-500">
              <p className="font-bold text-base">Không thể tải dữ liệu</p>
              <p className="text-sm mt-1 text-slate-400">
                Vui lòng kiểm tra kết nối và thử lại.
              </p>
            </div>
          </div>
        ) : (
          <HistoryCalendar
            year={year}
            month={month}
            worked_days={data?.worked_days}
            forgot_checkout_days={data?.forgot_checkout_days}
            days={data?.days ?? []}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onSelectDay={handleSelectDay}
            today={today}
          />
        )}
      </div>
    </div>
  );
}
