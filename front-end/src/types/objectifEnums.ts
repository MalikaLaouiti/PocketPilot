import type { NiveauPriorite, StatutObjectif } from '../types/enums'

interface Config { label: string; colorScheme: string }

export const PRIORITE_CONFIG: Record<NiveauPriorite, Config> = {
  FAIBLE:  { label: 'Faible',  colorScheme: 'gray' },
  NORMALE: { label: 'Normale', colorScheme: 'blue' },
  ELEVEE:  { label: 'Élevée',  colorScheme: 'orange' },
  URGENTE: { label: 'Urgente', colorScheme: 'red' },
}

export const STATUT_OBJECTIF_CONFIG: Record<StatutObjectif, Config> = {
  EN_ATTENTE: { label: 'En attente', colorScheme: 'gray' },
  EN_COURS:   { label: 'En cours',   colorScheme: 'blue' },
  ATTEINT:    { label: 'Atteint',    colorScheme: 'green' },
  ABANDONNE:  { label: 'Abandonné',  colorScheme: 'red' },
}