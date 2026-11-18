package com.PocketPilot.project.ai;

import tools.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private final RestClient http;
    private final List<String> models;

    public GeminiService(@Value("${gemini.api-key}") String apiKey,
                         @Value("${gemini.models}") List<String> models) {
        this.models = models;
        this.http = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta")
                .defaultHeader("x-goog-api-key", apiKey)
                .build();
    }

    public String call(String systemPrompt, String userPrompt) {
        Map<String, Object> body = Map.of(
                "systemInstruction", Map.of("parts", List.of(Map.of("text", systemPrompt))),
                "contents", List.of(Map.of("parts", List.of(Map.of("text", userPrompt)))));

        RuntimeException last = null;
        for (String model : models) {
            try {
                JsonNode res = http.post()
                        .uri("/models/{m}:generateContent", model)
                        .body(body)
                        .retrieve()
                        .body(JsonNode.class);
                return res.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText();
            } catch (RestClientResponseException e) {
                // 429 / 5xx (surcharge) -> modèle suivant ; autres erreurs (clé invalide, requête...) -> on s'arrête
                if (e.getStatusCode().value() != 429 && !e.getStatusCode().is5xxServerError()) throw e;
                last = e;
            } catch (ResourceAccessException e) { // timeout / réseau
                last = e;
            }
        }
        throw new IllegalStateException("Tous les modèles Gemini sont indisponibles : " + models, last);
    }
}
