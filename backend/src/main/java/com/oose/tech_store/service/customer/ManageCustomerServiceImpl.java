package com.oose.tech_store.service.customer;

import com.oose.tech_store.dto.manage.ManageCustomerResponseDTO;
import com.oose.tech_store.entity.Customer;
import com.oose.tech_store.repository.CustomerRepository;
import com.oose.tech_store.repository.OrderRepository;
import com.oose.tech_store.repository.OrderRepository.CustomerOrderStats;
import lombok.RequiredArgsConstructor;
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
        Map<String, CustomerOrderStats> statsByCustomerId = orderRepository.getCompletedOrderStatsByCustomer()
                .stream()
                .collect(Collectors.toMap(CustomerOrderStats::getCustomerId, Function.identity()));

        return customerRepository.findAll().stream()
                .map(customer -> toResponse(customer, statsByCustomerId.get(customer.getId())))
                .toList();
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
