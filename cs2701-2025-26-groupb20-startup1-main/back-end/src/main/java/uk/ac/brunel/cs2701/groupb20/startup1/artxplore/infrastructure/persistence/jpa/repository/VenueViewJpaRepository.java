package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.persistence.jpa.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.persistence.jpa.entity.VenueViewEntity;

import java.util.List;
import java.util.UUID;

public interface VenueViewJpaRepository extends JpaRepository<VenueViewEntity, UUID> {

    @Query("""
            select v.venueId
            from VenueViewEntity v
            where v.userId = :userId
            order by v.viewedAt desc
            """)
    List<UUID> findRecentVenueIdsByUserId(@Param("userId") UUID userId, Pageable pageable);
}