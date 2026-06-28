package com.oose.tech_store.controller;

import com.oose.tech_store.dto.auth.LoginRequest;
import com.oose.tech_store.dto.auth.LoginResponse;
import com.oose.tech_store.repository.AccountRepository;
import com.oose.tech_store.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final AccountRepository accountRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        Authentication auth;
        try {
            auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String role = auth.getAuthorities().iterator().next()
                .getAuthority().replace("ROLE_", "");

        var account = accountRepository.findByEmailIgnoreCaseWithUser(request.email())
                .orElseThrow();
        String userId = account.getUser().getId();
        String name   = account.getUser().getFullName();

        String token = jwtService.generateToken(request.email(), userId, role);

        return ResponseEntity.ok(new LoginResponse(token, userId, request.email(), name, role));
    }
}
