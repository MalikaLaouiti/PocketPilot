package com.PocketPilot.project.analyse;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalyseRepository extends JpaRepository<AnalyseMensuelle, UUID> {
    
}
