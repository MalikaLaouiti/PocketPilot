import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../api/client'
import type { ObjectifFinancier } from '../../types/constants/objectifFinancier'
import type { PlanObjectif } from '../../types/constants/planObjectif'

export interface CreerObjectifPayload {
  titre: string
  description?: string
  montantCible: number
  dateCible: string
  priorite: string
}

export function useCreerObjectif(idCompte: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreerObjectifPayload) =>
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