package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.domain.venue.repository;

import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.domain.core.model.VenueType;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.persistence.jpa.entity.VenueEntity;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface VenueRepository {

    List<VenueEntity> findAllVenues();

    List<UUID> findVenueIdsWithinBounds(
            BigDecimal minLatitude,
            BigDecimal maxLatitude,
            BigDecimal minLongitude,
            BigDecimal maxLongitude
    );

    List<UUID> findVenueIdsWithinBoundsAndTypes(
            BigDecimal minLatitude,
            BigDecimal maxLatitude,
            BigDecimal minLongitude,
            BigDecimal maxLongitude,
            List<VenueType> types
    );

    boolean isVenueSavedByUser(UUID venueId, UUID userId);

    void saveVenueForUser(UUID venueId, UUID userId);

    void removeSavedVenue(UUID venueId, UUID userId);

    List<UUID> findSavedVenueIdsByUser(UUID userId);

    void recordVenueView(UUID venueId, UUID userId);

    List<UUID> findRecentlyViewedVenueIds(UUID userId, int limit);

    List<UUID> findVenueIdsByNameContaining(String query);
}