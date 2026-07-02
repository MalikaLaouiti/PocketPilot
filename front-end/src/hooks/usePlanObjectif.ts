import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { PlanObjectif } from "../types/planObjectif";

export function usePlanObjectif(idObjectif: string) {
  return useQuery<PlanObjectif>({
    queryKey: ['plan', idObjectif],
    queryFn: async () => {
      const { data } = await apiClient.get<PlanObjectif>(`/objectifs/${idObjectif}/plan`)
      return data
    },
    enabled: !!idObjectif,
  })
}
