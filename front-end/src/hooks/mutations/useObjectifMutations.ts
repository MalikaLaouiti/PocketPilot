import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../api/client'
import type { ObjectifFinancier } from '../../types/objectifFinancier'
import type { PlanObjectif } from '../../types/planObjectif'

type CreateObjectifPayload = Omit<ObjectifFinancier, 'idObjectif' | 'planObjectif' | 'tauxProgression' | 'dateAtteinte'>

export function useCreerObjectif(idCompte: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateObjectifPayload) =>
      apiClient.post<ObjectifFinancier>(`/objectifs?idCompte=${idCompte}`, payload).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['objectifs', idCompte] }),
  })
}

export function useUpdateObjectif(idCompte: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ idObjectif, payload }: { idObjectif: string; payload: Partial<ObjectifFinancier> }) =>
      apiClient.put<ObjectifFinancier>(`/objectifs/${idObjectif}`, payload).then(r => r.data),
    onSuccess: (_, { idObjectif }) => {
      qc.invalidateQueries({ queryKey: ['objectifs', idCompte] })
      qc.invalidateQueries({ queryKey: ['objectif', idObjectif] })
    },
  })
}

export function useDeleteObjectif(idCompte: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (idObjectif: string) =>
      apiClient.delete(`/objectifs/${idObjectif}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['objectifs', idCompte] }),
  })
}

export function useGenererPlan(idCompte: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (idObjectif: string) =>
      apiClient.post<PlanObjectif>(`/objectifs/${idObjectif}/plan`).then(r => r.data),
    onSuccess: (_, idObjectif) => {
      // Invalide l'objectif car planObjectif est maintenant imbriqué dedans
      qc.invalidateQueries({ queryKey: ['objectifs', idCompte] })
      qc.invalidateQueries({ queryKey: ['objectif', idObjectif] })
    },
  })
}