import { api } from "../axios";
import type { AttendanceResponse } from "@/features/attendance/types/attendance.types";

export const getTodayAttendance = async () => {
  const { data } = await api.get<AttendanceResponse>(
    "/attendance/today",
  );

  return data;
};

export const verifyFace = async (formData: FormData) => {
  const { data } = await api.post(
    "/attendance/face",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const checkInApi = async (formData: FormData) => {
  const { data } = await api.post(
    "/attendance/check-in",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const checkOutApi = async (formData: FormData) => {
  const { data } = await api.post("/attendance/check-out", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};
