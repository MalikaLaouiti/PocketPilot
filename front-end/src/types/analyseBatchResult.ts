import type { AnalyseMensuelle } from "./analyseMensuelle"

export interface AnalyseBatchResult {
  periode: string           
  totalSucces: number
  totalEchecs: number
  analyses: AnalyseMensuelle[]
  erreurs: string[]
}