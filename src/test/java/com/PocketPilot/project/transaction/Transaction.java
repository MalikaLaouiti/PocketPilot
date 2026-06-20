package com.PocketPilot.project.transaction;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Table(name = "transaction")
@Data
public class Transaction {

    @Id
    @Column(name = "idtransaction")
    private UUID idTransaction;

    @Column(name = "idcompte")
    private UUID idCompte;

    @Column(length = 30)
    private String reference;

    @Column(name = "datetransaction")
    private LocalDateTime dateTransaction;

    @Column(precision = 15, scale = 3)
    private BigDecimal montant;

    @Column(name = "typetransaction", length = 10)
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