package com.oose.tech_store.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.oose.tech_store.dto.MembershipTierResponseDTO;
import com.oose.tech_store.entity.Customer;
import com.oose.tech_store.entity.Membership;
import com.oose.tech_store.entity.MembershipBenefit;
import com.oose.tech_store.entity.enums.MembershipTier;
import com.oose.tech_store.repository.CustomerRepository;
import com.oose.tech_store.repository.MembershipRepository;
import com.oose.tech_store.repository.OrderRepository;
import com.oose.tech_store.service.customer.MembershipService;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class MembershipServiceTests {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private MembershipRepository membershipRepository;

    @Mock
    private OrderRepository orderRepository;

    private MembershipService membershipService;

    private Membership standardMembership;
    private Membership bronzeMembership;

    @BeforeEach
    void setUp() {
        membershipService = new MembershipService(customerRepository, membershipRepository, orderRepository);

        MembershipBenefit standardBenefit = new MembershipBenefit(0.0, false, "Standard benefits");
        standardBenefit.setId("benefit-std");
        // Create standard membership with null minSpending to simulate/reproduce the bug
        standardMembership = new Membership(MembershipTier.STANDARD, standardBenefit, null, BigDecimal.valueOf(5000000));
        standardMembership.setId("tier-std");

        MembershipBenefit bronzeBenefit = new MembershipBenefit(1.0, false, "Bronze benefits");
        bronzeBenefit.setId("benefit-bronze");
        bronzeMembership = new Membership(MembershipTier.BRONZE, bronzeBenefit, BigDecimal.valueOf(5000000), BigDecimal.valueOf(15000000));
        bronzeMembership.setId("tier-bronze");
    }

    @Test
    void getMembershipInfoWithNullMinSpendingShouldNotThrowNullPointerException() {
        String customerId = "customer-1";
        Customer customer = new Customer("Test Customer", "0900000000", standardMembership);
        customer.setId(customerId);

        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(orderRepository.findByCustomerIdAndOrderStatusOrderByOrderDateDesc(customerId, com.oose.tech_store.entity.enums.OrderStatus.COMPLETED))
                .thenReturn(new ArrayList<>());
        when(membershipRepository.findAll()).thenReturn(List.of(standardMembership, bronzeMembership));

        MembershipTierResponseDTO result = membershipService.getMembershipInfo(customerId);

        assertNotNull(result);
        assertEquals("STANDARD", result.getCurrentTierName());
        assertEquals("BRONZE", result.getNextTierName());
        assertEquals(BigDecimal.valueOf(5000000), result.getSpendingToNextTier());
    }
}
