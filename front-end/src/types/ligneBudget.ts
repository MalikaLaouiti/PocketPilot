import type { CategorieDepense } from "./enums"

export interface LigneBudget {
  idLigne: string
  categorie: CategorieDepense
  montantPrevu: number
  montantDepense: number | null
  pourcentageSalaire: number | null
  pourcentageDepense: number | null
}