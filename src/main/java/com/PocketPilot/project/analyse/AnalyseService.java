package com.PocketPilot.project.analyse;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.PocketPilot.project.comptebancaire.*;
import com.PocketPilot.project.transaction.*;

@Service
public class AnalyseService {

        private final AnalyseRepository analyseRepository;
        private final TransactionRepository transactionRepository;
        private final CompteRepository compteRepository;

        public AnalyseService(AnalyseRepository analyseRepository,
                        TransactionRepository transactionRepository,
                        CompteRepository compteRepository) {
                this.analyseRepository = analyseRepository;
                this.transactionRepository = transactionRepository;
                this.compteRepository = compteRepository;
        }

        // ── Récupérer les transactions brutes
        public List<Transaction> afficherTransactions(UUID idCompte, YearMonth mois) {
                LocalDateTime start = mois.atDay(1).atStartOfDay();
                LocalDateTime end = mois.atEndOfMonth().atTime(23, 59, 59);
                return transactionRepository
                                .findByCompte_IdCompteAndDateTransactionBetween(idCompte, start, end);
        }

        // ──Générer et persister l'analyse mensuelle
        public AnalyseMensuelle genererAnalyse(UUID idCompte, YearMonth mois) {

                List<Transaction> transactions = afficherTransactions(idCompte, mois);

                CompteBancaire compte = compteRepository.findById(idCompte)
                                .orElseThrow(() -> new RuntimeException("Compte introuvable : " + idCompte));

                // ── Calcul revenuTotal : somme des CREDIT
                BigDecimal revenuTotal = transactions.stream()
                                .filter(t -> "REVENU".equalsIgnoreCase(t.getTypeTransaction()))
                                .filter(t -> "VALIDE".equalsIgnoreCase(t.getStatut()))
                                .map(Transaction::getMontant)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                // ── Calcul depenseTotale : somme des DEBIT
                BigDecimal depenseTotale = transactions.stream()
                                .filter(t -> "DEPENSE".equalsIgnoreCase(t.getTypeTransaction()))
                                .filter(t -> "VALIDE".equalsIgnoreCase(t.getStatut()))
                                .map(Transaction::getMontant)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                // ── Calcul epargneTotale
                BigDecimal epargneTotale = revenuTotal.subtract(depenseTotale);

                // ── Calcul tauxEpargne
                BigDecimal tauxEpargne = BigDecimal.ZERO;
                if (revenuTotal.compareTo(BigDecimal.ZERO) > 0) {
                        tauxEpargne = epargneTotale
                                        .divide(revenuTotal, 4, RoundingMode.HALF_UP);
                }

                // ── Construction de l'objet
                AnalyseMensuelle analyse = new AnalyseMensuelle();
                analyse.setCompte(compte);
                analyse.setMois(mois.getMonthValue());
                analyse.setAnnee(mois.getYear());
                analyse.setRevenuTotal(revenuTotal);
                analyse.setDepenseTotale(depenseTotale);
                analyse.setEpargneTotale(epargneTotale);
                analyse.setTauxEpargne(tauxEpargne);
                analyse.setDateGeneration(LocalDateTime.now());
                analyse.setPeriodeAnalyse(1);

                return analyseRepository.save(analyse);
        }

        // ──Générer l'analyse pour TOUS les comptes 
        public List<AnalyseMensuelle> genererAnalyseTousLesComptes(YearMonth mois) {

                List<CompteBancaire> comptes = compteRepository.findAll();

                return comptes.stream()
                                .map(compte -> genererAnalyse(compte.getIdCompte(), mois))
                                .collect(Collectors.toList());
        }

        // ──Version avec rapport : succès + échecs
        public AnalyseBatchResult genererAnalyseBatch(YearMonth mois) {

                List<CompteBancaire> comptes = compteRepository.findAll();
                List<AnalyseMensuelle> succes = new ArrayList<>();
                List<String> echecs = new ArrayList<>();

                for (CompteBancaire compte : comptes) {
                        try {
                                AnalyseMensuelle analyse = genererAnalyse(compte.getIdCompte(), mois);
                                succes.add(analyse);
                        } catch (Exception e) {
                                echecs.add("Compte " + compte.getIdCompte() + " : " + e.getMessage());
                        }
                }

                return new AnalyseBatchResult(mois, succes.size(), echecs.size(), succes, echecs);
        }

        @Scheduled(cron = "0 0 1 1 * *")
        public void genererAnalyseMoisPrecedent() {
                YearMonth moisPrecedent = YearMonth.now().minusMonths(1);
                genererAnalyseBatch(moisPrecedent);
        }

        // ──Récupérer une analyse existante pour un compte
        public List<AnalyseMensuelle> getAnalyseByCompte(UUID idCompte) {
                return analyseRepository.findByCompte_IdCompte(idCompte);
        }

}