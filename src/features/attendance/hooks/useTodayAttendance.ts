import { useQuery } from "@tanstack/react-query";
import { getTodayAttendance } from "@/lib/api/attendance.api";

export function useTodayAttendance() {
  return useQuery({
    queryKey: ["attendance", "today"],
    queryFn: getTodayAttendance,

    staleTime: 1000 * 60, // 1 phút
    gcTime: 1000 * 60 * 5, // cache 5 phút
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
