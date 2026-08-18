import type { AttendanceConfirmationDetail, ConfirmationDetailResponse, ConfirmationSummary } from "@/features/attendance-confirmation/types/attendance-confirmation.types";
import { api } from "@/lib/axios";



export const getConfirmationSummary = async (
  year: number,
  month: number,
): Promise<ConfirmationSummary> => {
  const { data } = await api.get<ConfirmationSummary>(
    "/attendance-confirmation/summary",
    {
      params: {
        year,
        month,
      },
    },
  );

  return data;
};

export const getConfirmationDetailApi = async (
  employeeId: string,
  year: number,
  month: number,
): Promise<ConfirmationDetailResponse> => {
  const { data } = await api.get<ConfirmationDetailResponse>(
    `/attendance-confirmation/${employeeId}`,
    {
      params: {
        year,
        month,
      },
    },
  );

  return data;
};

/* =========================================================
 * Confirm
 * ========================================================= */

export const confirmAttendanceApi = async (
  attendanceId: string,
): Promise<AttendanceConfirmationDetail> => {
  const { data } = await api.put<AttendanceConfirmationDetail>(
    `/attendance-confirmation/${attendanceId}/confirm`,
  );

  return data;
};

export interface ConfirmAllAttendanceParams {
  employeeId: string;
  year: number;
  month: number;
}


export async function confirmAllAttendanceApi({
  employeeId,
  year,
  month,
}: ConfirmAllAttendanceParams) {
  const response = await api.post(
    "/attendance-confirmation/confirm-all",
    null,
    {
      params: {
        employee_id: employeeId,
        year,
        month,
      },
    },
  );

  return response.data;
}