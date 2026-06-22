package com.oose.tech_store.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.oose.tech_store.dto.MembershipTierResponseDTO;
import com.oose.tech_store.service.MembershipService;

@RestController
@RequestMapping("/api/membership")
public class MembershipController {

    private final MembershipService membershipService;

    public MembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @GetMapping("/my-tier")
    public MembershipTierResponseDTO getMyMembershipTier(Authentication authentication) {
        try {
            if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication is required.");
            }
            return membershipService.getMembershipInfo(authentication.getName());
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Unable to load membership info.", ex);
        }
    }
}
