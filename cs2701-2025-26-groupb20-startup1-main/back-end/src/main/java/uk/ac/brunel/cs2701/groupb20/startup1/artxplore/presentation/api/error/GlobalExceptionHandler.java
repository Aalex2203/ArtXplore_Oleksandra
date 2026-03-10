package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.presentation.api.error;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.application.exception.AppException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private final ApiErrorFactory apiErrorFactory;

    public GlobalExceptionHandler(ApiErrorFactory apiErrorFactory) {
        this.apiErrorFactory = apiErrorFactory;
    }

    /**
     * Handles typed application exceptions and maps them to standard API errors.
     *
     * @param exception application exception carrying status and code
     * @param request   current HTTP request
     * @return unified API error response
     */
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiErrorResponse> handleAppException(AppException exception, HttpServletRequest request) {
        ApiErrorResponse body = apiErrorFactory.build(request, exception.status(), exception.code(), exception.getMessage());
        if (exception.status().is5xxServerError()) {
            log.error("Application error [{}]: {}", exception.code(), exception.getMessage(), exception);
        } else {
            log.warn("Application error [{}]: {}", exception.code(), exception.getMessage());
        }
        return ResponseEntity.status(exception.status()).body(body);
    }

    /**
     * Handles bean validation failures for request DTOs.
     *
     * @param exception validation exception produced by Spring MVC
     * @param request   current HTTP request
     * @return unified API error response
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException exception, HttpServletRequest request) {
        FieldError fieldError = exception.getBindingResult().getFieldErrors().stream().findFirst().orElse(null);
        String message = fieldError != null && fieldError.getDefaultMessage() != null
                ? fieldError.getDefaultMessage()
                : "Validation failed";

        ApiErrorResponse body = apiErrorFactory.build(request, HttpStatus.BAD_REQUEST, "REQ_VALIDATION_FAILED", message);
        log.warn("Validation error: {}", message);
        return ResponseEntity.badRequest().body(body);
    }

    /**
     * Handles constraint violations raised outside standard DTO binding flow.
     *
     * @param exception constraint violation exception
     * @param request   current HTTP request
     * @return unified API error response
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintViolation(ConstraintViolationException exception, HttpServletRequest request) {
        String message = exception.getConstraintViolations().stream()
                .findFirst()
                .map(v -> v.getMessage())
                .orElse("Validation failed");

        ApiErrorResponse body = apiErrorFactory.build(request, HttpStatus.BAD_REQUEST, "REQ_VALIDATION_FAILED", message);
        log.warn("Constraint violation: {}", message);
        return ResponseEntity.badRequest().body(body);
    }

    /**
     * Handles malformed JSON or incompatible request payload structures.
     *
     * @param exception unreadable message exception
     * @param request   current HTTP request
     * @return unified API error response
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleMalformedBody(HttpMessageNotReadableException exception, HttpServletRequest request) {
        ApiErrorResponse body = apiErrorFactory.build(
                request,
                HttpStatus.BAD_REQUEST,
                "REQ_MALFORMED_BODY",
                "Request body is malformed or contains invalid values."
        );
        log.warn("Malformed request body: {}", exception.getMessage());
        return ResponseEntity.badRequest().body(body);
    }

    /**
     * Handles invalid argument exceptions from input normalization or parsing.
     *
     * @param exception illegal argument exception
     * @param request   current HTTP request
     * @return unified API error response
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgument(IllegalArgumentException exception, HttpServletRequest request) {
        ApiErrorResponse body = apiErrorFactory.build(request, HttpStatus.BAD_REQUEST, "REQ_INVALID_ARGUMENT", exception.getMessage());
        log.warn("Invalid argument: {}", exception.getMessage());
        return ResponseEntity.badRequest().body(body);
    }

    /**
     * Handles unexpected uncaught exceptions as internal server errors.
     *
     * @param exception unhandled exception
     * @param request   current HTTP request
     * @return unified API error response
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnhandled(Exception exception, HttpServletRequest request) {
        ApiErrorResponse body = apiErrorFactory.build(
                request,
                HttpStatus.INTERNAL_SERVER_ERROR,
                "INTERNAL_ERROR",
                "Unexpected server error."
        );
        log.error("Unhandled exception", exception);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
