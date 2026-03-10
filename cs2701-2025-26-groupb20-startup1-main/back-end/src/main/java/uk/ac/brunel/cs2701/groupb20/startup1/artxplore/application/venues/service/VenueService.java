package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.application.venues.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.domain.core.model.VenueType;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.domain.venue.repository.VenueRepository;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.persistence.jpa.entity.VenueEntity;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class VenueService {

    private static final int RECENT_VIEWS_LIMIT = 2;

    private final VenueRepository venueRepository;

    public VenueService(VenueRepository venueRepository) {
        this.venueRepository = venueRepository;
    }

    @Transactional(readOnly = true)
    public List<UUID> getVenueIdsWithinBounds(
            BigDecimal minLatitude,
            BigDecimal maxLatitude,
            BigDecimal minLongitude,
            BigDecimal maxLongitude
    ) {
        return venueRepository.findVenueIdsWithinBounds(minLatitude, maxLatitude, minLongitude, maxLongitude);
    }

    @Transactional(readOnly = true)
    public List<UUID> getVenueIdsWithinBoundsAndTypes(
            BigDecimal minLatitude,
            BigDecimal maxLatitude,
            BigDecimal minLongitude,
            BigDecimal maxLongitude,
            List<VenueType> types
    ) {
        if (types == null || types.isEmpty()) {
            return venueRepository.findVenueIdsWithinBounds(
                    minLatitude,
                    maxLatitude,
                    minLongitude,
                    maxLongitude
            );
        }

        return venueRepository.findVenueIdsWithinBoundsAndTypes(
                minLatitude,
                maxLatitude,
                minLongitude,
                maxLongitude,
                types
        );
    }

    @Transactional(readOnly = true)
    public boolean isVenueSaved(UUID venueId, UUID userId) {
        return venueRepository.isVenueSavedByUser(venueId, userId);
    }

    @Transactional
    public void saveVenue(UUID venueId, UUID userId) {
        if (venueRepository.isVenueSavedByUser(venueId, userId)) {
            return;
        }
        venueRepository.saveVenueForUser(venueId, userId);
    }

    @Transactional
    public void unsaveVenue(UUID venueId, UUID userId) {
        venueRepository.removeSavedVenue(venueId, userId);
    }

    @Transactional(readOnly = true)
    public List<UUID> getSavedVenueIds(UUID userId) {
        return venueRepository.findSavedVenueIdsByUser(userId);
    }

    @Transactional
    public void recordVenueView(UUID venueId, UUID userId) {
        venueRepository.recordVenueView(venueId, userId);
    }

    @Transactional(readOnly = true)
    public List<UUID> getRecentlyViewedVenueIds(UUID userId) {
        return venueRepository.findRecentlyViewedVenueIds(userId, RECENT_VIEWS_LIMIT);
    }

    @Transactional(readOnly = true)
    public List<UUID> searchVenueIdsByName(String query) {
        return venueRepository.findVenueIdsByNameContaining(query);
    }
}