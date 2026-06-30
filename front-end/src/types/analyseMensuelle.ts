import type { CompteBancaire } from "./compte"

export interface AnalyseMensuelle {
  idAnalyse: string
  compte: CompteBancaire
  mois: number
  annee: number
  revenuTotal: number
  depenseTotale: number
  epargneTotale: number
  tauxEpargne: number
  dateGeneration: string     // LocalDateTime
  periodeAnalyse: number | null
}