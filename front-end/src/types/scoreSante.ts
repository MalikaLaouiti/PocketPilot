export type NiveauScore = 'EXCELLENT' | 'BON' | 'MOYEN' | 'FAIBLE' | 'CRITIQUE'

export interface ScoreSante {
  idScore: string
  mois: number
  annee: number
  scoreGlobal: number 
  niveau: NiveauScore
  tauxCapaciteEpargne: number       
  tauxProgressionObjectifs : number   
  tauxDisciplineBudgetaire : number 
  tauxRegulariteRevenus : number 
  dateCalcul: string
}