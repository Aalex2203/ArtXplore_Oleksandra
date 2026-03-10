package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.presentation.api.v1.venues.dto;

import java.util.List;
import java.util.UUID;

public class VenueIdsResponseDto {

    private List<UUID> venueIds;

    public VenueIdsResponseDto() {
    }

    public VenueIdsResponseDto(List<UUID> venueIds) {
        this.venueIds = venueIds;
    }

    public List<UUID> getVenueIds() {
        return venueIds;
    }

    public void setVenueIds(List<UUID> venueIds) {
        this.venueIds = venueIds;
    }
}