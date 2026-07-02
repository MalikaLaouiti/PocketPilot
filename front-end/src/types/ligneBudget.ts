import type { CategorieDepense } from "./constants/enums"

export interface LigneBudget {
  idLigne: string
  categorie: CategorieDepense
  montantPrevu: number
  montantDepense: number | null
  pourcentageSalaire: number | null
  pourcentageDepense: number | null
}