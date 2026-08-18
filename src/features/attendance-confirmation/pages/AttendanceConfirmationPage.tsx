import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

import MonthYearPicker from "../components/MonthYearPicker";
import ConfirmationEmployeeCard from "../components/ConfirmationEmployeeCard";

import { useConfirmationSummary } from "../hooks/useConfirmationSummary";
import AppHeader from "@/shared/components/Header";

export default function AttendanceConfirmationPage() {
  const navigate = useNavigate();

  const now = new Date();

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(
    now.getMonth() + 1,
  );

  const [search, setSearch] = useState("");

  const {
    data,
    isLoading,
    isError,
  } = useConfirmationSummary(
    year,
    month,
  );

  const employees = data?.employees ?? [];

  const filteredEmployees = employees.filter(
    (employee) => {
      const keyword = search
        .trim()
        .toLowerCase();

      if (!keyword) {
        return true;
      }

      return (
        employee.full_name
          .toLowerCase()
          .includes(keyword) ||
        employee.employee_code
          .toLowerCase()
          .includes(keyword) ||
        employee.department
          .toLowerCase()
          .includes(keyword)
      );
    },
  );

  const handleMonthChange = (
    newYear: number,
    newMonth: number,
  ) => {
    setYear(newYear);
    setMonth(newMonth);
  };

  return (
    <div className="flex min-h-full flex-col bg-white">
      <AppHeader title="Xác nhận chấm công" showBack={false} />
       {/* Month / Year */}
      <MonthYearPicker
        year={year}
        month={month}
        onChange={handleMonthChange}
      />

      {/* Search */}
      <div className="sticky top-0 z-20 px-4 pb-2 pt-3">
        <div className="flex items-center gap-2">
          <div
            className="
              flex h-10 flex-1
              items-center
              rounded-xl
              border border-slate-200
              bg-white
              px-3
            "
          >
            <Search
              size={15}
              className="text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Tìm nhân viên..."
              className="
                ml-2
                w-full
                bg-transparent
                text-xs
                text-slate-700
                outline-none
                placeholder:text-slate-400
              "
            />
          </div>

          <button
            type="button"
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              border border-slate-200
              bg-white
              text-slate-500
            "
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>

    
      {/* Content */}
      <div className="flex-1 px-4 pb-24 pt-3">
        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <EmployeeSkeleton
                  key={index}
                />
              ),
            )}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex min-h-[200px] items-center justify-center">
            <p className="text-sm text-red-500">
              Không thể tải dữ liệu chấm công.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading &&
          !isError &&
          filteredEmployees.length === 0 && (
            <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
              <p className="text-sm font-medium text-slate-600">
                Không tìm thấy nhân viên
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Không có dữ liệu trong tháng này.
              </p>
            </div>
          )}

        {/* Employees */}
        {!isLoading &&
          !isError &&
          filteredEmployees.length > 0 && (
            <div className="space-y-3">
              {filteredEmployees.map(
                (employee) => (
                  <ConfirmationEmployeeCard
                    key={employee.employee_id}
                    employee={employee}
                    onClick={() =>
                      navigate(
                        `/attendance-confirmation/${employee.employee_id}?year=${year}&month=${month}`,
                      )
                    }
                  />
                ),
              )}
            </div>
          )}
      </div>
    </div>
  );
}

function EmployeeSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-3">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-slate-200" />

        <div className="flex-1">
          <div className="h-3 w-32 rounded bg-slate-200" />
          <div className="mt-2 h-2 w-24 rounded bg-slate-100" />
        </div>

        <div className="h-4 w-4 rounded bg-slate-100" />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="h-12 rounded-xl bg-slate-100" />
        <div className="h-12 rounded-xl bg-slate-100" />
        <div className="h-12 rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}