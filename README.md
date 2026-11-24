# ArtXplore — Venue Map (my contribution)

ArtXplore is a full-stack web app built by a four-person team for the **CS2701 Group Project (2025/26)** at Brunel University of London (Group B20, Startup 1). It addresses **UN SDG 11: Sustainable Cities & Communities**. The problem we picked: local artists and cultural projects often go unnoticed and lose places to show their work. ArtXplore helps artists find, save and book venues across London.

This repository is my copy of the project. It focuses on the part I owned: the **Venues Map** page, front to back.

> **My role:** Full-stack developer for the Venues Map feature (React + Leaflet front end, Spring Boot + PostgreSQL venues API). On the project-management side I wrote the project backlog and the first sprint plan, organised team meetings and ran the Agile retrospective.

---

## What I built

### Sprint 1: Interactive map (front end)

| Task | Description | Status |
|---|---|---|
| 002-1 | Integrated **Leaflet.js** with OpenStreetMap tiles, centred on London | ✅ |
| 002-2 | Map layers and venue markers with popups (image, name, address, save button) | ✅ |
| 002-4 | Responsive map layout for mobile (`@media` breakpoints) | ✅ |
| 002-5 | Search bar, venue-type filters, saved-venues panel and the rest of the page UI | ✅ |

**Page features** (`front-end/src/pages/Map.jsx`):
- **Filter by venue type**: Galleries, Museums, Theatres, Music Venues, Cultural Centres. The map re-centres on the results.
- **Search by venue name**: matching venues appear as pins and the map zooms to the first result.
- **Saved venues ("favourites")**: save or unsave from a marker popup. A side panel lists saved venues, and a toggle shows all of them on the map with a separate marker style.
- **Recently viewed**: clicking a marker adds the venue to a "recently viewed" list.
- **Reset filters** button, loading state and user-friendly error messages ("No venues found", etc.).
- A local image set for the featured London venues (`front-end/public/venues/`), with a fallback image.

### Sprint 2: Venues API (back end)

| Task | Description |
|---|---|
| Design-002-1 | Data model for venues, saved venues and venue views |
| Design-002-3 | ER/UML diagram for the venue tables (`design/database-uml.md`) |
| Backend-002-1 | REST endpoints that return venues, saved venues and recently viewed venues |
| Backend-002-2 | Filtering and search logic for the map API |

The front end calls these endpoints (base path `/api/v1/venues`):

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/venues` | All venues for the map |
| `GET` | `/api/v1/venues/search?query=` | Search venues by name (returns IDs) |
| `POST` | `/api/v1/venues/details` | Full details for a list of venue IDs |
| `GET` | `/api/v1/venues/saved/{userId}` | IDs of a user's saved venues |
| `POST` | `/api/v1/venues/saved/{userId}/{venueId}` | Save a venue |
| `DELETE` | `/api/v1/venues/saved/{userId}/{venueId}` | Remove a saved venue |
| `GET` | `/api/v1/venues/viewed/{userId}` | IDs of recently viewed venues |

**Back-end design.** The API follows a strict layered (DDD-style) architecture:

```
presentation   → VenueController + request/response DTOs (VenueMapQueryDto, VenueResponseDto, …)
application    → VenueService (use-case logic, filtering/search)
domain         → Venue, VenueType, SavedVenue models + repository interfaces (ports)
infrastructure → JPA entities (VenueEntity, SavedVenueEntity, VenueViewEntity),
                 Spring Data repositories and repository adapters
```

- Controllers never touch JPA entities. All API contracts go through DTOs.
- `SavedVenue` uses a **composite primary key** (`user_id`, `venue_id`), so a venue can't be saved twice.
- Schema changes go through **Liquibase** changelogs, and venue seed data is loaded from `db/changelog/generated/0001-venues-local.yaml`.
- Errors go through one shared global handler (`GlobalExceptionHandler`), which returns a single JSON error format with a trace ID.
- CORS is configured so the Vite dev server can reach the API.

---

## Tech stack

**Front end:** React 18, Vite 5, React Router 7, Leaflet 1.9
**Back end:** Java 21, Spring Boot 3.5 (Web, Validation, Security, Data JPA), Hibernate, PostgreSQL, Liquibase, Redis, Maven, Docker
**Process:** Scrum (two sprints), GitHub branching workflow

---

## Running locally

**Prerequisites:** Node 18+, Java 21, Maven, PostgreSQL (and Redis, which the back end expects)

```bash
# 1. Back end
cd cs2701-2025-26-groupb20-startup1-main/back-end
cp .env.example .env            # fill in your PostgreSQL / Redis details
set -a && source .env && set +a
mvn spring-boot:run             # API on http://localhost:8080; Liquibase creates and seeds the tables

# 2. Front end (new terminal)
cd cs2701-2025-26-groupb20-startup1-main/front-end
npm install
npm run dev                     # open the URL Vite prints, then go to the Map page
```

---

## Project structure (key files)

```
cs2701-2025-26-groupb20-startup1-main/
├── front-end/
│   ├── src/pages/Map.jsx          # Venues Map page (my main front-end work)
│   ├── src/lib/api.js             # API client: venue/saved/viewed calls
│   └── public/venues/             # Venue images
├── back-end/
│   ├── src/main/java/.../artxplore/
│   │   ├── presentation/api/v1/venues/   # VenueController + DTOs
│   │   ├── application/venues/service/   # VenueService
│   │   ├── domain/                       # Venue models + repository ports
│   │   └── infrastructure/persistence/   # JPA entities, repositories, adapters
│   └── src/main/resources/db/changelog/  # Liquibase migrations + venue seed data
└── design/database-uml.md                # Database UML (Mermaid)
```

---

## Current limitations and next steps

- Authentication on the front end is still a stub, so the map uses a fixed demo user ID for saved and recently viewed venues. Next step: take the user ID from the authenticated session.
- Remembering the user's last search in a cookie (Sprint 2 task Backend-002-4) is planned but not implemented yet.
- Back-end unit and integration tests (JUnit 5 / Testcontainers are already set up in `pom.xml`) still need to be written.

---

## Team

| Name | Main contribution |
|---|---|
| **Oleksandra Denysenko** | Venues Map (front end + venues API), project backlog, sprint planning, meetings, retrospective |
| Zaara Ahad | Home page, Catalogue (filtering and booking), Lean Canvas |
| Mikhail Babunashvili | Authentication, Profile page, GitHub and back-end bootstrap, database schema |
| Antonio-Andrei Dutu | Discover Upcoming Events page, peer reviews |

Tutor: Dr Isabel Sassoon. Built for module CS2701, Brunel University of London.
