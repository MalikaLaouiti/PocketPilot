package com.PocketPilot.project.planObjectif;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.PocketPilot.project.budget.*;
import com.PocketPilot.project.ligneBudget.CategorieDepense;
import com.PocketPilot.project.ligneBudget.LigneBudget;
import com.PocketPilot.project.objectifFinancier.*;
import com.PocketPilot.project.propositionReduction.PropositionReduction;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PlanService {

    private final ObjectifRepository objectifRepository;
    private final PlanRepository planObjectifRepository;
    private final BudgetRepository budgetRepository;

    /**
     * Ordre de priorité de réduction des catégories.
     * Les catégories SANTE et FACTURE ne sont jamais réduites (règle métier
     * stricte).
     */
    private static final List<CategorieDepense> ORDRE_REDUCTION = List.of(
            CategorieDepense.LOISIR,
            CategorieDepense.SHOPPING,
            CategorieDepense.AUTRE,
            CategorieDepense.TRANSPORT);

    /**
     * Taux de réduction progressif par catégorie (en pourcentage décimal).
     */
    private static final Map<CategorieDepense, BigDecimal> TAUX_REDUCTION = Map.of(
            CategorieDepense.LOISIR, new BigDecimal("0.30"),
            CategorieDepense.SHOPPING, new BigDecimal("0.25"),
            CategorieDepense.AUTRE, new BigDecimal("0.20"),
            CategorieDepense.TRANSPORT, new BigDecimal("0.15"));

    /**
     * Point d'entrée principal : génère le plan d'épargne pour un objectif donné.
     */

    public PlanObjectif genererPlan(UUID idObjectif) {
        ObjectifFinancier objectif = chargerObjectif(idObjectif);
        Budget budget = chargerBudgetPrevisionnel(objectif);

        long nombreMoisRestants = calculerNombreMoisRestants(objectif.getDateCible());
        BigDecimal montantRestant = calculerMontantRestant(objectif);
        BigDecimal epargneMensuelleNecessaire = calculerEpargneMensuelleNecessaire(montantRestant, nombreMoisRestants);
        BigDecimal epargnePrevue = budget.getEpargnePrevue();
        BigDecimal deficit = epargneMensuelleNecessaire.subtract(epargnePrevue);

        List<PropositionReduction> propositions = new ArrayList<>();
        BigDecimal reductionTotale = BigDecimal.ZERO;
        boolean atteignable;

        if (deficit.compareTo(BigDecimal.ZERO) <= 0) {
            // L'épargne prévue couvre déjà l'objectif → aucune réduction nécessaire
            atteignable = true;
        } else {
            // Il manque du budget → proposer des réductions sur catégories non essentielles
            propositions = genererPropositionsReduction(budget.getLignesBudget(), deficit);
            reductionTotale = calculerReductionTotale(propositions);
            atteignable = reductionTotale.compareTo(deficit) >= 0;
        }

        Integer moisNecessaires = calculerMoisNecessairesAvecPlan(
                montantRestant, epargnePrevue, reductionTotale);

        String commentaire = genererCommentaire(atteignable, propositions, moisNecessaires);

        PlanObjectif plan = construirePlan(
                objectif, budget,epargneMensuelleNecessaire, reductionTotale,atteignable, moisNecessaires,commentaire, propositions);

        PlanObjectif planSauvegarde = planObjectifRepository.save(plan);

        objectif.setPlanObjectif(planSauvegarde);
        objectifRepository.save(objectif);

        return planSauvegarde;
    }

    @Transactional(readOnly = true)
    public PlanObjectif getPlanParObjectif(UUID idObjectif) {
        return planObjectifRepository
                .findByObjectifFinancier_IdObjectif(idObjectif)
                .orElseThrow(() -> new RuntimeException("Plan introuvable pour objectif: " + idObjectif));
    }

    // =========================================================================
    // MÉTHODES PRIVÉES — Logique métier décomposée (SRP)
    // =========================================================================

    /**
     * Charge l'objectif ou lève une exception si introuvable.
     */
    private ObjectifFinancier chargerObjectif(UUID idObjectif) {
        return objectifRepository.findById(idObjectif)
                .orElseThrow(() -> new RuntimeException(
                        "Aucun objectif trouvé pour l'ID : " + idObjectif));
    }

    private Budget chargerBudgetPrevisionnel(ObjectifFinancier objectif) {
        return budgetRepository
                .findTopByCompte_IdCompteOrderByDateGenerationDesc(
                        objectif.getCompte().getIdCompte())
                .orElseThrow(() -> new RuntimeException(
                        "Aucun budget trouvé pour le compte : " + objectif.getCompte().getIdCompte()));
    }

    /**
     * Calcule le nombre de mois entre aujourd'hui et la date cible.
     * Lève une exception si la date est déjà passée.
     */
    private long calculerNombreMoisRestants(LocalDate dateCible) {
        long mois = ChronoUnit.MONTHS.between(LocalDate.now(), dateCible);
        if (mois <= 0) {
            throw new RuntimeException("La date cible est déjà dépassée.");
        }
        return mois;
    }

    /**
     * Calcule le montant restant à épargner.
     * montantRestant = montantCible - montantAccumule
     */
    private BigDecimal calculerMontantRestant(ObjectifFinancier objectif) {
        return objectif.getMontantCible()
                .subtract(objectif.getMontantAccumule())
                .max(BigDecimal.ZERO);
    }

    /**
     * Calcule l'épargne mensuelle nécessaire pour atteindre l'objectif dans les
     * délais.
     * epargneMensuelleNecessaire = montantRestant / nombreMoisRestants
     */
    private BigDecimal calculerEpargneMensuelleNecessaire(BigDecimal montantRestant, long nombreMois) {
        return montantRestant.divide(BigDecimal.valueOf(nombreMois), 3, RoundingMode.CEILING);
    }

    /**
     * Génère les propositions de réduction en parcourant les catégories
     * par ordre de priorité (LOISIR → SHOPPING → AUTRE → TRANSPORT).
     *
     * S'arrête dès que le déficit est comblé pour minimiser l'impact sur le client.
     */
    private List<PropositionReduction> genererPropositionsReduction(
            List<LigneBudget> lignes,
            BigDecimal deficitInitial) {
        // Indexer les lignes par catégorie pour un accès O(1)
        Map<CategorieDepense, LigneBudget> lignesParCategorie = lignes.stream()
                .filter(l -> ORDRE_REDUCTION.contains(l.getCategorie()))
                .collect(Collectors.toMap(
                        LigneBudget::getCategorie,
                        l -> l));

        List<PropositionReduction> propositions = new ArrayList<>();
        BigDecimal deficitRestant = deficitInitial;

        for (CategorieDepense categorie : ORDRE_REDUCTION) {
            if (deficitRestant.compareTo(BigDecimal.ZERO) <= 0)
                break;

            LigneBudget ligne = lignesParCategorie.get(categorie);
            if (ligne == null || ligne.getMontantPrevu().compareTo(BigDecimal.ZERO) == 0)
                continue;

            PropositionReduction proposition = construireProposition(ligne, categorie);
            propositions.add(proposition);

            deficitRestant = deficitRestant.subtract(proposition.getReduction());
        }

        return propositions;
    }

    /**
     * Construit une PropositionReduction pour une ligne de budget donnée.
     * Applique le taux de réduction défini dans TAUX_REDUCTION.
     */
    private PropositionReduction construireProposition(
            LigneBudget ligne,
            CategorieDepense categorie) {
        BigDecimal taux = TAUX_REDUCTION.get(categorie);
        BigDecimal montantActuel = ligne.getMontantPrevu();
        BigDecimal reduction = montantActuel.multiply(taux).setScale(3, RoundingMode.HALF_UP);
        BigDecimal montantPropose = montantActuel.subtract(reduction);
        BigDecimal pourcentage = taux.multiply(new BigDecimal("100")).setScale(2, RoundingMode.HALF_UP);

        return PropositionReduction.builder()
                .categorie(categorie)
                .montantActuel(montantActuel)
                .montantPropose(montantPropose)
                .reduction(reduction)
                .pourcentageReduction(pourcentage)
                .build();
    }

    /**
     * Somme toutes les réductions proposées pour obtenir le gain mensuel total.
     */
    private BigDecimal calculerReductionTotale(List<PropositionReduction> propositions) {
        return propositions.stream()
                .map(PropositionReduction::getReduction)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Calcule le nombre de mois nécessaires pour atteindre l'objectif
     * en tenant compte de l'épargne prévue + les réductions proposées.
     *
     * moisNecessaires = montantRestant / (epargnePrevue + reductionTotale)
     */
    private Integer calculerMoisNecessairesAvecPlan(
            BigDecimal montantRestant,
            BigDecimal epargnePrevue,
            BigDecimal reductionTotale) {
        BigDecimal capaciteMensuelle = epargnePrevue.add(reductionTotale);
        if (capaciteMensuelle.compareTo(BigDecimal.ZERO) <= 0)
            return null;

        return montantRestant
                .divide(capaciteMensuelle, 0, RoundingMode.CEILING)
                .intValue();
    }

    /**
     * Génère un commentaire automatique en langage naturel décrivant le plan.
     */
    private String genererCommentaire(
            boolean atteignable,
            List<PropositionReduction> propositions,
            Integer moisNecessaires) {
        if (propositions.isEmpty() && atteignable) {
            return "Votre épargne prévue est suffisante pour atteindre cet objectif sans aucune réduction. Continuez ainsi !";
        }

        String categoriesConcernees = propositions.stream()
                .map(p -> p.getCategorie().name().toLowerCase())
                .collect(Collectors.joining(", "));

        if (atteignable) {
            return String.format(
                    "En réduisant principalement les dépenses de %s, l'objectif peut être atteint dans %d mois.",
                    categoriesConcernees, moisNecessaires);
        } else {
            return String.format(
                    "Même en réduisant les dépenses de %s, l'objectif reste difficile à atteindre dans les délais impartis. "
                            +
                            "Envisagez d'augmenter vos revenus ou d'allonger la date cible.",
                    categoriesConcernees);
        }
    }

    /**
     * Assemble l'entité PlanObjectif finale avec toutes ses données calculées.
     */
    private PlanObjectif construirePlan(
            ObjectifFinancier objectif,
            Budget budget,
            BigDecimal epargneMensuelleNecessaire,
            BigDecimal reductionTotale,
            boolean atteignable,
            Integer moisNecessaires,
            String commentaire,
            List<PropositionReduction> propositions) {
        PlanObjectif plan = PlanObjectif.builder()
                .objectifFinancier(objectif)
                .budgetPrevisionnel(budget)
                .epargneMensuelleNecessaire(epargneMensuelleNecessaire)
                .reductionMensuelleTotale(reductionTotale)
                .objectifAtteignable(atteignable)
                .nombreMoisNecessaires(moisNecessaires)
                .dateGeneration(LocalDateTime.now())
                .commentaire(commentaire)
                .propositionsReduction(propositions)
                .build();

        // Lier chaque proposition au plan parent
        propositions.forEach(p -> p.setPlanObjectif(plan));

        return plan;
    }
}