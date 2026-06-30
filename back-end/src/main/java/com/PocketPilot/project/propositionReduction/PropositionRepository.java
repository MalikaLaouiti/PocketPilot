package com.PocketPilot.project.propositionReduction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.PocketPilot.project.ligneBudget.CategorieDepense;

import java.util.List;
import java.util.UUID;

@Repository
public interface PropositionRepository extends JpaRepository<PropositionReduction, UUID> {

    List<PropositionReduction> findByPlanObjectif_IdPlan(UUID idPlan);

    List<PropositionReduction> findByPlanObjectif_IdPlanAndCategorie(UUID idPlan, CategorieDepense categorie);
}