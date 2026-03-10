package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.presentation.api.error.ApiErrorFactory;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.presentation.api.error.ApiErrorResponse;

import java.io.IOException;

public class JsonAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;
    private final ApiErrorFactory apiErrorFactory;

    public JsonAccessDeniedHandler(ObjectMapper objectMapper, ApiErrorFactory apiErrorFactory) {
        this.objectMapper = objectMapper;
        this.apiErrorFactory = apiErrorFactory;
    }

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException
    ) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ApiErrorResponse payload = apiErrorFactory.build(
                request,
                HttpStatus.FORBIDDEN,
                "AUTH_FORBIDDEN",
                "You do not have permission to access this resource."
        );

        objectMapper.writeValue(response.getOutputStream(), payload);
    }
}
