import type { AttendanceStatus } from "@/shared/types/attendance";

export interface AttendanceResponse {
  attendance_date: string;
  status: AttendanceStatus;
  checked_in: boolean;
  checked_out: boolean;
  check_in_at: string | null;
  check_out_at: string | null;
  location_name: string | null;
  can_check_in: boolean;
  can_check_out: boolean;
}
