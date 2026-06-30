import type { PropositionReduction } from "./propositionReduction "

export interface PlanObjectif {
  idPlan: string
  epargneMensuelleNecessaire: number
  reductionMensuelleTotale: number
  objectifAtteignable: boolean
  nombreMoisNecessaires: number | null
  dateGeneration: string     // LocalDateTime
  commentaire: string | null
  propositionsReduction: PropositionReduction[]
}