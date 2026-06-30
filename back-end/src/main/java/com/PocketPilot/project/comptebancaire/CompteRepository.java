package com.PocketPilot.project.comptebancaire;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompteRepository extends JpaRepository<CompteBancaire, UUID> {
   CompteBancaire findByClient_IdClient(UUID idClient);
}
