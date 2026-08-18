import { useMutation, useQueryClient } from "@tanstack/react-query";

import { confirmAttendanceApi } from "@/lib/api/attendance-confirmation.api";

export function useConfirmAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmAttendanceApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendance-confirmation-detail"],
      });

      queryClient.invalidateQueries({
        queryKey: ["attendance-confirmation-summary"],
      });
    },
  });
}