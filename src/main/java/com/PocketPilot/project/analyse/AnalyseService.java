package com.PocketPilot.project.analyse;

import org.springframework.stereotype.Service;
import com.PocketPilot.project.transaction.*;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.UUID;

@Service
public class AnalyseService {
    private final AnalyseRepository analyseRepository;
    private final TransactionRepository transactionRepository;

    public AnalyseService(AnalyseRepository analyseRepository, TransactionRepository transactionRepository) {
        this.analyseRepository = analyseRepository;
        this.transactionRepository = transactionRepository;
    }

    public List<Transaction> afficherTransactions(UUID idCompte, YearMonth mois) {

        LocalDateTime start = mois.atDay(1).atStartOfDay();
        LocalDateTime end = mois.atEndOfMonth().atTime(23,59,59);

        List<Transaction> transactions =
            transactionRepository.findByCompte_IdCompteAndDateTransactionBetween(
                idCompte, start, end
            );

        return transactions;
}
}
