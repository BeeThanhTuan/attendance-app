import { getConfirmationSummary } from "@/lib/api/attendance-confirmation.api";
import { useQuery } from "@tanstack/react-query";


export function useConfirmationSummary(
  year: number,
  month: number,
) {
  return useQuery({
    queryKey: [
      "attendance-confirmation-summary",
      year,
      month,
    ],
    queryFn: () =>
      getConfirmationSummary(year, month),
  });
}