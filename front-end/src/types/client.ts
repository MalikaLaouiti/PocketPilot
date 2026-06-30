export interface Client {
  idClient: string          // UUID
  cin: string
  nom: string
  prenom: string
  dateNaissance: string     // LocalDate -> "YYYY-MM-DD"
  telephone: string
  email: string
  adresse: string
  profession: string
}