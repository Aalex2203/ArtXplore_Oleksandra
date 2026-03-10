# ArtXPlore Backend Engineering Guide

This document is the backend contract for how we build code in this repository.
It is intentionally strict.

## 1. Frameworks and Core Technologies

- Language: `Java 21`
- Build tool: `Maven`
- Application framework: `Spring Boot 3.5.0`
- API layer: `Spring Web`
- Validation: `Jakarta Validation`
- Security: `Spring Security 6.5` (stateless)
- ORM and persistence: `Spring Data JPA` + `Hibernate`
- Relational DB: `PostgreSQL`
- Migrations: `Liquibase` + `liquibase-hibernate6` diff generation
- Session store: `Redis` (server-side sessions)
- Containerization: `Docker` (`Dockerfile` in this folder)
- Testing: `JUnit 5`, `Mockito`, `Spring Test`, `Spring Security Test`, `Testcontainers`

## 2. Architecture Overview (Single Module, Layered DDD)

The backend uses strict layered architecture with clear dependency direction.

### Layers

- `presentation`
  - REST controllers, request/response DTOs, HTTP mapping concerns only.
- `application`
  - Use-case orchestration, transaction boundaries, application services, application exceptions.
- `domain`
  - Core business model, domain contracts/ports (repository interfaces), domain-level policies.
- `infrastructure`
  - Technical implementations: JPA entities, Spring Data repositories, repository adapters, Redis adapters, security filters/config, framework wiring.

### Dependency Direction (must never be violated)

- `presentation -> application -> domain`
- `infrastructure -> domain` and `infrastructure -> application` only for implementations/wiring
- `domain` must not depend on `presentation` or `infrastructure`
- `application` must not depend on `presentation`

## 2.1 Dependency Injection (Hybrid / Partially Centralized)

Dependency injection uses a hybrid model.

- Central composition root: `src/main/java/uk/ac/brunel/cs2701/groupb20/startup1/artxplore/infrastructure/config/CompositionRootConfig.java`
- This config explicitly wires core interface-to-implementation bindings for:
  - Application services (for example `AuthService`)
  - Domain ports and adapters (for example `UserAccountRepository`, `UserSessionRepository`, `PermissionResolver`)
  - Auth/security pipeline beans (cookie factory, auth filter, auth entry/denied handlers)
- Infrastructure utility beans remain in dedicated config classes (`PasswordConfig`, `RedisConfig`, `AppTimeConfig`, `SecurityConfig`).
- Spring-managed framework endpoints/components stay idiomatic and scan-based where appropriate:
  - Controllers
  - `@RestControllerAdvice`
  - `RequestTraceFilter`
  - Spring Data `JpaRepository` interfaces

Rule: if you add a new domain port adapter or application service implementation, register it in `CompositionRootConfig` instead of relying on stereotype scanning.

## 3. Non-Negotiable Separation Rules

These are hard rules, not suggestions.

1. Controllers must never access JPA repositories directly.
2. Controllers must never contain business logic.
3. Controllers must never return JPA entities.
4. Application services must never accept or return HTTP objects (`HttpServletRequest`, `ResponseEntity`, etc.).
5. Repositories must never contain HTTP or controller code.
6. Repositories must never call other repositories for orchestration logic.
7. Infrastructure entities must never leak into `presentation` contracts.
8. Try-catch blocks must not be copy-pasted in controllers for standard API errors.
9. Error responses must come from the global error pipeline.
10. Security/session concerns must not be mixed into business services unless the use case explicitly requires it.

If a PR violates any rule above, it should be rejected.

## 4. DTO Policy (Mandatory)

DTOs are required for all external API contracts.

### Required

- One request DTO per input contract (e.g., sign-in body).
- One response DTO per output contract.
- Validation annotations on request DTO fields.
- Explicit mapping between domain/application models and DTOs.

### Forbidden

- Returning JPA entities directly from controllers.
- Passing entities directly from controller to service as API contract.
- Reusing one generic DTO for unrelated endpoints.

### Why this is mandatory

- Prevents persistence model leakage into public API.
- Allows independent evolution of database schema and API schema.
- Improves versioning safety and backward compatibility.
- Keeps serialization concerns out of domain/application logic.

## 5. Single Responsibility (Extremely Strict)

Each class must have one reason to change.

### Examples

- Controller class: only HTTP concerns (routing, validation boundary, status codes).
- Application service: only use-case orchestration.
- Repository adapter: only data access mapping and persistence interactions.
- Security filter: only authentication extraction/attachment to security context.
- Error factory: only building standardized error payloads.

### SRP anti-patterns (reject)

- A controller that validates business rules and writes to DB directly.
- A repository class doing auth/session logic.
- A service class building HTTP response payloads.
- One utility class handling logging, mapping, persistence, and validation together.

## 6. Repository, Service, Controller Responsibilities

### Controller (`presentation`)

- Accept request DTOs
- Trigger application service calls
- Return response DTOs
- No domain orchestration logic

### Service (`application`)

- Coordinate use-case flow
- Apply business rules through domain model/contracts
- Control transaction boundaries
- Throw typed application exceptions (no HTTP-specific responses)

### Repository (`domain` + `infrastructure`)

- `domain`: repository interfaces (ports)
- `infrastructure`: implementations/adapters with Spring Data/JPA
- Persist/fetch/map data
- No API response formatting, no controller usage

## 7. Global Error Handling Standard

All API errors must be centralized and traceable.

### Pipeline Components

- `RequestTraceFilter`
  - Creates/propagates `X-Trace-Id`, attaches trace id to request/response, stores in MDC.
- `ApiErrorFactory`
  - Builds unified error payloads for all failure paths.
- `GlobalExceptionHandler`
  - Handles application exceptions, validation errors, malformed JSON, argument issues, unexpected exceptions.
- `JsonAuthenticationEntryPoint`
  - Security `401` responses in the same error shape.
- `JsonAccessDeniedHandler`
  - Security `403` responses in the same error shape.

### Unified Error JSON Contract

```json
{
  "timestamp": "2026-02-23T00:00:00Z",
  "status": 401,
  "error": "Unauthorized",
  "code": "AUTH_UNAUTHORIZED",
  "message": "Authentication is required.",
  "path": "/api/v1/auth/me",
  "traceId": "f7d8b99c-13f2-4c50-8d9a-8d70fb7c06ef"
}
```

### Error Handling Rules

1. Never handcraft ad-hoc error JSON in controllers.
2. Prefer typed application exceptions (`AppException` subclasses) for expected business failures.
3. Include stable machine-readable `code` values.
4. Preserve `traceId` in every error response for observability.

## 8. Security and Session Model (Current)

- Stateless Spring Security configuration.
- Redis-backed server-side session records.
- Session ID sent as `HttpOnly` cookie.
- CSRF currently disabled by design for this phase.
- Permission resolution currently noop/baseline but extensible for RBAC/ABAC.

## 9. Data Model and Migrations

- Liquibase owns schema evolution and applies changes automatically on app startup.
- Changelog master: `src/main/resources/db/changelog/db.changelog-master.yaml`.
- Generated changelog files: `src/main/resources/db/changelog/generated/*.yaml`.
- Initial baseline: `src/main/resources/db/changelog/generated/0001_initial_from_entities.yaml`.
- JPA entities declare relationships and indexes.
- No manual SQL migration writing is required.

### Automatic Migration Workflow (Code-First)

1. Change JPA entities in `infrastructure.persistence.jpa.entity`.
2. Generate migration from entity model diff:
   - `./scripts/generate-migration.sh <migration_name>`
3. Commit generated changelog YAML file.
4. Start the app; Liquibase auto-applies pending migrations.

### Why this satisfies code-first

- Entity classes are the schema source for changes.
- Migration files are generated automatically from model-to-database diff.
- Runtime migration execution is automatic via Liquibase startup integration.

## 10. Coding Dos and Don'ts

### Do

- Keep classes focused and small.
- Add tests when behavior changes.
- Use constructor injection only.
- Register core service/port adapter bindings in `CompositionRootConfig`.
- Keep package boundaries strict.
- Use explicit names for exception codes.
- Add Javadocs to all public methods in `src/main/java`.

### Don't

- Don't mix controller/service/repository concerns.
- Don't place business logic in entities that depends on HTTP/framework classes.
- Don't bypass application services from controllers.
- Don't return inconsistent error payloads.
- Don't swallow exceptions silently.
- Don't merge code that fails Checkstyle documentation checks.

## 10.1 Public Method Documentation Gate (CS1591-style)

- Build enforces Javadocs for public methods via Maven Checkstyle.
- Config file: `config/checkstyle/checkstyle.xml`.
- Maven plugin: `maven-checkstyle-plugin` bound to the `verify` phase.
- Practical rule: if a public method is added without a Javadoc summary, build fails.

## 11. Adding a New Endpoint (Checklist)

1. Create request/response DTOs in `presentation`.
2. Add endpoint method in controller (thin only).
3. Define or extend application service use case.
4. Add domain contracts if needed.
5. Implement infrastructure adapters/repositories.
6. Add typed exception(s) if expected failure modes exist.
7. Ensure failures map through global handler.
8. Add unit tests (controller + service + infrastructure unit where relevant).

## 12. Project Run Notes

### Environment variables (commonly used)

- DB: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- Redis: `REDIS_HOST`, `REDIS_PORT`
- Auth cookie/session: `AUTH_COOKIE_*`, `AUTH_SESSION_TTL`, `AUTH_REDIS_KEY_PREFIX`

### Local `.env` template

- Template file: `back-end/.env.example`
- Local file: `back-end/.env` (not tracked)

Quick start:

1. Copy template:
   - `cd back-end && cp .env.example .env`
2. Update values in `.env` for your PostgreSQL and Redis instances.
3. Load variables into your shell before running the app:
   - `set -a && source .env && set +a`
4. Run:
   - `mvn spring-boot:run`

Note: Spring Boot reads environment variables directly; `.env` is a convenience file and is not auto-loaded by Spring itself.

### Docker

A backend image can be built using the provided `Dockerfile`.

### Auto Migration Command

`./scripts/generate-migration.sh <migration_name>`

The command compiles entity classes and generates a new Liquibase changelog file by diffing:

- Reference schema: JPA entity model (`liquibase-hibernate6`)
- Target schema: configured PostgreSQL database

Examples:

- `./scripts/generate-migration.sh add_artist_social_links`
- `./scripts/generate-migration.sh normalize_event_dates`

Environment variables used by the script:

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

## 13. PR Acceptance Gate

A backend PR is incomplete if any of the following is true:

- Controller touches repository directly.
- JPA entity is used as API response DTO.
- Errors are returned outside global error pipeline.
- No tests added for new behavior.
- Responsibilities are mixed across layers.

Treat this README as architecture policy.
