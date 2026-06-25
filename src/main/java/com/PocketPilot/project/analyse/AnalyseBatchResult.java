package com.PocketPilot.project.analyse;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.YearMonth;
import java.util.List;

@Data
@AllArgsConstructor
public class AnalyseBatchResult {
    private YearMonth periode;
    private int totalSucces;
    private int totalEchecs;
    private List<AnalyseMensuelle> analyses;
    private List<String> erreurs;
}