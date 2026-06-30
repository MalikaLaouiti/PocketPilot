import type { CompteBancaire } from "./compte"
import type { StatutBudget } from "./enums"
import type { LigneBudget } from "./ligneBudget"

export interface Budget {
  idBudget: string
  compte: CompteBancaire
  mois: number
  annee: number
  revenuPrevu: number
  depensePrevue: number
  epargnePrevue: number
  tauxDepense: number
  dateGeneration: string     // LocalDateTime
  statut: StatutBudget
  lignesBudget: LigneBudget[]
}