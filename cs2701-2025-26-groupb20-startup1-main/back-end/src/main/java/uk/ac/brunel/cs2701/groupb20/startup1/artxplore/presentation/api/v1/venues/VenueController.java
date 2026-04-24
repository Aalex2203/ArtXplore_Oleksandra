package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.presentation.api.v1.venues;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.application.venues.service.VenueService;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.domain.core.model.VenueType;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.presentation.api.v1.venues.dto.*;

import java.util.List;
import java.util.UUID;

@Validated
@RestController
@RequestMapping("/api/v1/venues")
public class VenueController {

    private final VenueService venueService;

    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    @GetMapping("/map")
    public ResponseEntity<VenueIdsResponseDto> getVenuesWithinBounds(
            @Valid @ModelAttribute VenueMapQueryDto query
    ) {
        List<VenueType> types = query.getTypes() == null
                ? List.of()
                : query.getTypes().stream()
                        .map(String::trim)
                        .map(String::toUpperCase)
                        .map(VenueType::valueOf)
                        .toList();

        List<UUID> venueIds = venueService.getVenueIdsWithinBoundsAndTypes(
                query.getMinLatitude(),
                query.getMaxLatitude(),
                query.getMinLongitude(),
                query.getMaxLongitude(),
                types
        );

        return ResponseEntity.ok(new VenueIdsResponseDto(venueIds));
    }

    @GetMapping
    public ResponseEntity<List<VenueResponseDto>> getAllVenues() {
        List<VenueResponseDto> venues = venueService.getAllVenues();
        return ResponseEntity.ok(venues);
    }

    @GetMapping("/search")
    public ResponseEntity<VenueSearchResponseDto> searchVenuesByName(
            @RequestParam String query
    ) {
        List<UUID> venueIds = venueService.searchVenueIdsByName(query);
        return ResponseEntity.ok(new VenueSearchResponseDto(venueIds));
    }

    @GetMapping("/saved/{userId}")
    public ResponseEntity<SavedVenueIdsResponseDto> getSavedVenues(
            @PathVariable UUID userId
    ) {
        List<UUID> savedVenueIds = venueService.getSavedVenueIds(userId);
        return ResponseEntity.ok(new SavedVenueIdsResponseDto(savedVenueIds));
    }

    @PostMapping("/saved/{userId}/{venueId}")
    public ResponseEntity<Void> saveVenue(
            @PathVariable UUID userId,
            @PathVariable UUID venueId
    ) {
        venueService.saveVenue(venueId, userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/saved/{userId}/{venueId}")
    public ResponseEntity<Void> unsaveVenue(
            @PathVariable UUID userId,
            @PathVariable UUID venueId
    ) {
        venueService.unsaveVenue(venueId, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/viewed/{userId}/{venueId}")
    public ResponseEntity<Void> recordVenueView(
            @PathVariable UUID userId,
            @PathVariable UUID venueId
    ) {
        venueService.recordVenueView(venueId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/viewed/{userId}")
    public ResponseEntity<RecentlyViewedVenueIdsResponseDto> getRecentlyViewedVenues(
            @PathVariable UUID userId
    ) {
        List<UUID> venueIds = venueService.getRecentlyViewedVenueIds(userId);
        return ResponseEntity.ok(new RecentlyViewedVenueIdsResponseDto(venueIds));
    }

    @PostMapping("/details")
    public ResponseEntity<List<VenueResponseDto>> getVenueDetails(
            @RequestBody List<UUID> venueIds
    ) {
        List<VenueResponseDto> venues = venueService.getVenuesByIds(venueIds);
        return ResponseEntity.ok(venues);
    }

    @PutMapping("/{venueId}")
    public ResponseEntity<VenueResponseDto> updateVenue(
            @PathVariable UUID venueId,
            @RequestBody VenueUpdateRequestDto request
    ) {
        VenueResponseDto updatedVenue = venueService.updateVenue(venueId, request);
        return ResponseEntity.ok(updatedVenue);
    }
}