export type AttendanceStatus =
  | "not_checked_in"
  | "working"
  | "completed"
  | "pending_checkout"
  | "checked_in"
  | "forgot_checkout"
  | "incomplete";

export const statusTextMap: Record<string, { label: string; color: string; bg: string; wave: string }> = {
  working: {
    label: "Đang làm việc",
    color: "text-emerald-600",
    bg: "bg-emerald-50/70 border-emerald-100",
    wave: "bg-emerald-500",
  },
  completed: {
    label: "Đã hoàn thành",
    color: "text-blue-600",
    bg: "bg-blue-50/70 border-blue-100",
    wave: "bg-blue-500",
  },
  not_checked_in: {
    label: "Chưa chấm công",
    color: "text-amber-600",
    bg: "bg-amber-50/70 border-amber-100",
    wave: "bg-amber-500",
  },
  forgot_checkout: {
    label: "Quên chấm công ra",
    color: "text-violet-600",
    bg: "bg-violet-50/70 border-violet-100",
    wave: "bg-violet-500",
  },
  pending_checkout: {
    label: "Chưa chấm công ra",
    color: "text-violet-600",
    bg: "bg-violet-50/70 border-violet-100",
    wave: "bg-violet-500",
  },
};
