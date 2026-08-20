import type { AttendanceStatus } from "@/shared/types/attendance";
import { api } from "../axios";

export interface HistoryDayItem {
  date: string; // YYYY-MM-DD
  status: "completed" | "not_checked_in" | "checked_in" | "incomplete";
  confirmed: boolean;
}

export interface AttendanceHistoryResponse {
  year: number;
  month: number;
  worked_days: number;
  forgot_checkout_days: number;
  confirmed_days: number;
  unconfirmed_days: number;
  days: HistoryDayItem[];
}

export interface AttendanceDetailLocation {
  id: string;
  location_name: string;
  address: string;
  longitude: number;
  latitude: number;
}

export interface AttendanceDetailResponse {
  id: string;
  employee_id: string;
  location_id: string;
  attendance_date: string;
  status: AttendanceStatus;
  check_in_at: string | null;
  check_out_at: string | null;
  checkin_image_path: string | null;
  checkout_image_path: string | null;
  confirmed: boolean,
  confirmed_by: string | null;
  confirmed_at: string | null;
  remark: string | null;
  location: AttendanceDetailLocation | null;
}

export const getAttendanceHistory = async (
  month: number,
  year: number,
): Promise<AttendanceHistoryResponse> => {
  const { data } = await api.get<AttendanceHistoryResponse>(
    "/attendance/history",
    { params: { month, year } },
  );
  return data;
};

export const getAttendanceDetail = async (
  date: string,
): Promise<AttendanceDetailResponse> => {
  const { data } = await api.get<AttendanceDetailResponse>(
    `/attendance/history/${date}`,
  );
  return data;
};
