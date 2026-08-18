import type { AttendanceStatus } from "@/shared/types/attendance";

export interface ConfirmationEmployee {
  employee_id: string;
  employee_code: string;
  full_name: string;
  department: string;
  avatar:string;
  total_worked_days: number;
  pending_confirmation_days: number;
  confirmed_days: number;
}

export interface ConfirmationSummary {
  year: number;
  month: number;
  employees: ConfirmationEmployee[];
}

export interface AttendanceConfirmationDetail {
  attendance_id: string;
  employee_id: string;
  date: string;

  status: AttendanceStatus;

  check_in_at: string | null;
  check_out_at: string | null;

  checkin_image: string | null;
  remark: string | null;

  confirmed: boolean;
  confirmed_by: string | null;
  confirmed_at: string | null;

  location_name: string | null;
}

export type ConfirmationDetailResponse = {
  employee_id: string;
  employee_code: string;
  full_name: string;
  department: string;

  year: number;
  month: number;

  total_worked_days: number;
  pending_confirmation_days: number;
  confirmed_days: number;

  days: AttendanceConfirmationDetail[];
};