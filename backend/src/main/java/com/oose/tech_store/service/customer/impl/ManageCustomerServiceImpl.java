package com.oose.tech_store.service.customer.impl;

import com.oose.tech_store.dto.manage.ManageCustomerResponseDTO;
import com.oose.tech_store.dto.manage.ManageCustomerSearchRequestDTO;
import com.oose.tech_store.entity.Customer;
import com.oose.tech_store.repository.CustomerRepository;
import com.oose.tech_store.repository.OrderRepository;
import com.oose.tech_store.repository.OrderRepository.CustomerOrderStats;
import com.oose.tech_store.service.customer.ManageCustomerService;
import com.oose.tech_store.specification.ManageCustomerSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ManageCustomerServiceImpl implements ManageCustomerService {

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;

    @Override
    public List<ManageCustomerResponseDTO> getAllCustomers() {
        Map<String, CustomerOrderStats> statsByCustomerId = statsByCustomerId();

        return customerRepository.findAll().stream()
                .map(customer -> toResponse(customer, statsByCustomerId.get(customer.getId())))
                .toList();
    }

    @Override
    public Page<ManageCustomerResponseDTO> searchCustomers(ManageCustomerSearchRequestDTO request) {
        int page = Math.max(0, request.getPage());
        int size = request.getSize() > 0 ? request.getSize() : 10;
        Pageable pageable = PageRequest.of(page, size, parseSort(request.getSort()));

        Specification<Customer> spec = ManageCustomerSpecification.buildFromRequest(request);
        Map<String, CustomerOrderStats> statsByCustomerId = statsByCustomerId();

        return customerRepository.findAll(spec, pageable)
                .map(customer -> toResponse(customer, statsByCustomerId.get(customer.getId())));
    }

    private Map<String, CustomerOrderStats> statsByCustomerId() {
        return orderRepository.getCompletedOrderStatsByCustomer()
                .stream()
                .collect(Collectors.toMap(CustomerOrderStats::getCustomerId, Function.identity()));
    }

    private Sort parseSort(String sortParam) {
        if (sortParam == null || sortParam.isBlank()) {
            return Sort.by(Sort.Direction.ASC, "fullName");
        }

        String[] parts = sortParam.split(",");
        String field = parts[0].trim();
        Sort.Direction direction = parts.length > 1 && "desc".equalsIgnoreCase(parts[1].trim())
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        return switch (field) {
            case "name" -> Sort.by(direction, "fullName");
            case "email" -> Sort.by(direction, "account.email");
            case "phone" -> Sort.by(direction, "phone");
            case "tier" -> Sort.by(direction, "membership.tier");
            default -> Sort.by(Sort.Direction.ASC, "fullName");
        };
    }

    private ManageCustomerResponseDTO toResponse(Customer customer, CustomerOrderStats stats) {
        return new ManageCustomerResponseDTO(
                customer.getId(),
                customer.getAccount().getId(),
                customer.getFullName(),
                customer.getAccount().getEmail(),
                customer.getPhone(),
                customer.getMembership().getTier().name(),
                stats == null ? 0L : stats.getTotalOrders(),
                stats == null ? BigDecimal.ZERO : stats.getTotalSpent(),
                customer.getAccount().isActive());
    }
}
