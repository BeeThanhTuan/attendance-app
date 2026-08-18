import { ChevronRight } from "lucide-react";

import type { ConfirmationEmployee } from "../types/attendance-confirmation.types";
import { StatBox } from "./StatBox";
import { getImageUrl } from "@/lib/utils/image";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";

interface ConfirmationEmployeeCardProps {
  employee: ConfirmationEmployee;
  onClick?: () => void;
}

export default function ConfirmationEmployeeCard({
  employee,
  onClick,
}: ConfirmationEmployeeCardProps) {
  const avatarUrl = employee.avatar
    ? getImageUrl(employee.avatar)
    : avatarPlaceholder;

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        rounded-2xl
        bg-white
        p-3
        text-left
        border-slate
        transition
        active:scale-[0.99]
      "
    >
      {/* Employee info */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className="
            flex h-11 w-11 shrink-0
            items-center justify-center
            overflow-hidden
            rounded-full
            bg-slate-100
          "
        >
          <img
            src={avatarUrl}
            alt={employee.full_name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800">
            {employee.full_name}
          </p>

          <p className="mt-0.5 text-[11px] text-slate-400">
            {employee.employee_code} • {employee.department}
          </p>
        </div>

        <ChevronRight size={17} className="shrink-0 text-slate-400" />
      </div>

      {/* Statistics */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {/* Total */}
        <StatBox
          value={employee.total_worked_days}
          label="Tổng ngày"
          type="total"
        />

        {/* Pending */}
        <StatBox
          value={employee.pending_confirmation_days}
          label="Chờ xác nhận"
          type="pending"
        />

        {/* Confirmed */}
        <StatBox
          value={employee.confirmed_days}
          label="Đã xác nhận"
          type="confirmed"
        />
      </div>
    </button>
  );
}
