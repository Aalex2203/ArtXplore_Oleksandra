package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.persistence.jpa.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class SavedVenueId implements Serializable {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "venue_id", nullable = false)
    private UUID venueId;

    public SavedVenueId() {
    }

    public SavedVenueId(UUID userId, UUID venueId) {
        this.userId = userId;
        this.venueId = venueId;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SavedVenueId that)) {
            return false;
        }
        return Objects.equals(userId, that.userId) && Objects.equals(venueId, that.venueId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, venueId);
    }
}