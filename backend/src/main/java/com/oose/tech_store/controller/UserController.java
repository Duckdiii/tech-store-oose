package com.oose.tech_store.controller;

import com.oose.tech_store.dto.user.*;
import com.oose.tech_store.security.CustomerSecurityHelper;
import com.oose.tech_store.service.customer.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class UserController {

    private final UserProfileService userProfileService;
    private final CustomerSecurityHelper securityHelper;

    @GetMapping
    public ResponseEntity<UserProfileResponse> getProfile(Authentication authentication) {
        String customerId = securityHelper.resolveCustomerId(authentication);
        return ResponseEntity.ok(userProfileService.getProfile(customerId));
    }

    @PutMapping
    public ResponseEntity<UserProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        String customerId = securityHelper.resolveCustomerId(authentication);
        return ResponseEntity.ok(userProfileService.updateProfile(customerId, request));
    }

    @PutMapping("/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        String customerId = securityHelper.resolveCustomerId(authentication);
        userProfileService.changePassword(customerId, request);
    }

    @PostMapping("/addresses")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<AddressResponse> addAddress(
            Authentication authentication,
            @Valid @RequestBody AddressRequest request) {
        String customerId = securityHelper.resolveCustomerId(authentication);
        return ResponseEntity.ok(userProfileService.addAddress(customerId, request));
    }

    @PutMapping("/addresses/{addressId}")
    public ResponseEntity<AddressResponse> updateAddress(
            Authentication authentication,
            @PathVariable String addressId,
            @Valid @RequestBody AddressRequest request) {
        String customerId = securityHelper.resolveCustomerId(authentication);
        return ResponseEntity.ok(userProfileService.updateAddress(customerId, addressId, request));
    }

    @DeleteMapping("/addresses/{addressId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeAddress(
            Authentication authentication,
            @PathVariable String addressId) {
        String customerId = securityHelper.resolveCustomerId(authentication);
        userProfileService.removeAddress(customerId, addressId);
    }
}
