package com.PocketPilot.project.score;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controller REST pour la gestion des scores financiers.
 *
 * Routes :
 *   POST  /api/scores/calculer?idCompte=          → Calcule le score du mois courant
 *   POST  /api/scores/calculer?idCompte=&mois=&annee= → Calcule pour un mois précis
 *   GET   /api/scores/dernier?idCompte=            → Dernier score
 *   GET   /api/scores/historique?idCompte=         → Historique complet
 *   GET   /api/scores/tendance?idCompte=&mois=     → N derniers scores
 *   GET   /api/scores/annee?idCompte=&annee=       → Scores d'une année
 */
@RestController
@RequestMapping("/api/scores")
@RequiredArgsConstructor
public class ScoreController {

    private final ScoreService scoreService;

    @PostMapping("/calculer")
    public ResponseEntity<ScoreFinancier> calculerScore(
            @RequestParam UUID idCompte,
            @RequestParam(required = false) Integer mois,
            @RequestParam(required = false) Integer annee
    ) {
        ScoreFinancier score = (mois != null && annee != null)
                ? scoreService.calculerScorePourMois(idCompte, mois, annee)
                : scoreService.calculerScoreMoisCourant(idCompte);

        return ResponseEntity.ok(score);
    }

    @GetMapping("/dernier")
    public ResponseEntity<ScoreFinancier> getDernierScore(@RequestParam UUID idCompte) {
        return ResponseEntity.ok(scoreService.getDernierScore(idCompte));
    }

    @GetMapping("/historique")
    public ResponseEntity<List<ScoreFinancier>> getHistorique(@RequestParam UUID idCompte) {
        return ResponseEntity.ok(scoreService.getHistoriqueScores(idCompte));
    }

    @GetMapping("/tendance")
    public ResponseEntity<List<ScoreFinancier>> getTendance(
            @RequestParam UUID idCompte,
            @RequestParam(defaultValue = "6") int mois
    ) {
        return ResponseEntity.ok(scoreService.getTendance(idCompte, mois));
    }

    @GetMapping("/annee")
    public ResponseEntity<List<ScoreFinancier>> getScoresParAnnee(
            @RequestParam UUID idCompte,
            @RequestParam Integer annee
    ) {
        return ResponseEntity.ok(scoreService.getScoresParAnnee(idCompte, annee));
    }
}