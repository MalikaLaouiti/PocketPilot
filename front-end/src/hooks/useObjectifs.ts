import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { ObjectifFinancier } from "../types/objectifFinancier";

export function useObjectifs(idCompte: string) {
  return useQuery({
    queryKey: ["objectifs", idCompte],
    queryFn: async () => {
      const { data } = await apiClient.get<ObjectifFinancier[]>("/objectifs", {
        params: {
          idCompte,
        },
      });
      return data;
    },
    enabled: !!idCompte,
  });
}
