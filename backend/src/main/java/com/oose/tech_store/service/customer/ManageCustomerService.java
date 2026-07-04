package com.oose.tech_store.service.customer;

import com.oose.tech_store.dto.manage.ManageCustomerResponseDTO;
import com.oose.tech_store.dto.manage.ManageCustomerSearchRequestDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ManageCustomerService {

    List<ManageCustomerResponseDTO> getAllCustomers();

    Page<ManageCustomerResponseDTO> searchCustomers(ManageCustomerSearchRequestDTO request);
}
