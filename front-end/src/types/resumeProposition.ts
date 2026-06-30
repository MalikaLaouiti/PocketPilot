import type { PropositionReduction } from "./propositionReduction "

export interface ResumeProposition {
  nombreCategoriesConcernees: number
  gainMensuelTotal: number
  epargneMensuelleNecessaire: number
  objectifAtteignable: boolean
  nombreMoisNecessaires: number | null
  commentaire: string | null
  propositions: PropositionReduction[]
}