package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.persistence.jpa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.persistence.jpa.entity.SavedVenueEntity;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.persistence.jpa.entity.SavedVenueId;

import java.util.List;
import java.util.UUID;

public interface SavedVenueJpaRepository extends JpaRepository<SavedVenueEntity, SavedVenueId> {

    /**
     * Returns saved venue IDs for the given user.
     *
     * @param userId user id
     * @return venue ids
     */
    @Query("""
            select s.id.venueId
            from SavedVenueEntity s
            where s.id.userId = :userId
            """)
    List<UUID> findSavedVenueIdsByUserId(@Param("userId") UUID userId);
}