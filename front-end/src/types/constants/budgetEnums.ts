import type { CategorieDepense, StatutBudget, NiveauPriorite, StatutObjectif } from '../types/enums'

interface CategorieConfig {
  label: string
  icon: string
  colorScheme: string
}

export const CATEGORIE_CONFIG: Record<CategorieDepense, CategorieConfig> = {
  ALIMENTATION: { label: 'Alimentation & Restaurants', icon: '🍽️', colorScheme: 'orange' },
  TRANSPORT:    { label: 'Transport',                  icon: '🚗', colorScheme: 'blue' },
  FACTURE:      { label: 'Factures & Services',        icon: '🧾', colorScheme: 'purple' },
  LOISIR:       { label: 'Loisirs & Divertissement',   icon: '🎮', colorScheme: 'pink' },
  SHOPPING:     { label: 'Shopping',                   icon: '🛍️', colorScheme: 'teal' },
  SANTE:        { label: 'Santé & Forme',               icon: '🏥', colorScheme: 'red' },
  SALAIRE:      { label: 'Salaire',                     icon: '💰', colorScheme: 'green' },
  AUTRE:        { label: 'Autre',                       icon: '📦', colorScheme: 'gray' },
}

interface StatutConfig {
  label: string
  colorScheme: string
}

export const STATUT_BUDGET_CONFIG: Record<StatutBudget, StatutConfig> = {
  PREVU:    { label: 'Prévisionnel', colorScheme: 'gray' },
  VALIDE:   { label: 'Validé',       colorScheme: 'blue' },
  EN_COURS: { label: 'En cours',     colorScheme: 'orange' },
  CLOTURE:  { label: 'Clôturé',      colorScheme: 'green' },
}

export const STATUT_OBJECTIF_CONFIG: Record<StatutObjectif, StatutConfig> = {
  EN_ATTENTE: { label: 'En attente', colorScheme: 'gray' },
  EN_COURS:   { label: 'En cours',   colorScheme: 'blue' },
  ATTEINT:    { label: 'Atteint',    colorScheme: 'green' },
  ABANDONNE:  { label: 'Abandonné',  colorScheme: 'red' },
}

export const PRIORITE_CONFIG: Record<NiveauPriorite, StatutConfig> = {
  FAIBLE:  { label: 'Faible',  colorScheme: 'gray' },
  NORMALE: { label: 'Normale', colorScheme: 'blue' },
  ELEVEE:  { label: 'Élevée',  colorScheme: 'orange' },
  URGENTE: { label: 'Urgente', colorScheme: 'red' },
}