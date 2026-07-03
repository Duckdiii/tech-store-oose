package com.oose.tech_store.service.customer;

import com.oose.tech_store.dto.manage.ManageCustomerResponseDTO;

import java.util.List;

public interface ManageCustomerService {

    List<ManageCustomerResponseDTO> getAllCustomers();
}
