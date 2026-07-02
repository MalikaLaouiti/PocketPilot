import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../api/client'
import type { Client } from '../../types/client'

export function useUpdateClient(idClient: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Client>) =>
      apiClient
        .put<Client>(`/clients/${idClient}`, data)
        .then(res => res.data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['client', idClient],
      })
    },
  })
}