package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.persistence.jpa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.domain.core.model.VenueType;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.persistence.jpa.entity.VenueEntity;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface VenueJpaRepository extends JpaRepository<VenueEntity, UUID> {

    @Query("""
            select v.id
            from VenueEntity v
            where v.latitude between :minLatitude and :maxLatitude
              and v.longitude between :minLongitude and :maxLongitude
            """)
    List<UUID> findIdsWithinBounds(
            @Param("minLatitude") BigDecimal minLatitude,
            @Param("maxLatitude") BigDecimal maxLatitude,
            @Param("minLongitude") BigDecimal minLongitude,
            @Param("maxLongitude") BigDecimal maxLongitude
    );

    @Query("""
            select v.id
            from VenueEntity v
            where v.latitude between :minLatitude and :maxLatitude
              and v.longitude between :minLongitude and :maxLongitude
              and v.type in :types
            """)
    List<UUID> findIdsWithinBoundsAndTypes(
            @Param("minLatitude") BigDecimal minLatitude,
            @Param("maxLatitude") BigDecimal maxLatitude,
            @Param("minLongitude") BigDecimal minLongitude,
            @Param("maxLongitude") BigDecimal maxLongitude,
            @Param("types") List<VenueType> types
    );

    @Query("""
            select v.id
            from VenueEntity v
            where lower(v.name) like lower(concat('%', :query, '%'))
            order by v.name asc
            """)
    List<UUID> findIdsByNameContaining(@Param("query") String query);
}