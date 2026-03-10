package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.presentation.api.error;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.web.RequestTraceFilter;

import java.time.Clock;
import java.time.Instant;
import java.util.UUID;

@Component
public class ApiErrorFactory {

    private final Clock clock;

    public ApiErrorFactory(Clock clock) {
        this.clock = clock;
    }

    /**
     * Creates a standardized API error payload with trace metadata.
     *
     * @param request incoming HTTP request
     * @param status  HTTP status mapped to the error
     * @param code    stable machine-readable error code
     * @param message client-facing error message
     * @return standardized API error response
     */
    public ApiErrorResponse build(HttpServletRequest request, HttpStatus status, String code, String message) {
        String path = request != null ? request.getRequestURI() : "unknown";
        return new ApiErrorResponse(
                Instant.now(clock),
                status.value(),
                status.getReasonPhrase(),
                code,
                message,
                path,
                resolveTraceId(request)
        );
    }

    private String resolveTraceId(HttpServletRequest request) {
        if (request == null) {
            return UUID.randomUUID().toString();
        }

        Object traceIdAttr = request.getAttribute(RequestTraceFilter.TRACE_ID_ATTRIBUTE);
        if (traceIdAttr instanceof String traceId && !traceId.isBlank()) {
            return traceId;
        }

        String traceIdHeader = request.getHeader(RequestTraceFilter.TRACE_ID_HEADER);
        if (traceIdHeader != null && !traceIdHeader.isBlank()) {
            return traceIdHeader;
        }

        return UUID.randomUUID().toString();
    }
}
