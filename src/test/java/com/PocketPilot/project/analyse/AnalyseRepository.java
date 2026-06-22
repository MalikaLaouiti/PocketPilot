package com.PocketPilot.project.analyse;

import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.PocketPilot.project.transaction.Transaction;

public interface AnalyseRepository extends JpaRepository<AnalyseMensuelle, Long> {
    
}
