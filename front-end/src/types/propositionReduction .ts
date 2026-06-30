import type { CategorieDepense } from "./enums"

export interface PropositionReduction {
  id: string
  categorie: CategorieDepense
  montantActuel: number
  montantPropose: number
  reduction: number
  pourcentageReduction: number
}