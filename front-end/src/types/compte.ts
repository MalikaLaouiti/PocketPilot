import type { Client } from "./client"

export interface CompteBancaire {
  idCompte: string
  client: Client
  rib: string
  iban: string
  typeCompte: string
  soldeActuel: number       // BigDecimal -> number, attention aux arrondis JS
  devise: string             // défaut "TND"
  dateOuverture: string      // "YYYY-MM-DD"
  statut: string
  plafondRetraitJournalier: number
}