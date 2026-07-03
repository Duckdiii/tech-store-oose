package com.oose.tech_store.controller;

import com.oose.tech_store.dto.manage.ManageCustomerResponseDTO;
import com.oose.tech_store.service.customer.ManageCustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/manage/customers")
@RequiredArgsConstructor
public class ManageCustomerController {

    private final ManageCustomerService manageCustomerService;

    @GetMapping
    public List<ManageCustomerResponseDTO> getAllCustomers() {
        return manageCustomerService.getAllCustomers();
    }
}
