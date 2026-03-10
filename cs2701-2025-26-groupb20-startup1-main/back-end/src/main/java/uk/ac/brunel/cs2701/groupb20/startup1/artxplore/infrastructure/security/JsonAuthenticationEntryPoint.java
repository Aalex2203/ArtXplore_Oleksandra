package uk.ac.brunel.cs2701.groupb20.startup1.artxplore.infrastructure.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.presentation.api.error.ApiErrorFactory;
import uk.ac.brunel.cs2701.groupb20.startup1.artxplore.presentation.api.error.ApiErrorResponse;

import java.io.IOException;

public class JsonAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;
    private final ApiErrorFactory apiErrorFactory;

    public JsonAuthenticationEntryPoint(ObjectMapper objectMapper, ApiErrorFactory apiErrorFactory) {
        this.objectMapper = objectMapper;
        this.apiErrorFactory = apiErrorFactory;
    }

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ApiErrorResponse payload = apiErrorFactory.build(
                request,
                HttpStatus.UNAUTHORIZED,
                "AUTH_UNAUTHORIZED",
                "Authentication is required."
        );

        objectMapper.writeValue(response.getOutputStream(), payload);
    }
}
