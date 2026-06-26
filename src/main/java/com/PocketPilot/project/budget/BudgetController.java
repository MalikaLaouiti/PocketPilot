package com.PocketPilot.project.budget;

import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/budget")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }
    // Générer le budget M+1 (appelé par un job ou manuellement)
    @PostMapping("/generate")
    public Budget genererBudget(@RequestParam UUID idCompte) {
        return budgetService.genererBudget(idCompte);
    }

    // Client consulte son budget
    @GetMapping
    public Budget consulterBudget(
            @RequestParam UUID idCompte,
            @RequestParam int year,
            @RequestParam int month) {
        return budgetService.consulterBudget(idCompte, month, year);
    }
}
