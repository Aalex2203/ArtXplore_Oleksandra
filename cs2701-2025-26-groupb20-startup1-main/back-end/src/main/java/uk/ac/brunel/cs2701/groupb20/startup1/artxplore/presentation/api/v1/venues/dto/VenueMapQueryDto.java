package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.presentation.api.v1.venues.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class VenueMapQueryDto {

    @NotNull
    private BigDecimal minLatitude;

    @NotNull
    private BigDecimal maxLatitude;

    @NotNull
    private BigDecimal minLongitude;

    @NotNull
    private BigDecimal maxLongitude;

    private List<String> types;

    public BigDecimal getMinLatitude() {
        return minLatitude;
    }

    public void setMinLatitude(BigDecimal minLatitude) {
        this.minLatitude = minLatitude;
    }

    public BigDecimal getMaxLatitude() {
        return maxLatitude;
    }

    public void setMaxLatitude(BigDecimal maxLatitude) {
        this.maxLatitude = maxLatitude;
    }

    public BigDecimal getMinLongitude() {
        return minLongitude;
    }

    public void setMinLongitude(BigDecimal minLongitude) {
        this.minLongitude = minLongitude;
    }

    public BigDecimal getMaxLongitude() {
        return maxLongitude;
    }

    public void setMaxLongitude(BigDecimal maxLongitude) {
        this.maxLongitude = maxLongitude;
    }

    public List<String> getTypes() {
        return types;
    }

    public void setTypes(List<String> types) {
        this.types = types;
    }
}