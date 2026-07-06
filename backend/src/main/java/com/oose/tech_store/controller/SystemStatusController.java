package com.oose.tech_store.controller;

import com.oose.tech_store.dto.SystemStatusResponseDTO;
import com.oose.tech_store.service.recovery.MaintenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/system")
@RequiredArgsConstructor
public class SystemStatusController {

    private final MaintenanceService maintenanceService;

    @GetMapping("/maintenance-status")
    public SystemStatusResponseDTO getMaintenanceStatus() {
        return new SystemStatusResponseDTO(maintenanceService.isEnabled());
    }
}
