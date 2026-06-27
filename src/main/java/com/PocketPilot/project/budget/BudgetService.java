package com.PocketPilot.project.budget;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.PocketPilot.project.analyse.*;
import com.PocketPilot.project.comptebancaire.*;
import com.PocketPilot.project.ligneBudget.CategorieDepense;
import com.PocketPilot.project.ligneBudget.LigneBudget;
import com.PocketPilot.project.transaction.*;

@Service
public class BudgetService {

        private final BudgetRepository budgetRepository;
        private final AnalyseRepository analyseRepository;
        private final TransactionRepository transactionRepository;

        public BudgetService(BudgetRepository budgetRepository,
                        AnalyseRepository analyseRepository,
                        TransactionRepository transactionRepository,
                        CompteRepository compteRepository) {
                this.budgetRepository = budgetRepository;
                this.analyseRepository = analyseRepository;
                this.transactionRepository = transactionRepository;
        }

        // ── Générer le budget M+1 depuis les 3 dernières analyses ────────────────
        public Budget genererBudget(UUID idCompte) {

                // 1. Récupérer les 3 dernières analyses
                List<AnalyseMensuelle> fenetre = analyseRepository
                                .findTop3ByCompte_IdCompteOrderByAnneeDescMoisDesc(idCompte);

                if (fenetre.size() < 3) {
                        throw new RuntimeException("Minimum 3 analyses mensuelles requises");
                }

                // 2. Déterminer le mois cible (M+1 après la plus récente)
                AnalyseMensuelle plusRecente = fenetre.get(0);
                YearMonth moisCible = YearMonth.of(plusRecente.getAnnee(), plusRecente.getMois())
                                .plusMonths(1);

                // 3. Anti-doublon
                return budgetRepository
                                .findByCompte_IdCompteAndMoisAndAnnee(
                                                idCompte, moisCible.getMonthValue(), moisCible.getYear())
                                .orElseGet(() -> construireEtPersisterBudget(idCompte, fenetre, moisCible));
                // ↑ Modification 1 : on utilise orElseGet() au lieu de deux appels séparés
                // existsBy... + findBy... — évite une requête SQL redondante.
        }

        private Budget construireEtPersisterBudget(UUID idCompte, List<AnalyseMensuelle> fenetre,  YearMonth moisCible) {

                CompteBancaire compte = fenetre.get(0).getCompte();

                BigDecimal revenuMensuel = calculerRevenuMoyen(fenetre);

                List<LigneBudget> lignes = genererLignes(idCompte, fenetre, revenuMensuel);

                BigDecimal depenseTotale = lignes.stream()
                                .map(LigneBudget::getMontantPrevu)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal epargneReelle = revenuMensuel.subtract(depenseTotale);

                double tauxDepense = revenuMensuel.compareTo(BigDecimal.ZERO) > 0
                                ? depenseTotale.divide(revenuMensuel, 4, RoundingMode.HALF_UP).doubleValue()
                                : 0.0;

                Budget budget = new Budget();
                budget.setCompte(compte);
                budget.setMois(moisCible.getMonthValue());
                budget.setAnnee(moisCible.getYear());
                budget.setRevenuMensuel(revenuMensuel);
                budget.setDepenseTotale(depenseTotale);
                budget.setEpargneReelle(epargneReelle);
                budget.setTauxDepense(tauxDepense);
                budget.setDateCreation(LocalDateTime.now());
                budget.setStatut(StatutBudget.GENERE);
                budget.setLignesBudget(new ArrayList<>());

                for (LigneBudget ligne : lignes) {
                        ligne.setIdLigne(null);
                        ligne.setBudget(budget);
                        budget.getLignesBudget().add(ligne);
                }

                return budgetRepository.save(budget);
        }

      
        private BigDecimal calculerRevenuMoyen(List<AnalyseMensuelle> fenetre) {
                BigDecimal total = fenetre.stream()
                                .map(AnalyseMensuelle::getRevenuTotal)
                                .filter(Objects::nonNull)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
                return total.divide(BigDecimal.valueOf(fenetre.size()), 3, RoundingMode.HALF_UP);
        }

        // ── Générer les lignes par catégorie 
        private List<LigneBudget> genererLignes(UUID idCompte,
                        List<AnalyseMensuelle> fenetre,
                        BigDecimal revenuMensuel) {

                List<Transaction> toutesTransactions = new ArrayList<>();
                for (AnalyseMensuelle analyse : fenetre) {
                        YearMonth ym = YearMonth.of(analyse.getAnnee(), analyse.getMois());
                        LocalDateTime start = ym.atDay(1).atStartOfDay();
                        LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);

                        transactionRepository
                                        .findByCompte_IdCompteAndDateTransactionBetween(idCompte, start, end)
                                        .stream()
                                        .filter(t -> "DEPENSE".equalsIgnoreCase(t.getTypeTransaction()))
                                        .filter(t -> "VALIDE".equalsIgnoreCase(t.getStatut()))
                                        .forEach(toutesTransactions::add);
                }

                Map<CategorieDepense, List<Transaction>> parCategorie = toutesTransactions.stream()
                                .collect(Collectors.groupingBy(
                                                t -> CategorieDepense.valueOf(t.getCategorie().trim().toUpperCase())));

                List<LigneBudget> lignes = new ArrayList<>();

                for (Map.Entry<CategorieDepense, List<Transaction>> entry : parCategorie.entrySet()) {
                        CategorieDepense categorie = entry.getKey();
                        List<Transaction> txCat = entry.getValue();

                        BigDecimal totalCat = txCat.stream()
                                        .map(Transaction::getMontant)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                        BigDecimal montantPrevu = totalCat.divide(
                                        BigDecimal.valueOf(fenetre.size()), 3, RoundingMode.HALF_UP);

                        BigDecimal  alerteSeuil = montantPrevu.multiply(BigDecimal.valueOf(1.10));

                        BigDecimal pourcentageSalaire = revenuMensuel.compareTo(BigDecimal.ZERO) > 0
                                        ? montantPrevu.divide(revenuMensuel, 4, RoundingMode.HALF_UP)
                                        : BigDecimal.ZERO;
                        BigDecimal pourcentageDepense = BigDecimal.ZERO; 

                        LigneBudget ligne = new LigneBudget();
                        ligne.setCategorie(categorie);
                        ligne.setMontantPrevu(montantPrevu);
                        ligne.setMontantDepense(BigDecimal.ZERO);
                        ligne.setPourcentageSalaire(pourcentageSalaire);
                        ligne.setPourcentageDepense(pourcentageDepense);
                        ligne.setAlerteSeuil(alerteSeuil);

                        lignes.add(ligne);
                }

                BigDecimal depenseTotale = lignes.stream()
                                .map(LigneBudget::getMontantPrevu)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                if (depenseTotale.compareTo(BigDecimal.ZERO) > 0) {
                        lignes.forEach(l -> l.setPourcentageDepense(
                                        l.getMontantPrevu().divide(depenseTotale, 4, RoundingMode.HALF_UP)));
                }

                return lignes;
        }
        

        // ── Consulter un budget existant ─────────────────────────────────────────
        public Budget consulterBudget(UUID idCompte, int mois, int annee) {
                Budget budget = budgetRepository
                                .findByCompte_IdCompteAndMoisAndAnnee(idCompte, mois, annee)
                                .orElseThrow(() -> new RuntimeException("Budget introuvable"));

                // Marquer comme consulté si c'était GENERE
                if (budget.getStatut() == StatutBudget.GENERE) {
                        budget.setStatut(StatutBudget.CONSULTE);
                        budgetRepository.save(budget);
                }

                return budget;
        }
}
