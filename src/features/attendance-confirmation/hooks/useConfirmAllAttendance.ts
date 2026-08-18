import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  confirmAllAttendanceApi,
  type ConfirmAllAttendanceParams,
} from "@/lib/api/attendance-confirmation.api";

export function useConfirmAllAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ConfirmAllAttendanceParams) =>
      confirmAllAttendanceApi(params),

    onSuccess: (_, variables) => {
      // Refresh detail của nhân viên
      queryClient.invalidateQueries({
        queryKey: [
          "attendance-confirmation-detail",
          variables.employeeId,
          variables.year,
          variables.month,
        ],
      });

      // Refresh summary danh sách nhân viên
      queryClient.invalidateQueries({
        queryKey: [
          "attendance-confirmation-summary",
          variables.year,
          variables.month,
        ],
      });
    },
  });
}