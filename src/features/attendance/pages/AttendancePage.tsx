import { useNavigate } from "react-router-dom";
import { useTodayAttendance } from "../hooks/useTodayAttendance";

import AttendanceCard from "../components/AttendanceCard";
import AttendanceActionButton from "../components/AttendanceActionButton";
import Header from "@/shared/components/Header";

export default function AttendancePage() {
  const navigate = useNavigate();
  const { data: todayAttendance, isLoading } = useTodayAttendance();

  return (
    <div className="flex flex-col flex-1 overflow-y-auto bg-slate-50/50 pb-24">
      <Header title="Chấm công" showBack={false} />

      <div className="mx-5 py-4 space-y-4">
        {/* Attendance Status Card */}
        <AttendanceCard attendance={todayAttendance} isLoading={isLoading} />


        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {todayAttendance?.can_check_in && (
            <AttendanceActionButton
              type="check-in"
              onClick={() => navigate("/attendance/check-in")}
            />
          )}

          {todayAttendance?.can_check_out && (
            <AttendanceActionButton
              type="check-out"
              disabled={isLoading || !todayAttendance?.can_check_out}
              onClick={() => navigate("/attendance/check-out")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

