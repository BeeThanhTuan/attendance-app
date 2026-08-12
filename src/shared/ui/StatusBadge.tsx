import { CheckCircle2, Clock3, Calendar } from "lucide-react";
import type { AttendanceStatus } from "@/shared/types/attendance";

export type Status = AttendanceStatus;

interface StatusBadgeProps {
  status: AttendanceStatus;
}

const config: Record<
  string,
  { label: string; icon: React.ElementType; className: string }
> = {
  working: {
    label: "Đang làm việc",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  not_checked_in: {
    label: "Chưa chấm công",
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  completed: {
    label: "Hoàn thành",
    icon: CheckCircle2,
    className: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  pending_checkout: {
    label: "Chưa chấm công ra",
    icon: Calendar,
    className: "bg-violet-50 text-violet-700 ring-violet-200",
  },
  forgot_checkout: {
    label: "Quên chấm công ra",
    icon: Calendar,
    className: "bg-rose-50 text-rose-700 ring-rose-200",
  }
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const item = config[status] || {
    label: status,
    icon: Clock3,
    className: "bg-slate-50 text-slate-700 ring-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${item.className}`}
    >
      {item.label}
    </span>
  );
}