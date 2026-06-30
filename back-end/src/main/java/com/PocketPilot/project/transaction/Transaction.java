package com.PocketPilot.project.transaction;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.PocketPilot.project.comptebancaire.CompteBancaire;


@Entity
@Table(name = "transaction")
@Data
public class Transaction {

    @Id
    @Column(name = "id_transaction")
    private UUID idTransaction;

    @ManyToOne
    @JoinColumn(name = "id_compte")
    private CompteBancaire compte;

    @Column(length = 30)
    private String reference;

    @Column(name = "date_transaction")
    private LocalDateTime dateTransaction;

    @Column(precision = 15, scale = 3)
    private BigDecimal montant;

    @Column(name = "type_transaction", length = 10)
    private String typeTransaction;

    @Column(length = 20)
    private String canal;

    @Column(length = 100)
    private String description;

    @Column(length = 100)
    private String commercant;

    @Column(length = 20)
    private String categorie;

    @Column(length = 20)
    private String statut;

    @Column(length = 3)
    private String devise = "TND";

}