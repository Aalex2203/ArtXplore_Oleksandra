package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.application.exception;

import org.springframework.http.HttpStatus;

public abstract class AppException extends RuntimeException {

    private final HttpStatus status;
    private final String code;

    protected AppException(HttpStatus status, String code, String message) {
        super(message);
        this.status = status;
        this.code = code;
    }

    /**
     * Returns the HTTP status that should be sent to the client.
     *
     * @return response status
     */
    public HttpStatus status() {
        return status;
    }

    /**
     * Returns the stable machine-readable error code.
     *
     * @return error code for clients and observability tooling
     */
    public String code() {
        return code;
    }
}