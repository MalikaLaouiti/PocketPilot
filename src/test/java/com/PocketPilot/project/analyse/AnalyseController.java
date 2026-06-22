package com.PocketPilot.project.analyse;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.service.annotation.GetExchange;

import com.PocketPilot.project.transaction.Transaction;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/analyse")
public class AnalyseController {
    private final AnalyseService analyseService;

    public AnalyseController(AnalyseService analyseService) {
        this.analyseService = analyseService;
    }

}
