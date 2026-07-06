package com.oose.tech_store.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oose.tech_store.service.recovery.MaintenanceService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.util.AntPathMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * While a data restore is running (see {@link MaintenanceService}), customer-facing API
 * calls are rejected with 503 so the storefront shows a maintenance notice instead of
 * operating against a database that may be mid-restore. Manager endpoints, auth, health
 * checks and payment gateway callbacks stay reachable so the manager can finish the
 * restore and external services aren't broken.
 */
@Component
@RequiredArgsConstructor
public class MaintenanceFilter extends OncePerRequestFilter {

    private static final List<String> ALLOWED_DURING_MAINTENANCE = List.of(
            "/api/manage/**",
            "/api/system/**",
            "/api/auth/**",
            "/api/health",
            "/api/payments/momo/return",
            "/api/payments/momo/ipn",
            "/api/payments/vnpay/return",
            "/api/payments/vnpay/ipn");

    private final MaintenanceService maintenanceService;
    private final ObjectMapper objectMapper;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        if (!maintenanceService.isEnabled() || !path.startsWith("/api/") || isAllowed(path)) {
            chain.doFilter(request, response);
            return;
        }

        response.setStatus(HttpStatus.SERVICE_UNAVAILABLE.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(Map.of(
                "maintenanceMode", true,
                "message", "The system is currently under maintenance. Please try again later.")));
    }

    private boolean isAllowed(String path) {
        return ALLOWED_DURING_MAINTENANCE.stream().anyMatch(pattern -> pathMatcher.match(pattern, path));
    }
}
