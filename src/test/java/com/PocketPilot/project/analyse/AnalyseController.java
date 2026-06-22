package com.PocketPilot.project.analyse;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.service.annotation.GetExchange;

import com.PocketPilot.project.transaction.Transaction;

import java.time.LocalDateTime;
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
            @RequestParam(name = "idCompte") UUID idCompte,
            @RequestParam(name = "year") int year,
            @RequestParam(name = "month") int month
    ) {
        return analyseService.afficherTransactions(idCompte, YearMonth.of(year, month));
    }

}
