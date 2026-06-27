package com.PocketPilot.project.budget;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.PocketPilot.project.ligneBudget.LigneBudget;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/comptes/{idCompte}/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    /**
     * POST /api/comptes/{idCompte}/budgets/generer
     *
     * Génère le budget prévisionnel du mois suivant.
     * Si le budget existe déjà → 200 OK avec l'existant.
     * Si nouvellement créé       → 201 Created.
     */
    @PostMapping("/generer")
    public ResponseEntity<Budget> genererBudget(@PathVariable UUID idCompte) {
        boolean existantAvant = budgetService.existeBudgetMoisSuivant(idCompte);
        Budget budget = budgetService.genererBudgetMoisSuivant(idCompte);
        HttpStatus status = existantAvant ? HttpStatus.OK : HttpStatus.CREATED;
        return ResponseEntity.status(status).body(budget);
    }

    /**
     * GET /api/comptes/{idCompte}/budgets
     *
     * Liste tous les budgets du compte, triés du plus récent au plus ancien.
     */
    @GetMapping
    public ResponseEntity<List<Budget>> getBudgets(@PathVariable UUID idCompte) {
        return ResponseEntity.ok(budgetService.getBudgetsParCompte(idCompte));
    }

    /**
     * GET /api/comptes/{idCompte}/budgets/{idBudget}
     *
     * Retourne un budget par son identifiant.
     */
    @GetMapping("/{idBudget}")
    public ResponseEntity<Budget> getBudget(@PathVariable UUID idCompte,
                                            @PathVariable UUID idBudget) {
        return ResponseEntity.ok(budgetService.getBudget(idBudget));
    }

    /**
     * GET /api/comptes/{idCompte}/budgets/{idBudget}/lignes
     *
     * Retourne les lignes de budget détaillées.
     */
    @GetMapping("/{idBudget}/lignes")
    public ResponseEntity<List<LigneBudget>> getLignes(@PathVariable UUID idCompte,
                                                        @PathVariable UUID idBudget) {
        return ResponseEntity.ok(budgetService.getLignesParBudget(idBudget));
    }
}