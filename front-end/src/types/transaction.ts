import type { CompteBancaire } from "./compte"

export interface Transaction {
  idTransaction: string
  compte: CompteBancaire
  reference: string
  dateTransaction: string    // LocalDateTime -> "YYYY-MM-DDTHH:mm:ss"
  montant: number
  typeTransaction: string
  canal: string
  description: string
  commercant: string
  categorie: string
  statut: string
  devise: string
}