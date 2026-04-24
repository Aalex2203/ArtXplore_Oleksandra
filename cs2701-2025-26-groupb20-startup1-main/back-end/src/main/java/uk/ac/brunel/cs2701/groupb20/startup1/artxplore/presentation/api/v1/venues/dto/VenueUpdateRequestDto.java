package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.presentation.api.v1.venues.dto;

import java.math.BigDecimal;

public class VenueUpdateRequestDto {

    private String name;
    private String type;
    private String address;
    private String imageUrl;
    private BigDecimal latitude;
    private BigDecimal longitude;

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public String getAddress() {
        return address;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }
}