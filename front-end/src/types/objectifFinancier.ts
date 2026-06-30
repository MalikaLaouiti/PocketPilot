import type { NiveauPriorite, StatutObjectif } from "./enums"
import type { PlanObjectif } from "./planObjectif"

export interface ObjectifFinancier {
  idObjectif: string
  titre: string
  description: string | null
  montantCible: number
  montantAccumule: number
  dateCible: string          // LocalDate
  dateAtteinte: string | null
  statut: StatutObjectif
  priorite: NiveauPriorite
  tauxProgression: number | null
  planObjectif: PlanObjectif | null
}