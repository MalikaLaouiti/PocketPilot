import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";

export function useConseilIA(idObjectif: string, enabled: boolean) {
  return useQuery<string>({
    queryKey: ['conseil-ia', idObjectif],
    queryFn: async () => {
      const { data } = await apiClient.get<{ reponse: string }>('/ai/conseil', { params: { idObjectif } })
      return data.reponse
    },
    enabled: !!idObjectif && enabled,
    staleTime: 10 * 60 * 1000, // évite de rappeler Gemini à chaque ouverture
    retry: false,
  })
}
