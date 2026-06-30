package com.PocketPilot.project.propositionReduction;

import com.PocketPilot.project.ligneBudget.CategorieDepense;
import com.PocketPilot.project.planObjectif.PlanObjectif;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "proposition_reduction")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class PropositionReduction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategorieDepense categorie;

    @Column(nullable = false, precision = 15, scale = 3)
    private BigDecimal montantActuel;

    @Column(nullable = false, precision = 15, scale = 3)
    private BigDecimal montantPropose;

    @Column(nullable = false, precision = 15, scale = 3)
    private BigDecimal reduction;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal pourcentageReduction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_plan", nullable = false)
    @JsonIgnore
    private PlanObjectif planObjectif;
}
