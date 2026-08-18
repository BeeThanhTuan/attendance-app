import { useMemo, useState } from "react";
import { CalendarDays, Undo2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useConfirmationDetail } from "../hooks/useConfirmationDetail";
import { useConfirmAttendance } from "../hooks/useConfirmAttendance";
import AttendanceConfirmationCard from "../components/AttendanceConfirmationCard";
import MonthYearPicker from "../components/MonthYearPicker";
import { useConfirmAllAttendance } from "../hooks/useConfirmAllAttendance";
import ConfirmAllAttendanceModal from "../components/ConfirmAllAttendanceModal";
import { AnimatePresence } from "framer-motion";

type FilterType = "all" | "pending" | "confirmed";

export default function AttendanceConfirmationDetailPage() {
  const navigate = useNavigate();

  const { employeeId } = useParams<{
    employeeId: string;
  }>();

  const now = new Date();

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const [filter, setFilter] = useState<FilterType>("all");
  const [showConfirmAll, setShowConfirmAll] = useState(false);
  const { data, isLoading, isError } = useConfirmationDetail(
    employeeId ?? "",
    year,
    month,
  );

  const confirmMutation = useConfirmAttendance();
  const confirmAllMutation = useConfirmAllAttendance();

  const attendances = data?.days ?? [];

  const filteredAttendances = useMemo(() => {
    if (filter === "pending") {
      return attendances.filter(
        (item) =>
          item.check_in_at !== null &&
          item.check_out_at !== null &&
          !item.confirmed,
      );
    }

    if (filter === "confirmed") {
      return attendances.filter((item) => item.confirmed);
    }

    return attendances;
  }, [attendances, filter]);

  const totalWorkedDays = data?.total_worked_days ?? 0;

  const pendingDays = data?.pending_confirmation_days ?? 0;

  const confirmedDays = data?.confirmed_days ?? 0;

  const handleMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
  };

  const handleConfirm = (attendanceId: string) => {
    confirmMutation.mutate(attendanceId);
  };

  const handleConfirmAll = () => {
    if (!employeeId || pendingDays === 0) return;

    confirmAllMutation.mutate(
      {
        employeeId,
        year,
        month,
      },
      {
        onSuccess: () => {
          setShowConfirmAll(false);
        },
      },
    );
  };

  if (!employeeId) {
    return null;
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="shrink-0  bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 px-4 pb-4 pt-3 text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Quay lại"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-white/15
              text-white
              backdrop-blur-md
              transition-all
              hover:bg-white/25
              active:scale-95
            "
          >
            <Undo2 className="size-5" />
          </button>

          {/* Employee */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-md font-bold">
                {data?.full_name ?? "Nhân viên"}
              </h1>

              <p className="mt-0.5 text-sm text-white/90">
                {data?.employee_code ?? employeeId}
                {data?.department ? ` • ${data.department}` : ""}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
       * SCROLL CONTENT
       * ===================================================== */}

      <main
        className="
          relative
          min-h-0
          flex-1
          pb-5
          overflow-y-auto
        "
      >
        <MonthYearPicker
          year={year}
          month={month}
          onChange={handleMonthChange}
        />

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="
                  h-32
                  animate-pulse
                  rounded-2xl
                  bg-white
                "
              />
            ))}
          </div>
        )}

        {/* =================================================
         * ERROR
         * ================================================= */}

        {isError && (
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-medium text-red-500">
              Không thể tải dữ liệu chấm công.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="
                mt-3
                rounded-xl
                bg-[#302b62]
                px-4
                py-2
                text-xs
                font-medium
                text-white
              "
            >
              Thử lại
            </button>
          </div>
        )}

        {/* =================================================
         * CONTENT
         * ================================================= */}

        {!isLoading && !isError && data && (
          <div className="px-5 mt-3 flex-1 space-y-3">
            <div className="flex justify-between gap-2 overflow-x-auto pb-1">
              <FilterButton
                active={filter === "all"}
                onClick={() => setFilter("all")}
              >
                Tất cả
                {totalWorkedDays > 0 && (
                  <span
                    className="
                      rounded-full
                      bg-blue-500
                      px-1.5
                      py-0.5
                      text-[10px]
                      text-white
                    "
                  >
                    {totalWorkedDays}
                  </span>
                )}
              </FilterButton>

              <FilterButton
                active={filter === "pending"}
                onClick={() => setFilter("pending")}
              >
                Chờ xác nhận
                {pendingDays > 0 && (
                  <span
                    className="
                      rounded-full
                      bg-amber-500
                      px-1.5
                      py-0.5
                      text-[10px]
                      text-white
                    "
                  >
                    {pendingDays}
                  </span>
                )}
              </FilterButton>

              <FilterButton
                active={filter === "confirmed"}
                onClick={() => setFilter("confirmed")}
              >
                Đã xác nhận
                {confirmedDays > 0 && (
                  <span
                    className="
                      rounded-full
                      bg-emerald-400
                      px-1.5
                      py-0.5
                      text-[10px]
                      text-white
                    "
                  >
                    {confirmedDays}
                  </span>
                )}
              </FilterButton>
            </div>

            {/* =================================================
             * ATTENDANCE LIST
             * ================================================= */}

            <div className="space-y-3 flex-1">
              {filteredAttendances.length === 0 ? (
                <div className="rounded-2xl flex-1 bg-white p-8 text-center">
                  <CalendarDays size={25} className="mx-auto text-slate-300" />

                  <p className="mt-2 text-sm text-slate-400">Không tìm thấy.</p>
                </div>
              ) : (
                filteredAttendances.map((attendance) => (
                  <AttendanceConfirmationCard
                    key={attendance.attendance_id}
                    attendance={attendance}
                    onConfirm={handleConfirm}
                    confirming={
                      confirmMutation.isPending &&
                      confirmMutation.variables === attendance.attendance_id
                    }
                  />
                ))
              )}
            </div>
          </div>
        )}

      </main>
        {(pendingDays > 0 && filter !== "confirmed") && (
          <div className="px-5 pt-3 pb-5">
            <button
              type="button"
              onClick={() => setShowConfirmAll(true)}
              disabled={pendingDays === 0 || confirmAllMutation.isPending}
              className="
              w-full
              rounded-xl
              bg-blue-600
              py-3
              text-sm
              font-semibold
              text-white
              shadow-lg
              transition
              active:scale-[0.98]
            "
            >
              Xác nhận tất cả
            </button>
          </div>
        )}

      <AnimatePresence>
        {showConfirmAll && (
          <ConfirmAllAttendanceModal
            open={showConfirmAll}
            employeeName={data?.full_name}
            year={year}
            month={month}
            pendingDays={pendingDays}
            loading={confirmAllMutation.isPending}
            onClose={() => setShowConfirmAll(false)}
            onConfirm={handleConfirmAll}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
 * SUMMARY CARD
 * ============================================================ */

/* ============================================================
 * FILTER BUTTON
 * ============================================================ */

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        h-8
        shrink-0
        items-center
        gap-1.5
        rounded-full
        px-3
        text-xs
        font-medium
        transition
        active:scale-95
        ${
          active
            ? "border border-blue-600 bg-white text-blue-600"
            : "bg-white text-slate-500 border border-slate-200"
        }
      `}
    >
      {children}
    </button>
  );
}
