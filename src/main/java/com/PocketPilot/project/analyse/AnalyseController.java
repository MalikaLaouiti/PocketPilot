package com.PocketPilot.project.analyse;

import org.springframework.web.bind.annotation.*;
import com.PocketPilot.project.transaction.Transaction;

import java.time.YearMonth;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/analyse")
public class AnalyseController {
    private final AnalyseService analyseService;

    public AnalyseController(AnalyseService analyseService) {
        this.analyseService = analyseService;
    }
    
    @GetMapping("/monthly")
    public List<Transaction> getMonthlyTransactions(
            @RequestParam UUID idCompte,
            @RequestParam int year,
            @RequestParam int month) {
        return analyseService.afficherTransactions(idCompte, YearMonth.of(year, month));
    }

    @PostMapping("/generate")
    public AnalyseMensuelle generateAnalyse(
            @RequestParam UUID idCompte,
            @RequestParam int year,
            @RequestParam int month) {
        return analyseService.genererAnalyse(idCompte, YearMonth.of(year, month));
    }

    @GetMapping("/result")
    public AnalyseMensuelle getAnalyse(
            @RequestParam UUID idCompte,
            @RequestParam int year,
            @RequestParam int month) {
        return analyseService.getAnalyse(idCompte, YearMonth.of(year, month));
    }

}
