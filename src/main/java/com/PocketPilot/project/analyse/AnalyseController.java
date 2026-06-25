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
    
    // Génération simple pour tous les comptes
    @PostMapping("/generate/all")
    public List<AnalyseMensuelle> generateAllComptes(
            @RequestParam int year,
            @RequestParam int month) {
        return analyseService.genererAnalyseTousLesComptes(YearMonth.of(year, month));
    }

    // Génération avec rapport succès/échecs
    @PostMapping("/generate/all/batch")
    public AnalyseBatchResult generateBatch(
            @RequestParam int year,
            @RequestParam int month) {
        return analyseService.genererAnalyseBatch(YearMonth.of(year, month));
    }

    @GetMapping("/resultat")
    public List<AnalyseMensuelle> getAnalyseByCompte(@RequestParam(name="idCompte") UUID idCompte) {
        return analyseService.getAnalyseByCompte(idCompte);
    }

}
