package com.PocketPilot.project.transaction;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    List<Transaction> findByCompte_IdCompte(UUID idCompte);
    List<Transaction> findByCompte_IdCompteAndDateTransactionBetween(
        UUID idCompte,
        LocalDateTime debut,
        LocalDateTime fin
    );
}
