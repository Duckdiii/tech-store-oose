package com.oose.tech_store.controller;

import com.oose.tech_store.dto.account.LoginRequest;
import com.oose.tech_store.dto.auth.LoginResponse;
import com.oose.tech_store.security.JwtService;
import com.oose.tech_store.service.auth.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final SecurityContextRepository securityContextRepository;
    private final SessionRegistry sessionRegistry;

    public AuthController(AuthService authService, JwtService jwtService,
            SecurityContextRepository securityContextRepository,
            SessionRegistry sessionRegistry) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.securityContextRepository = securityContextRepository;
        this.sessionRegistry = sessionRegistry;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request,
            HttpServletRequest servletRequest, HttpServletResponse servletResponse) {
        AuthService.LoginResult result = authService.login(request);
        var context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(result.authentication());
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, servletRequest, servletResponse);
        HttpSession session = servletRequest.getSession(false);
        if (session != null) {
            sessionRegistry.registerNewSession(session.getId(), result.authentication().getPrincipal());
        }
        var account = result.response();
        String token = jwtService.generateToken(account.email(), account.userId(), account.role());
        return new LoginResponse(token, account.userId(), account.email(), account.fullName(), account.role());
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            sessionRegistry.removeSessionInformation(session.getId());
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
    }
}
