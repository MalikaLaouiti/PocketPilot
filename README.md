# PocketPilot

Application de gestion de finances personnelles : suivi des transactions, budgets mensuels, objectifs d'épargne
avec plan d'épargne automatique, score de santé financière et conseils générés par IA.

## Fonctionnalités

- **Transactions** : enregistrement et catégorisation des revenus et des dépenses.
- **Budgets** : budget prévisionnel mensuel avec une ligne par catégorie de dépense.
- **Objectifs financiers** : montant et date cibles, avec un plan d'épargne qui propose des réductions de dépenses
  (loisirs, shopping, autre, transport ; la santé et les factures ne sont jamais réduites).
- **Analyse et score** : revenus, dépenses et taux d'épargne mensuels, ainsi qu'un score de santé financière.
- **Conseil IA** : court conseil sur chaque objectif, généré par Google Gemini à partir de l'objectif, du dernier
  budget et du plan. Seuls des chiffres sont envoyés au modèle (ni nom, ni email, ni identifiant).

## Technologies

| Partie | Pile |
|---|---|
| Back end | Java 21, Spring Boot 4, Spring Data JPA, PostgreSQL, Gradle |
| Front end | React 18, TypeScript, Vite, Chakra UI, TanStack Query, Recharts |
| IA | Google AI Studio (Gemini) via REST, avec une liste de modèles de secours |
| Déploiement | Docker (back end), Render |

## Structure du projet

```
pocket/
├── back-end/    API Spring Boot (com.PocketPilot.project.*)
└── front-end/   Application React
```

## Démarrage

### Prérequis

- JDK 21
- Node.js 18+
- PostgreSQL

### Back end

Créez `back-end/src/main/resources/application-local.properties` (ignoré par Git, ne le commitez jamais) :

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/pocketpilot
spring.datasource.username=VOTRE_UTILISATEUR_BD
spring.datasource.password=VOTRE_MOT_DE_PASSE_BD

gemini.api-key=VOTRE_CLE_AI_STUDIO
gemini.models=gemini-3.8-flash,gemini-3.5-flash-lite,gemini-2.5-flash
```

Lancement (PowerShell) :

```powershell
cd back-end
$env:SPRING_PROFILES_ACTIVE="local"; ./gradlew bootRun
```

L'API est disponible sur `http://localhost:8080`.

### Front end

Créez `front-end/.env.local` :

```
VITE_API_BASE_URL=http://localhost:8080/api
```

```bash
cd front-end
npm install
npm run dev
```

## Configuration

| Variable | Utilisation | Obligatoire |
|---|---|---|
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | Connexion à la base de données en production | Oui |
| `GEMINI_API_KEY` | Clé Google AI Studio | Oui |
| `GEMINI_MODELS` | Liste de modèles séparés par des virgules, essayés dans l'ordre | Non (valeur par défaut dans le code) |
| `VITE_API_BASE_URL` | URL de l'API utilisée par le front end | Oui |

Modèles de secours : si un modèle répond 429, 5xx ou dépasse le délai, le modèle suivant de la liste est essayé.
Les autres erreurs (clé invalide, par exemple) sont renvoyées telles quelles.

## Aperçu de l'API

Toutes les routes sont sous `/api`.

| Route | Rôle |
|---|---|
| `/clients`, `/comptes` | Clients et comptes bancaires |
| `/transactions` | Transactions |
| `/budgets` | Budgets mensuels et lignes de budget |
| `/objectifs` | Objectifs financiers et plan d'épargne (`/objectifs/{id}/plan`) |
| `/analyse` | Analyse mensuelle |
| `/scores` | Score de santé financière |
| `GET /ai/conseil?idObjectif=` | Conseil IA pour un objectif |
| `POST /ai/test` | Appel de test libre à l'IA (corps : `objectif`, `budgetPrevisionnel`, `prompt`) |

## Déploiement

- **Back end** : construit avec `back-end/dockerfile` et lancé avec le profil `production`. Définissez les variables
  d'environnement ci-dessus sur l'hébergeur (par exemple Render, onglet Environment).
- **Front end** : `npm run build`, puis servez le dossier `dist/`.

## Remarques

- Les conseils de l'IA sont indicatifs et ne constituent pas un conseil financier réglementé.
- Ne commitez jamais de clés d'API ni de fichiers `*-local.properties`.
