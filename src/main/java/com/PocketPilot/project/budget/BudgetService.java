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

    private final BudgetRepository budgetRepository ;
    private final AnalyseRepository analyseRepository;
    private final TransactionRepository transactionRepository;
    private final CompteRepository compteRepository;

    public BudgetService(BudgetRepository budgetRepository,
                         AnalyseRepository analyseRepository,
                         TransactionRepository transactionRepository,
                         CompteRepository compteRepository) {
        this.budgetRepository = budgetRepository;
        this.analyseRepository = analyseRepository;
        this.transactionRepository = transactionRepository;
        this.compteRepository = compteRepository;
    }
    // ── Générer le budget M+1 depuis les 3 dernières analyses ────────────────
    public Budget genererBudget(UUID idCompte) {

        // 1. Récupérer les 3 dernières analyses
        List<AnalyseMensuelle> fenetre = analyseRepository
                .findTop3ByCompte_IdCompteOrderByAnneeDescMoisDesc(idCompte);

        System.out.println("Fenetre analyses: " + fenetre.size());
        

        if (fenetre.size() < 3) {
            throw new RuntimeException("Minimum 3 analyses mensuelles requises");
        }

        // 2. Déterminer le mois cible (M+1 après la plus récente)
        AnalyseMensuelle plusRecente = fenetre.get(0);
        YearMonth moisCible = YearMonth.of(plusRecente.getAnnee(), plusRecente.getMois())
                                       .plusMonths(1);
        System.out.println("Mois cible: " + moisCible.getMonthValue() + "/" + moisCible.getYear());

        // 3. Anti-doublon
        if (budgetRepository.existsByCompte_IdCompteAndMoisAndAnnee(
                idCompte, moisCible.getMonthValue(), moisCible.getYear())) {
            return budgetRepository.findByCompte_IdCompteAndMoisAndAnnee(
                    idCompte, moisCible.getMonthValue(), moisCible.getYear()).get();
        }

        CompteBancaire compte = fenetre.get(0).getCompte();

        // 4. Calculer le revenuMensuel = AVG des revenus CREDIT sur 3 mois
        BigDecimal revenuMensuel = calculerRevenuMoyen(idCompte, fenetre);

        // 5. Générer les lignes par catégorie
        List<LigneBudget> lignes = genererLignes(idCompte, fenetre, revenuMensuel);

        // 6. Calculer les champs dérivés du budget
        BigDecimal depenseTotale = lignes.stream()
                .map(LigneBudget::getMontantPrevu)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal epargneReelle = revenuMensuel.subtract(depenseTotale);

        Double tauxDepense = revenuMensuel.compareTo(BigDecimal.ZERO) > 0
                ? depenseTotale.divide(revenuMensuel, 4, RoundingMode.HALF_UP).doubleValue()
                : 0.0;
        System.out.println("Revenu mensuel: " + revenuMensuel);
        System.out.println("Dépense totale: " + depenseTotale);
        // 7. Construire et persister le budget
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

        Budget saved = budgetRepository.save(budget);

        budget.getLignesBudget().addAll(lignes);
        lignes.forEach(l -> l.setBudget(budget));

        return budgetRepository.save(saved);
    }

    // ── AVG revenus CREDIT sur les 3 mois ────────────────────────────────────
    private BigDecimal calculerRevenuMoyen(UUID idCompte, List<AnalyseMensuelle> fenetre) {
        BigDecimal total = fenetre.stream()
                .map(AnalyseMensuelle::getRevenuTotal)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return total.divide(BigDecimal.valueOf(fenetre.size()), 3, RoundingMode.HALF_UP);
    }

    // ── Générer les lignes par catégorie ─────────────────────────────────────
    private List<LigneBudget> genererLignes(UUID idCompte,
                                             List<AnalyseMensuelle> fenetre,
                                             BigDecimal revenuMensuel) {

        // Récupérer toutes les transactions DEBIT des 3 mois
        List<Transaction> toutesTransactions = new ArrayList<>();
        for (AnalyseMensuelle analyse : fenetre) {
            YearMonth ym = YearMonth.of(analyse.getAnnee(), analyse.getMois());
            LocalDateTime start = ym.atDay(1).atStartOfDay();
            LocalDateTime end   = ym.atEndOfMonth().atTime(23, 59, 59);
            toutesTransactions.addAll(
                transactionRepository.findByCompte_IdCompteAndDateTransactionBetween(
                    idCompte, start, end).stream()
                    .filter(t -> "DEBIT".equalsIgnoreCase(t.getTypeTransaction()))
                    .filter(t -> "VALIDE".equalsIgnoreCase(t.getStatut()))
                    .collect(Collectors.toList())
            );
        }

        // Grouper par catégorie
        Map<CategorieDepense, List<Transaction>> parCategorie = toutesTransactions.stream()
                .collect(Collectors.groupingBy(t ->
                    CategorieDepense.valueOf(t.getCategorie().toUpperCase())));

        List<LigneBudget> lignes = new ArrayList<>();

        for (Map.Entry<CategorieDepense, List<Transaction>> entry : parCategorie.entrySet()) {
            CategorieDepense categorie = entry.getKey();
            List<Transaction> txCategorie = entry.getValue();

            // Montant prévu = moyenne des dépenses de cette catégorie sur 3 mois
            BigDecimal totalCategorie = txCategorie.stream()
                    .map(Transaction::getMontant)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal montantPrevu = totalCategorie.divide(
                    BigDecimal.valueOf(fenetre.size()), 3, RoundingMode.HALF_UP);

            // Seuil d'alerte : 110% du montant prévu par défaut
            double alerteSeuil = montantPrevu.doubleValue() * 1.10;

            // Calcul pourcentages
            double pourcentageSalaire = revenuMensuel.compareTo(BigDecimal.ZERO) > 0
                    ? montantPrevu.divide(revenuMensuel, 4, RoundingMode.HALF_UP).doubleValue()
                    : 0.0;

            LigneBudget ligne = new LigneBudget();
            ligne.setIdLigne(UUID.randomUUID());
            ligne.setCategorie(categorie);
            ligne.setMontantPrevu(montantPrevu);
            ligne.setMontantDepense(BigDecimal.ZERO);   // pas encore réalisé
            ligne.setPourcentageSalaire(pourcentageSalaire);
            ligne.setPourcentageDepense(0.0);           // recalculé après
            ligne.setAlerteSeuil(alerteSeuil);

            lignes.add(ligne);
        }

        // Recalculer pourcentageDepense sur le total des lignes
        BigDecimal depenseTotale = lignes.stream()
                .map(LigneBudget::getMontantPrevu)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (depenseTotale.compareTo(BigDecimal.ZERO) > 0) {
            lignes.forEach(l -> l.setPourcentageDepense(
                l.getMontantPrevu()
                 .divide(depenseTotale, 4, RoundingMode.HALF_UP)
                 .doubleValue()
            ));
        }

        return lignes;
    }

    // ── Détection récurrence : même commercant dans ≥ 2 mois distincts ───────
//     private boolean detecterRecurrence(List<Transaction> transactions, int nbMois) {
//         // Grouper par commercant, compter dans combien de mois distincts il apparaît
//         Map<String, Long> moisParCommercant = transactions.stream()
//                 .filter(t -> t.getCommercant() != null && !t.getCommercant().isBlank())
//                 .collect(Collectors.groupingBy(
//                         Transaction::getCommercant,
//                         Collectors.collectingAndThen(
//                                 Collectors.mapping(
//                                         t -> YearMonth.from(t.getDateTransaction()),
//                                         Collectors.toSet()),
//                                 set -> (long) set.size()
//                         )
//                 ));

//         // Récurrent si au moins un commercant apparaît dans ≥ 2 mois sur 3
//         return moisParCommercant.values().stream()
//                 .anyMatch(count -> count >= 2);
//     }

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
