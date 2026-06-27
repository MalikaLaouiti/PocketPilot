package com.PocketPilot.project.budget;

import com.PocketPilot.project.analyse.AnalyseMensuelle;
import com.PocketPilot.project.analyse.AnalyseRepository;
import com.PocketPilot.project.ligneBudget.*;
import com.PocketPilot.project.transaction.Transaction;
import com.PocketPilot.project.transaction.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BudgetService {

    /**
     * Poids de pondération par ancienneté (index 0 = mois le plus récent).
     * N-1 : 50 %  |  N-2 : 33 %  |  N-3 : 17 %
     */
    private static final double[] POIDS = {0.50, 0.33, 0.17};

    private final BudgetRepository      budgetRepository;
    private final LigneRepository ligneBudgetRepository;
    private final AnalyseRepository     analyseRepository;
    private final TransactionRepository transactionRepository;

    // ─────────────────────────────────────────────────────────────────────────
    // Génération du budget prévisionnel
    // ─────────────────────────────────────────────────────────────────────────

    @Transactional
    public Budget genererBudgetMoisSuivant(UUID idCompte) {

        // Charger les 3 dernières analyses en premier
        List<AnalyseMensuelle> analyses = analyseRepository
                .findTop3ByCompte_IdCompteOrderByAnneeDescMoisDesc(idCompte);

        if (analyses.isEmpty()) {
            throw new IllegalStateException(
                    "Impossible de générer un budget : aucune analyse disponible pour le compte " + idCompte);
        }

        // FIX 1 — mois cible = mois suivant le plus récent mois analysé (pas YearMonth.now())
        AnalyseMensuelle analyseRecente = analyses.get(0);
        YearMonth moisCible = YearMonth.of(analyseRecente.getAnnee(), analyseRecente.getMois()).plusMonths(1);
        int mois  = moisCible.getMonthValue();
        int annee = moisCible.getYear();

        // Budget déjà existant → on le retourne sans écraser
        Optional<Budget> existant = budgetRepository
                .findByCompte_IdCompteAndMoisAndAnnee(idCompte, mois, annee);
        if (existant.isPresent()) {
            log.info("[Budget] Compte={} — budget {}/{} déjà existant, retour sans modification.",
                    idCompte, mois, annee);
            return existant.get();
        }

        BigDecimal revenuPrevu = calculerRevenuPrevu(analyses);
        List<LigneBudget> lignes = calculerLignes(idCompte, analyses, revenuPrevu);

        // FIX 2 — compte récupéré depuis l'analyse (déjà chargé, jamais null)
        Budget budget = Budget.builder()
                .compte(analyseRecente.getCompte())
                .mois(mois)
                .annee(annee)
                .revenuPrevu(revenuPrevu)
                .statut(StatutBudget.PREVU)
                .dateGeneration(LocalDateTime.now())
                .build();

        lignes.forEach(budget::addLigne);
        budget.recalculerTotaux();

        // FIX 3 — pourcentageDepense = part de chaque catégorie dans le total des dépenses prévues
        // calculé ici après recalculerTotaux() pour avoir depensePrevue disponible
        BigDecimal totalDepenses = budget.getDepensePrevue();
        budget.getLignesBudget().forEach(l -> l.calculerPourcentageDepense(totalDepenses));

        Budget saved = budgetRepository.save(budget);
        log.info("[Budget] Compte={} — budget {}/{} généré ({} lignes, revenu prévu={}).",
                idCompte, mois, annee, lignes.size(), revenuPrevu);
        return saved;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Lecture
    // ─────────────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public boolean existeBudgetMoisSuivant(UUID idCompte) {
        List<AnalyseMensuelle> analyses = analyseRepository
                .findTop3ByCompte_IdCompteOrderByAnneeDescMoisDesc(idCompte);
        if (analyses.isEmpty()) return false;
        AnalyseMensuelle recente = analyses.get(0);
        YearMonth moisCible = YearMonth.of(recente.getAnnee(), recente.getMois()).plusMonths(1);
        return budgetRepository.existsByCompte_IdCompteAndMoisAndAnnee(
                idCompte, moisCible.getMonthValue(), moisCible.getYear());
    }

    @Transactional(readOnly = true)
    public Budget getBudget(UUID idBudget) {
        return budgetRepository.findById(idBudget)
                .orElseThrow(() -> new NoSuchElementException("Budget introuvable : " + idBudget));
    }

    @Transactional(readOnly = true)
    public List<Budget> getBudgetsParCompte(UUID idCompte) {
        return budgetRepository.findByCompte_IdCompteOrderByAnneeDescMoisDesc(idCompte);
    }

    @Transactional(readOnly = true)
    public List<LigneBudget> getLignesParBudget(UUID idBudget) {
        return ligneBudgetRepository.findByBudget_IdBudget(idBudget);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Calculs internes
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Revenu prévu = moyenne simple des revenuTotal des analyses disponibles.
     */
    private BigDecimal calculerRevenuPrevu(List<AnalyseMensuelle> analyses) {
        BigDecimal somme = analyses.stream()
                .map(AnalyseMensuelle::getRevenuTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return somme.divide(BigDecimal.valueOf(analyses.size()), 3, RoundingMode.HALF_UP);
    }

    /**
     * Pour chaque catégorie présente sur les 3 mois, calcule le montantPrevu
     * via une moyenne pondérée normalisée.
     */
    private List<LigneBudget> calculerLignes(UUID idCompte,
                                              List<AnalyseMensuelle> analyses,
                                              BigDecimal revenuPrevu) {

        Map<String, BigDecimal> depensesParCle = new HashMap<>();

        for (AnalyseMensuelle analyse : analyses) {
            LocalDateTime debut = LocalDateTime.of(analyse.getAnnee(), analyse.getMois(), 1, 0, 0);
            LocalDateTime fin   = debut.plusMonths(1).minusSeconds(1);

            List<Transaction> transactions = transactionRepository
                    .findByCompte_IdCompteAndDateTransactionBetween(idCompte, debut, fin);

            for (Transaction t : transactions) {
                if (!"DEPENSE".equals(t.getTypeTransaction())) continue;
                if (t.getCategorie() == null) continue;
                String cle = analyse.getAnnee() + "-" + analyse.getMois()
                             + "-" + t.getCategorie();
                depensesParCle.merge(cle, t.getMontant().abs(), BigDecimal::add);
            }
        }

        Set<CategorieDepense> categories = depensesParCle.keySet().stream()
                .map(cle -> CategorieDepense.valueOf(cle.split("-")[2]))
                .collect(Collectors.toSet());

        List<LigneBudget> lignes = new ArrayList<>();

        for (CategorieDepense categorie : categories) {

            BigDecimal numerateur = BigDecimal.ZERO;
            double     sommePoids = 0.0;

            for (int i = 0; i < analyses.size(); i++) {
                AnalyseMensuelle a = analyses.get(i);
                String cle = a.getAnnee() + "-" + a.getMois() + "-" + categorie.name();
                BigDecimal montantMois = depensesParCle.get(cle);

                if (montantMois != null) {
                    double poids = POIDS[i];
                    numerateur  = numerateur.add(montantMois.multiply(BigDecimal.valueOf(poids)));
                    sommePoids += poids;
                }
            }

            BigDecimal montantPrevu = sommePoids > 0
                    ? numerateur.divide(BigDecimal.valueOf(sommePoids), 3, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;

            LigneBudget ligne = LigneBudget.builder()
                    .categorie(categorie)
                    .montantPrevu(montantPrevu)
                    .montantDepense(BigDecimal.ZERO)
                    .build();

            ligne.calculerPourcentageSalaire(revenuPrevu);
            lignes.add(ligne);
        }

        lignes.sort(Comparator.comparing(LigneBudget::getMontantPrevu).reversed());
        return lignes;
    }
}