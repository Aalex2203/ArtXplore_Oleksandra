package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.persistence.jpa.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "saved_venues",
        indexes = {
                @Index(name = "idx_saved_venues_user_saved_at", columnList = "user_id, saved_at"),
                @Index(name = "idx_saved_venues_venue_saved_at", columnList = "venue_id, saved_at")
        }
)
public class SavedVenueEntity {

    @EmbeddedId
    private SavedVenueId id;

    @CreationTimestamp
    @Column(name = "saved_at", nullable = false, updatable = false)
    private Instant savedAt;

    protected SavedVenueEntity() {
        // JPA
    }

    public SavedVenueEntity(UUID userId, UUID venueId) {
        this.id = new SavedVenueId(userId, venueId);
    }

    public SavedVenueId getId() {
        return id;
    }

    public void setId(SavedVenueId id) {
        this.id = id;
    }

    public UUID getUserId() {
        return id != null ? id.getUserId() : null;
    }

    public UUID getVenueId() {
        return id != null ? id.getVenueId() : null;
    }

    public Instant getSavedAt() {
        return savedAt;
    }
}