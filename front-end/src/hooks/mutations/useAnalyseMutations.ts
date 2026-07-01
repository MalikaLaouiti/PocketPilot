import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../api/client'
import type { AnalyseMensuelle } from '../../types/analyseMensuelle'

export function useGenererAnalyse(idCompte: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ year, month }: { year: number; month: number }) =>
      apiClient.post<AnalyseMensuelle>(`/analyse/generate`, null, {
        params: { idCompte, year, month }
      }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['analyse', idCompte] }),
  })
}

export function useDeleteAnalyse(idCompte: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (idAnalyse: string) =>
      apiClient.delete(`/analyse/${idAnalyse}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['analyse', idCompte] }),
  })
}