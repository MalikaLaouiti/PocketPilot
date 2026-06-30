import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import type { Transaction } from '../types/transaction'

export function useTransactionsByCompte(idCompte: string) {
  return useQuery({
    queryKey: ['transactions', idCompte],
    queryFn: async () => {
      const { data } = await apiClient.get<Transaction[]>(`/transactions/byCompte/${idCompte}`)
      return data
    },
    enabled: !!idCompte,
  })
}