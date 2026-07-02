// hooks/useScoreSante.ts
import { useQuery } from '@tanstack/react-query'
import type { ScoreSante } from '../types/scoreSante'
import { apiClient } from '../api/client';

// MOCK — à remplacer par un appel apiClient.get(`/comptes/${idCompte}/score`) dès que le backend expose l'endpoint
export function useScoreSante(idCompte: string) {
  return useQuery({
      queryKey: ["score-sante", idCompte],
      queryFn: async () => {
        const { data } = await apiClient.get<ScoreSante>("/scores/dernier", {
          params: {
            idCompte,
          },
        });
        return data;
      },
      enabled: !!idCompte,
    });
}