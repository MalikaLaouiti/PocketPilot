import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import type { Budget } from '../types/budget'

export function useBudgets(idCompte: string) {
  return useQuery({
    queryKey: ['budgets', idCompte],
    queryFn: async () => {
      const { data } = await apiClient.get<Budget[]>(`/budgets`, {
        params: {
          idCompte,
        },
      });
      return data;
    },
    enabled: !!idCompte,
  })
}