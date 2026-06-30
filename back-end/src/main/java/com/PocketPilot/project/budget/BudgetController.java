package com.PocketPilot.project.budget;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.PocketPilot.project.ligneBudget.LigneBudget;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping("/generer")
    public ResponseEntity<Budget> genererBudget(@RequestParam UUID idCompte) {
        boolean existantAvant = budgetService.existeBudgetMoisSuivant(idCompte);
        Budget budget = budgetService.genererBudgetMoisSuivant(idCompte);
        HttpStatus status = existantAvant ? HttpStatus.OK : HttpStatus.CREATED;
        return ResponseEntity.status(status).body(budget);
    }

    @GetMapping
    public ResponseEntity<List<Budget>> getBudgets(@RequestParam UUID idCompte) {
        return ResponseEntity.ok(budgetService.getBudgetsParCompte(idCompte));
    }

    
    @GetMapping("/{idBudget}")
    public ResponseEntity<Budget> getBudget(@RequestParam UUID idCompte,
                                            @PathVariable UUID idBudget) {
        return ResponseEntity.ok(budgetService.getBudget(idBudget));
    }

    @GetMapping("/{idBudget}/lignes")
    public ResponseEntity<List<LigneBudget>> getLignes(@RequestParam UUID idCompte,
                                                        @PathVariable UUID idBudget) {
        return ResponseEntity.ok(budgetService.getLignesParBudget(idBudget));
    }
}