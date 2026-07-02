package com.PocketPilot.project.score;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.PocketPilot.project.analyse.*;
import com.PocketPilot.project.budget.*;
import com.PocketPilot.project.comptebancaire.*;
import com.PocketPilot.project.objectifFinancier.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
@Transactional
public class ScoreService {

    private static final int POIDS_PAR_FACTEUR = 25;

    private final ScoreRepository scoreRepository;
    private final CompteRepository compteRepository;
    private final BudgetRepository budgetRepository;
    private final AnalyseRepository analyseMensuelleRepository;
    private final ObjectifRepository objectifRepository;

   
    public ScoreFinancier calculerScoreMoisCourant(UUID idCompte) {
        LocalDate aujourdhui = LocalDate.now();
        System.out.println("Calcul du score pour le mois courant : " + (aujourdhui.getMonthValue()-1) + "/" + aujourdhui.getYear());
        return calculerScorePourMois(idCompte, aujourdhui.getMonthValue()-1, aujourdhui.getYear());
    }
    
    public ScoreFinancier calculerScorePourMois(UUID idCompte, Integer mois, Integer annee) {
        CompteBancaire compte = chargerCompte(idCompte);

        // Chargement des deux sources de données
        Budget budget = chargerBudget(idCompte, mois, annee);
        AnalyseMensuelle analyse = chargerAnalyse(idCompte, mois, annee);

        // Calcul des 4 taux (chacun entre 0.0 et 1.0)
        double tauxDiscipline  = calculerTauxDisciplineBudgetaire(budget, analyse);
        double tauxEpargne     = calculerTauxCapaciteEpargne(budget, analyse);
        double tauxObjectifs   = calculerTauxProgressionObjectifs(idCompte);
        double tauxRegularite  = calculerTauxRegulariteRevenus(idCompte);

        // Agrégation en score global sur 100
        int scoreGlobal = calculerScoreGlobal(tauxDiscipline, tauxEpargne, tauxObjectifs, tauxRegularite);
        NiveauScore niveau = determinerNiveau(scoreGlobal);

        // Création ou mise à jour du score existant pour ce mois
        ScoreFinancier score = scoreRepository
                .findByCompte_IdCompteAndMoisAndAnnee(idCompte, mois, annee)
                .orElse(ScoreFinancier.builder()
                        .compte(compte)
                        .mois(mois)
                        .annee(annee)
                        .build());

        score.setScoreGlobal(scoreGlobal);
        score.setNiveau(niveau);
        score.setTauxDisciplineBudgetaire(tauxDiscipline);
        score.setTauxCapaciteEpargne(tauxEpargne);
        score.setTauxProgressionObjectifs(tauxObjectifs);
        score.setTauxRegulariteRevenus(tauxRegularite);
        score.setDateCalcul(LocalDateTime.now());

        return scoreRepository.save(score);
    }

    
    @Transactional(readOnly = true)
    public ScoreFinancier getDernierScore(UUID idCompte) {
        return scoreRepository
                .findTopByCompte_IdCompteOrderByAnneeDescMoisDesc(idCompte)
                .orElseThrow(() -> new RuntimeException(
                        "Aucun score calculé pour ce compte. " +
                        "Appelez d'abord POST /api/scores/calculer?idCompte=" + idCompte));
    }

    
    @Transactional(readOnly = true)
    public List<ScoreFinancier> getHistoriqueScores(UUID idCompte) {
        return scoreRepository.findByCompte_IdCompteOrderByAnneeDescMoisDesc(idCompte);
    }

    
    @Transactional(readOnly = true)
    public List<ScoreFinancier> getTendance(UUID idCompte, int nombreMois) {
        return scoreRepository.findDerniersScores(idCompte, nombreMois);
    }

    
    @Transactional(readOnly = true)
    public List<ScoreFinancier> getScoresParAnnee(UUID idCompte, Integer annee) {
        return scoreRepository.findByCompte_IdCompteAndAnneeOrderByMoisAsc(idCompte, annee);
    }

    private double calculerTauxDisciplineBudgetaire(Budget budget,
                                                     AnalyseMensuelle analyse) {
        BigDecimal prevue = budget.getDepensePrevue();
        BigDecimal reelle = analyse.getDepenseTotale();

        if (prevue == null || prevue.compareTo(BigDecimal.ZERO) == 0) return 0.0;
        if (reelle == null || reelle.compareTo(BigDecimal.ZERO) == 0) return 1.0;

        // Dépenses réelles dans le budget → score parfait
        if (reelle.compareTo(prevue) <= 0) return 1.0;

        // Dépassement → score proportionnel au dépassement
        double taux = prevue.divide(reelle, 6, RoundingMode.HALF_UP).doubleValue();
        return Math.max(0.0, Math.min(1.0, taux));
    }

    private double calculerTauxCapaciteEpargne(Budget budget,
                                                AnalyseMensuelle analyse) {
        BigDecimal prevue = budget.getEpargnePrevue();
        BigDecimal reelle = analyse.getEpargneTotale();

        if (prevue == null || prevue.compareTo(BigDecimal.ZERO) == 0) return 0.0;
        if (reelle == null || reelle.compareTo(BigDecimal.ZERO) <= 0) return 0.0;
        if (reelle.compareTo(prevue) >= 0) return 1.0;

        double taux = reelle.divide(prevue, 6, RoundingMode.HALF_UP).doubleValue();
        return Math.max(0.0, Math.min(1.0, taux));
    }

    private double calculerTauxProgressionObjectifs(UUID idCompte) {
        List<ObjectifFinancier> objectifs = objectifRepository
                .findByCompte_IdCompteAndStatut(idCompte, StatutObjectif.EN_COURS);

        if (objectifs.isEmpty()) return 0.5;

        double moyenne = objectifs.stream()
                .filter(o -> o.getTauxProgression() != null)
                .mapToDouble(o -> o.getTauxProgression().doubleValue())
                .average()
                .orElse(50.0);

        return Math.max(0.0, Math.min(1.0, moyenne / 100.0));
    }

    private double calculerTauxRegulariteRevenus(UUID idCompte) {
        List<AnalyseMensuelle> dernieresAnalyses = analyseMensuelleRepository.findTop3ByCompte_IdCompteOrderByAnneeDescMoisDesc(idCompte);

        if (dernieresAnalyses.size() < 2) return 0.5;

        List<Double> revenus = dernieresAnalyses.stream()
                .filter(a -> a.getRevenuTotal() != null)
                .map(a -> a.getRevenuTotal().doubleValue())
                .toList();

        if (revenus.size() < 2) return 0.5;

        double moyenne = revenus.stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);

        if (moyenne == 0.0) return 0.0;

        double variance = revenus.stream()
                .mapToDouble(r -> Math.pow(r - moyenne, 2))
                .average()
                .orElse(0.0);

        double ecartType = Math.sqrt(variance);
        double coefficientVariation = ecartType / moyenne;

        return Math.max(0.0, 1.0 - Math.min(coefficientVariation, 1.0));
    }

    private int calculerScoreGlobal(double discipline, double epargne,
                                     double objectifs, double regularite) {
        double total = (discipline + epargne + objectifs + regularite) * POIDS_PAR_FACTEUR;
        return (int) Math.max(0, Math.min(100, Math.round(total)));
    }


    private NiveauScore determinerNiveau(int score) {
        if (score <= 20) return NiveauScore.CRITIQUE;
        if (score <= 40) return NiveauScore.FAIBLE;
        if (score <= 60) return NiveauScore.MOYEN;
        if (score <= 80) return NiveauScore.BON;
        return NiveauScore.EXCELLENT;
    }

    private CompteBancaire chargerCompte(UUID idCompte) {
        return compteRepository.findById(idCompte)
                .orElseThrow(() -> new RuntimeException("Compte introuvable : " + idCompte));
    }

    private Budget chargerBudget(UUID idCompte, Integer mois, Integer annee) {
        return budgetRepository
                .findByCompte_IdCompteAndMoisAndAnnee(idCompte, mois, annee)
                .orElse(budgetRepository.findTopByCompte_IdCompteOrderByDateGenerationDesc(idCompte)
                        .orElseThrow(() -> new RuntimeException(
                                "Aucun budget trouvé pour le mois "
                                + mois + "/" + annee + ". Générez d'abord le budget mensuel.")));
    }

    private AnalyseMensuelle chargerAnalyse(UUID idCompte, Integer mois, Integer annee) {
        return analyseMensuelleRepository
                .findByCompte_IdCompteAndMoisAndAnnee(idCompte, mois, annee)
                .orElseThrow(() -> new RuntimeException(
                        "Aucune analyse mensuelle trouvée pour le mois "
                        + mois + "/" + annee + ". Générez d'abord l'analyse mensuelle."));
    }
}