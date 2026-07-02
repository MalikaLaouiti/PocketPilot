import type { NiveauScore } from '../../types/constants/scoreSante'

interface Config { label: string; colorScheme: string; hex: string }

export const NIVEAU_SCORE_CONFIG: Record<NiveauScore, Config> = {
  EXCELLENT: { label: 'Excellent', colorScheme: 'green',  hex: '#38A169' },
  BON:       { label: 'Bon',       colorScheme: 'teal',   hex: '#319795' },
  MOYEN:     { label: 'Moyen',     colorScheme: 'orange', hex: '#D69E2E' },
  FAIBLE:    { label: 'Faible',    colorScheme: 'orange', hex: '#DD6B20' },
  CRITIQUE:  { label: 'Critique',  colorScheme: 'red',    hex: '#E53E3E' },
}