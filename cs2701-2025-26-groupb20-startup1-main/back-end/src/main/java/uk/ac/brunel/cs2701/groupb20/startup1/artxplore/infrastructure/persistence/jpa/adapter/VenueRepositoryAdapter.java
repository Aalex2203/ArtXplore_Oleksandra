package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.persistence.jpa.adapter;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.domain.core.model.VenueType;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.domain.venue.repository.VenueRepository;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.persistence.jpa.entity.SavedVenueEntity;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.persistence.jpa.entity.SavedVenueId;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.persistence.jpa.entity.VenueEntity;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.persistence.jpa.entity.VenueViewEntity;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.persistence.jpa.repository.SavedVenueJpaRepository;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.persistence.jpa.repository.VenueJpaRepository;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.persistence.jpa.repository.VenueViewJpaRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class VenueRepositoryAdapter implements VenueRepository {

    private final VenueJpaRepository venueJpaRepository;
    private final SavedVenueJpaRepository savedVenueJpaRepository;
    private final VenueViewJpaRepository venueViewJpaRepository;

    public VenueRepositoryAdapter(
            VenueJpaRepository venueJpaRepository,
            SavedVenueJpaRepository savedVenueJpaRepository,
            VenueViewJpaRepository venueViewJpaRepository
    ) {
        this.venueJpaRepository = venueJpaRepository;
        this.savedVenueJpaRepository = savedVenueJpaRepository;
        this.venueViewJpaRepository = venueViewJpaRepository;
    }

    @Override
    public List<VenueEntity> findAllVenues() {
        return venueJpaRepository.findAll();
    }

    @Override
    public Optional<VenueEntity> findById(UUID venueId) {
        return venueJpaRepository.findById(venueId);
    }

    @Override
    public VenueEntity save(VenueEntity venue) {
        return venueJpaRepository.save(venue);
    }

    @Override
    public List<UUID> findVenueIdsWithinBounds(
            BigDecimal minLatitude,
            BigDecimal maxLatitude,
            BigDecimal minLongitude,
            BigDecimal maxLongitude
    ) {
        return venueJpaRepository.findIdsWithinBounds(
                minLatitude,
                maxLatitude,
                minLongitude,
                maxLongitude
        );
    }

    @Override
    public List<VenueEntity> findVenuesByIds(List<UUID> venueIds) {
        return venueJpaRepository.findAllById(venueIds);
    }

    @Override
    public List<UUID> findVenueIdsWithinBoundsAndTypes(
            BigDecimal minLatitude,
            BigDecimal maxLatitude,
            BigDecimal minLongitude,
            BigDecimal maxLongitude,
            List<VenueType> types
    ) {
        return venueJpaRepository.findIdsWithinBoundsAndTypes(
                minLatitude,
                maxLatitude,
                minLongitude,
                maxLongitude,
                types
        );
    }

    @Override
    public boolean isVenueSavedByUser(UUID venueId, UUID userId) {
        return savedVenueJpaRepository.existsById(new SavedVenueId(userId, venueId));
    }

    @Override
    public void saveVenueForUser(UUID venueId, UUID userId) {
        SavedVenueId id = new SavedVenueId(userId, venueId);

        if (savedVenueJpaRepository.existsById(id)) {
            return;
        }

        SavedVenueEntity saved = new SavedVenueEntity(userId, venueId);
        savedVenueJpaRepository.save(saved);
    }

    @Override
    public void removeSavedVenue(UUID venueId, UUID userId) {
        savedVenueJpaRepository.deleteById(new SavedVenueId(userId, venueId));
    }

    @Override
    public List<UUID> findSavedVenueIdsByUser(UUID userId) {
        return savedVenueJpaRepository.findSavedVenueIdsByUserId(userId);
    }

    @Override
    public void recordVenueView(UUID venueId, UUID userId) {
        VenueViewEntity view = new VenueViewEntity(userId, venueId);
        venueViewJpaRepository.save(view);
    }

    @Override
    public List<UUID> findRecentlyViewedVenueIds(UUID userId, int limit) {
        return venueViewJpaRepository.findRecentVenueIdsByUserId(
                userId,
                PageRequest.of(0, limit)
        );
    }

    @Override
    public List<UUID> findVenueIdsByNameContaining(String query) {
        return venueJpaRepository.findIdsByNameContaining(query);
    }
}