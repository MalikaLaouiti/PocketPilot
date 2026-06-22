package com.PocketPilot.project.analyse;

import org.springframework.stereotype.Service;

import com.PocketPilot.project.transaction.Transaction;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AnalyseService {
    private final AnalyseRepository analyseRepository;

    public AnalyseService(AnalyseRepository analyseRepository) {
        this.analyseRepository = analyseRepository;
    }

}
