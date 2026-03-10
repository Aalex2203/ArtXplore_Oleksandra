package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.presentation.api.v1.venues.dto;

import java.util.List;
import java.util.UUID;

public class RecentlyViewedVenueIdsResponseDto {

    private List<UUID> venueIds;

    public RecentlyViewedVenueIdsResponseDto() {
    }

    public RecentlyViewedVenueIdsResponseDto(List<UUID> venueIds) {
        this.venueIds = venueIds;
    }

    public List<UUID> getVenueIds() {
        return venueIds;
    }

    public void setVenueIds(List<UUID> venueIds) {
        this.venueIds = venueIds;
    }
}