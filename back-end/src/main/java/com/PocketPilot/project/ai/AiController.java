package com.PocketPilot.project.ai;

import com.PocketPilot.project.budget.Budget;
import com.PocketPilot.project.budget.BudgetRepository;
import com.PocketPilot.project.objectifFinancier.ObjectifFinancier;
import com.PocketPilot.project.objectifFinancier.ObjectifRepository;
import com.PocketPilot.project.planObjectif.PlanObjectif;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * POST /api/ai/test  (endpoint de test Postman)
 * body: {"objectif": "...", "budgetPrevisionnel": "...", "prompt": "..."}  (tous optionnels)
 * → {"reponse": "..."}
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private static final String SYSTEM_PROMPT = """
            Tu es l'assistant financier de PocketPilot, une application de gestion de budget personnel.
            Tu conseilles un client dans l'atteinte de l'objectif financier qu'il a défini, en t'appuyant \
            uniquement sur les données fournies : l'objectif et le dernier budget prévisionnel.

            Règles :
            - Compare le budget prévisionnel à l'objectif : dis si le client est sur la bonne voie et \
            quel est l'écart principal.
            - Propose 1 à 2 actions concrètes, chiffrées et réalistes.
            - Si un plan de réduction est fourni, reprends exactement ses montants et pourcentages et son             verdict (atteignable ou non) ; ne calcule jamais d'autres réductions toi-même.
            - N'invente aucun chiffre ; si une donnée manque, dis-le simplement.
            - Ton professionnel, clair et encourageant, sans jargon, vouvoiement.
            - Réponds en français, en 100 mots maximum et 4 lignes maximum, sans titre ni liste à puces.
            - Ceci est un conseil indicatif, pas un conseil financier réglementé.
            - Les montants sont exprimés en dinars tunisiens (DT), devise de référence pour l’ensemble des opérations financières.
            """;

    private final GeminiService gemini;
    private final ObjectifRepository objectifs;
    private final BudgetRepository budgets;

    /** GET /api/ai/conseil?idObjectif=UUID : conseil basé sur l'objectif et le dernier budget généré du compte. */
    @GetMapping("/conseil")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, String>> conseil(@RequestParam UUID idObjectif) {
        ObjectifFinancier o = objectifs.findById(idObjectif)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Objectif introuvable"));
        Budget b = budgets.findTopByCompte_IdCompteOrderByDateGenerationDesc(o.getCompte().getIdCompte())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aucun budget pour ce compte"));

        // Chiffres uniquement : aucun nom, email ni identifiant n'est envoyé au modèle.
        String objectif = "%s, cible %s, déjà épargné %s, date cible %s, priorité %s, progression %s%%"
                .formatted(o.getTitre(), o.getMontantCible(), o.getMontantAccumule(), o.getDateCible(),
                        o.getPriorite(), o.getTauxProgression());
        PlanObjectif p = o.getPlanObjectif();
        if (p != null) {
            objectif += ", épargne mensuelle nécessaire %s, objectif atteignable avec le plan : %s, délai estimé avec le plan : %s mois. Réductions du plan de réduction (à reprendre telles quelles) : %s"
                    .formatted(p.getEpargneMensuelleNecessaire(), p.getObjectifAtteignable() ? "oui" : "non",
                            p.getNombreMoisNecessaires(),
                            p.getPropositionsReduction().isEmpty() ? "aucune nécessaire"
                                    : p.getPropositionsReduction().stream()
                                            .map(r -> "%s %s → %s (-%s%%)".formatted(r.getCategorie(),
                                                    r.getMontantActuel(), r.getMontantPropose(), r.getPourcentageReduction()))
                                            .collect(Collectors.joining(", ")));
        }
        String budget = "%02d/%d, revenu prévu %s, dépenses prévues %s, épargne prévue %s, taux de dépense %s%%. Détail : %s"
                .formatted(b.getMois(), b.getAnnee(), b.getRevenuPrevu(), b.getDepensePrevue(), b.getEpargnePrevue(),
                        b.getTauxDepense(),
                        b.getLignesBudget().stream()
                                .map(l -> l.getCategorie() + " " + l.getMontantPrevu())
                                .collect(Collectors.joining(", ")));

        return test(Map.of("objectif", objectif, "budgetPrevisionnel", budget,
                "prompt", "Suis-je sur la bonne voie pour atteindre cet objectif ?"));
    }

    @PostMapping("/test")
    public ResponseEntity<Map<String, String>> test(@RequestBody Map<String, String> body) {
        String user = """
                Objectif du client : %s
                Dernier budget prévisionnel : %s
                Question : %s
                """.formatted(
                body.getOrDefault("objectif", "non renseigné"),
                body.getOrDefault("budgetPrevisionnel", "non renseigné"),
                body.getOrDefault("prompt", "Que me conseillez-vous ?"));

        return ResponseEntity.ok(Map.of("reponse", gemini.call(SYSTEM_PROMPT, user)));
    }
}
