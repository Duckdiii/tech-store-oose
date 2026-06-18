package com.oose.tech_store.controller;

import com.oose.tech_store.dto.staff.CreateStaffRequestDTO;
import com.oose.tech_store.dto.staff.StaffResponseDTO;
import com.oose.tech_store.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StaffResponseDTO addStaff(@Valid @RequestBody CreateStaffRequestDTO request) {
        return staffService.addStaff(request);
    }

    @DeleteMapping("/{staffId}")
    public StaffResponseDTO deleteStaff(@PathVariable String staffId) {
        return staffService.deleteStaff(staffId);
    }
}
