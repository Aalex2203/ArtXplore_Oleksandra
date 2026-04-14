package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.presentation.api.v1.venues.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class VenueResponseDto {

    private UUID id;
    private String name;
    private String type;
    private String address;
    private String ImageUrl;
    private BigDecimal latitude;
    private BigDecimal longitude;

    public VenueResponseDto() {
    }

    public VenueResponseDto(UUID id, String name, String type, String address, String ImageUrl, BigDecimal latitude, BigDecimal longitude) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.address = address;
        this.ImageUrl = ImageUrl;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getImageUrl() { return ImageUrl; }
    public void setImageUrl(String ImageUrl) { this.ImageUrl = ImageUrl; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }
}