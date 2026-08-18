import { useQuery } from "@tanstack/react-query";

import { getConfirmationDetailApi } from "@/lib/api/attendance-confirmation.api";

export function useConfirmationDetail(
  employeeId: string,
  year: number,
  month: number,
) {
  return useQuery({
    queryKey: [
      "attendance-confirmation-detail",
      employeeId,
      year,
      month,
    ],

    queryFn: () =>
      getConfirmationDetailApi(
        employeeId,
        year,
        month,
      ),

    enabled: Boolean(employeeId),

    staleTime: 30 * 1000,
  });
}