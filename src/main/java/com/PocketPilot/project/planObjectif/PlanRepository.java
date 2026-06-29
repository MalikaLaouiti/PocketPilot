package com.PocketPilot.project.planObjectif;


import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanRepository extends JpaRepository<PlanObjectif, UUID> {
   Optional<PlanObjectif> findByObjectifFinancier_IdObjectif(UUID idObjectif);
}
