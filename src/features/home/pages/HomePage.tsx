import HomeHeader from "../components/HomeHeader";
import TodayAttendanceCard from "../components/AttendanceCard";
import MonthlyStatsCard from "../components/MonthlyStatsCard";
import { useTodayAttendance } from "../../attendance/hooks/useTodayAttendance";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { Loader2, AlertCircle } from "lucide-react";
import ShiftCard from "../components/ShiftCard";

export default function HomePage() {
  const attendanceQuery = useTodayAttendance();
  const profileQuery = useProfile();

  if (attendanceQuery.isPending || profileQuery.isPending) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-slate-50 py-24">
        <Loader2 size={36} className="animate-spin text-blue-600 mb-3" />
        <span className="text-sm font-medium text-slate-500">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (
    attendanceQuery.isError ||
    profileQuery.isError ||
    !attendanceQuery.data ||
    !profileQuery.data
  ) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-slate-50 p-6 text-center py-24">
        <AlertCircle size={36} className="text-rose-500 mb-3" />
        <p className="text-base font-bold text-slate-800">Không thể tải dữ liệu</p>
        <p className="text-xs text-slate-400 mt-1">Vui lòng kiểm tra lại kết nối.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto bg-white pb-24">
      <HomeHeader profile={profileQuery.data} />
      <div className="mx-5 space-y-4">
        <TodayAttendanceCard data={attendanceQuery.data} />
        <MonthlyStatsCard />
        <ShiftCard profile={profileQuery.data} ></ShiftCard>
      </div>
    </div>
  );
}
