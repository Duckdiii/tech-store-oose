package com.oose.tech_store.controller;

import com.oose.tech_store.dto.account.AccountResponse;
import com.oose.tech_store.dto.account.AddStaffRequest;
import com.oose.tech_store.dto.account.BlockAccountResponse;
import com.oose.tech_store.dto.account.PageResponse;
import com.oose.tech_store.dto.account.StaffMutationResponse;
import com.oose.tech_store.dto.account.StaffResponse;
import com.oose.tech_store.entity.enums.AccountStatus;
import com.oose.tech_store.security.AccountPrincipal;
import com.oose.tech_store.service.auth.AccountManagementService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/manage")
public class AccountManagementController {

    private final AccountManagementService accountManagementService;

    public AccountManagementController(AccountManagementService accountManagementService) {
        this.accountManagementService = accountManagementService;
    }

    @GetMapping("/accounts")
    public PageResponse<AccountResponse> getAccounts(@RequestParam(required = false) String query,
            @RequestParam(required = false) AccountStatus status,
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return accountManagementService.searchAccounts(query, status, pageable);
    }

    @PatchMapping("/accounts/{accountId}/block")
    public BlockAccountResponse blockAccount(@AuthenticationPrincipal AccountPrincipal principal,
            @PathVariable String accountId) {
        return accountManagementService.blockAccount(principal.accountId(), accountId);
    }

    @GetMapping("/staff")
    public PageResponse<StaffResponse> getStaff(@RequestParam(required = false) String criteria,
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return accountManagementService.searchStaff(criteria, pageable);
    }

    @GetMapping("/staff/{staffId}")
    public StaffResponse getStaffDetails(@PathVariable String staffId) {
        return accountManagementService.getStaffDetails(staffId);
    }

    @PostMapping("/staff")
    @ResponseStatus(HttpStatus.CREATED)
    public StaffMutationResponse addStaff(@AuthenticationPrincipal AccountPrincipal principal,
            @Valid @RequestBody AddStaffRequest request) {
        return accountManagementService.addStaff(principal.accountId(), request);
    }

    @DeleteMapping("/staff/{staffId}")
    public StaffMutationResponse deleteStaff(@AuthenticationPrincipal AccountPrincipal principal,
            @PathVariable String staffId) {
        return accountManagementService.deleteStaff(principal.accountId(), staffId);
    }
}
