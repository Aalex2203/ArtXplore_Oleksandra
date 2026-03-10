package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.persistence.jpa.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "venue_views",
        indexes = {
                @Index(name = "idx_venue_views_user_viewed_at", columnList = "user_id, viewed_at"),
                @Index(name = "idx_venue_views_venue_viewed_at", columnList = "venue_id, viewed_at")
        }
)
public class VenueViewEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "venue_id", nullable = false)
    private UUID venueId;

    @CreationTimestamp
    @Column(name = "viewed_at", nullable = false, updatable = false)
    private Instant viewedAt;

    protected VenueViewEntity() {
        // JPA
    }

    public VenueViewEntity(UUID userId, UUID venueId) {
        this.userId = userId;
        this.venueId = venueId;
    }

    public UUID getId() {
        return id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getVenueId() {
        return venueId;
    }

    public void setVenueId(UUID venueId) {
        this.venueId = venueId;
    }

    public Instant getViewedAt() {
        return viewedAt;
    }
}