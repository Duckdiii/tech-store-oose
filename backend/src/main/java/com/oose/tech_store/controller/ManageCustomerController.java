package com.oose.tech_store.controller;

import com.oose.tech_store.dto.manage.ManageCustomerResponseDTO;
import com.oose.tech_store.dto.manage.ManageCustomerSearchRequestDTO;
import com.oose.tech_store.service.customer.ManageCustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
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

    /**
     * Paginated, filterable listing for the Manager "Khách hàng" table.
     *
     * GET /api/manage/customers/search?keyword=...&page=0&size=10&sort=name,asc
     */
    @GetMapping("/search")
    public Page<ManageCustomerResponseDTO> searchCustomers(@ModelAttribute ManageCustomerSearchRequestDTO request) {
        return manageCustomerService.searchCustomers(request);
    }
}
