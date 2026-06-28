package com.oose.tech_store.service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oose.tech_store.dto.MembershipTierResponseDTO;
import com.oose.tech_store.entity.Customer;
import com.oose.tech_store.entity.Membership;
import com.oose.tech_store.repository.CustomerRepository;
import com.oose.tech_store.repository.MembershipRepository;

@Service
public class MembershipService {

    private final CustomerRepository customerRepository;
    private final MembershipRepository membershipRepository;

    public MembershipService(CustomerRepository customerRepository,
                             MembershipRepository membershipRepository) {
        this.customerRepository = customerRepository;
        this.membershipRepository = membershipRepository;
    }

    @Transactional(readOnly = true)
    public MembershipTierResponseDTO getMembershipInfo(String customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + customerId));

        return calculateTier(customer.getMembership());
    }

    @Transactional(readOnly = true)
    public MembershipTierResponseDTO calculateTier(Membership membership) {
        if (membership == null) {
            throw new RuntimeException("Membership not found");
        }

        Membership nextTier = findNextTier(membership);

        MembershipTierResponseDTO response = new MembershipTierResponseDTO();
        response.setCurrentTierId(membership.getId());
        response.setCurrentTierName(membership.getTier().name());
        response.setCurrentTierDescription(membership.getBenefit().getDescription());
        response.setDiscountPercentage(membership.getBenefit().getDiscountPercentage());
        response.setFreeShipping(membership.getBenefit().hasFreeShipping());
        response.setMinSpending(membership.getMinSpending());
        response.setMaxSpending(membership.getMaxSpending());
        if (nextTier != null) {
            response.setNextTierName(nextTier.getTier().name());
            response.setNextTierMinSpending(nextTier.getMinSpending());
        }

        return response;
    }

    @Transactional
    public void updateSpendingAndTier(String customerId, BigDecimal totalSpending) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + customerId));
        customer.assignMembership(findTierForSpending(totalSpending));
        customerRepository.save(customer);
    }

    private Membership findTierForSpending(BigDecimal totalSpending) {
        if (totalSpending == null) {
            throw new IllegalArgumentException("totalSpending must not be null");
        }
        return sortedMemberships().stream()
                .filter(membership -> membership.isSpendingInRange(totalSpending))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No membership tier found for spending: " + totalSpending));
    }

    private Membership findNextTier(Membership currentMembership) {
        return sortedMemberships().stream()
                .filter(membership -> currentMembership.getMinSpending() == null
                        || membership.getMinSpending() != null
                        && membership.getMinSpending().compareTo(currentMembership.getMinSpending()) > 0)
                .findFirst()
                .orElse(null);
    }

    private List<Membership> sortedMemberships() {
        return membershipRepository.findAll().stream()
                .sorted(Comparator.comparing(
                        Membership::getMinSpending,
                        Comparator.nullsFirst(BigDecimal::compareTo)))
                .toList();
    }
}
