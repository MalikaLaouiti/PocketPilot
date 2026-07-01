import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import type { LigneBudget } from '../types/ligneBudget'

export function useLignesBudget(idCompte: string, idBudget: string) {
  return useQuery({
    queryKey: ['lignes', idBudget],
    queryFn: async () => {
      const { data } = await apiClient.get<LigneBudget[]>(
        `/budgets/${idBudget}/lignes`,
        { params: { idCompte } } 
      )
      return data
    },
    enabled: !!idCompte && !!idBudget, 
  })
}