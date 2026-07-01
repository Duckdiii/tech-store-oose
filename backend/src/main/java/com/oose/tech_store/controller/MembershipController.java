package com.oose.tech_store.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.oose.tech_store.dto.MembershipTierResponseDTO;
import com.oose.tech_store.entity.enums.AccountStatus;
import com.oose.tech_store.repository.AccountRepository;
import com.oose.tech_store.security.CustomerSecurityHelper;
import com.oose.tech_store.service.customer.MembershipService;

@RestController
@RequestMapping("/api/membership")
public class MembershipController {

    private final MembershipService membershipService;
    private final CustomerSecurityHelper securityHelper;
    private final AccountRepository accountRepository;

    public MembershipController(
            MembershipService membershipService,
            CustomerSecurityHelper securityHelper,
            AccountRepository accountRepository) {
        this.membershipService = membershipService;
        this.securityHelper = securityHelper;
        this.accountRepository = accountRepository;
    }

    @GetMapping("/my-tier")
    public MembershipTierResponseDTO getMyMembershipTier(Authentication authentication) {
        try {
            if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication is required.");
            }
            accountRepository.findByEmailIgnoreCase(authentication.getName())
                    .filter(account -> AccountStatus.ACTIVE.equals(account.getStatus()))
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.FORBIDDEN,
                            "Your account has been restricted. You are unable to access membership benefits"));

            String customerId = securityHelper.resolveCustomerId(authentication);
            return membershipService.getMembershipInfo(customerId);
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Unable to load membership information. Please try again later", ex);
        }
    }
}
