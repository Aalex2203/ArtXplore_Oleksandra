package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.presentation.api.error;

import java.time.Instant;

public record ApiErrorResponse(
        Instant timestamp,
        int status,
        String error,
        String code,
        String message,
        String path,
        String traceId
) {
}
