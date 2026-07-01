import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { AnalyseMensuelle } from "../types/analyseMensuelle";

export function useAnalyse(idCompte: string) {
  return useQuery({
    queryKey: ["analyse", idCompte],
    queryFn: async () => {
      const { data } = await apiClient.get<AnalyseMensuelle[]>(
        `/analyse/byCompte`,
        {
          params: {
            idCompte,
          },
        },
      );
      return data;
    },
    enabled: !!idCompte,
  });
}
