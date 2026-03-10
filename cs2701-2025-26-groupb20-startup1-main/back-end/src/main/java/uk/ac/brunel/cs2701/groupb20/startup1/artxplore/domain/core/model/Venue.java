package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.domain.core.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/** Domain model for a venue. */
public record Venue(
        UUID id,
        String name,
        VenueType type,
        String address,
        String description,
        BigDecimal latitude,
        BigDecimal longitude,
        Integer priceTier,
        String imageUrl,
        Instant createdAt,
        Instant updatedAt
) {}