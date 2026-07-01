import { createContext, useContext, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import type { CompteBancaire } from '../types/compte'

// ID hardcodé pour l'instant, remplacé plus tard par le vrai système d'auth
const ID_COMPTE_ACTIF = '547d84b0-6537-4b85-951d-f6b111acc9e5'

interface CompteContextType {
  idCompte: string
  compte: CompteBancaire | undefined
  isLoading: boolean
  isError: boolean
}

const CompteContext = createContext<CompteContextType | null>(null)

export function CompteProvider({ children }: { children: ReactNode }) {
  const { data: compte, isLoading, isError } = useQuery({
    queryKey: ['compte', ID_COMPTE_ACTIF],
    queryFn: async () => {
      const { data } = await apiClient.get<CompteBancaire>(`/comptes/${ID_COMPTE_ACTIF}`)
      return data
    },
    staleTime: 5 * 60 * 1000, 
  })

  return (
    <CompteContext.Provider value={{ idCompte: ID_COMPTE_ACTIF, compte, isLoading, isError }}>
      {children}
    </CompteContext.Provider>
  )
}

export function useCompteActif() {
  const ctx = useContext(CompteContext)
  if (!ctx) throw new Error('useCompteActif doit être utilisé dans CompteProvider')
  return ctx
}