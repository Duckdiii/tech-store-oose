package com.oose.tech_store.service.customer.impl;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oose.tech_store.dto.MembershipTierResponseDTO;
import com.oose.tech_store.entity.Customer;
import com.oose.tech_store.entity.Membership;
import com.oose.tech_store.entity.Order;
import com.oose.tech_store.repository.CustomerRepository;
import com.oose.tech_store.repository.MembershipRepository;
import com.oose.tech_store.repository.OrderRepository;
import com.oose.tech_store.entity.enums.OrderStatus;
import com.oose.tech_store.service.customer.MembershipService;

@Service
public class MembershipServiceImpl implements MembershipService {

    private final CustomerRepository customerRepository;
    private final MembershipRepository membershipRepository;
    private final OrderRepository orderRepository;

    public MembershipServiceImpl(CustomerRepository customerRepository,
                             MembershipRepository membershipRepository,
                             OrderRepository orderRepository) {
        this.customerRepository = customerRepository;
        this.membershipRepository = membershipRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional
    public MembershipTierResponseDTO getMembershipInfo(String customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + customerId));

        BigDecimal accumulatedSpending = calculateAccumulatedSpending(customerId);
        Membership recalculatedMembership = findTierForSpending(accumulatedSpending);

        boolean upgraded = false;
        if (recalculatedMembership != null) {
            upgraded = customer.getMembership() == null
                    || !customer.getMembership().getId().equals(recalculatedMembership.getId());

            if (upgraded) {
                customer.assignMembership(recalculatedMembership);
                customerRepository.save(customer);
            }
        }

        return calculateTier(customer.getMembership(), accumulatedSpending, upgraded);
    }

    @Override
    @Transactional(readOnly = true)
    public MembershipTierResponseDTO calculateTier(Membership membership) {
        return calculateTier(membership, BigDecimal.ZERO, false);
    }

    @Override
    @Transactional(readOnly = true)
    public MembershipTierResponseDTO calculateTier(Membership membership, BigDecimal accumulatedSpending, boolean upgraded) {
        MembershipTierResponseDTO response = new MembershipTierResponseDTO();

        if (membership == null) {
            response.setCurrentTierId("default-std");
            response.setCurrentTierName("STANDARD");
            response.setCurrentTierDescription("Standard customer benefits");
            response.setDiscountPercentage(0.0);
            response.setFreeShipping(false);
            response.setMinSpending(BigDecimal.ZERO);
            response.setMaxSpending(BigDecimal.valueOf(5000000));
            response.setAccumulatedSpending(accumulatedSpending);
            response.setActiveBenefits(List.of("Standard customer benefits"));
            response.setUpgraded(false);
            response.setSpendingToNextTier(BigDecimal.valueOf(5000000).subtract(accumulatedSpending).max(BigDecimal.ZERO));
            response.setNextTierName("BRONZE");
            return response;
        }

        Membership nextTier = findNextTier(membership);

        response.setCurrentTierId(membership.getId());
        response.setCurrentTierName(membership.getTier().name());
        response.setCurrentTierDescription(membership.getBenefit() != null ? membership.getBenefit().getDescription() : "Standard customer benefits");
        response.setDiscountPercentage(membership.getBenefit() != null ? membership.getBenefit().getDiscountPercentage() : 0.0);
        response.setFreeShipping(membership.getBenefit() != null ? membership.getBenefit().hasFreeShipping() : false);
        response.setMinSpending(membership.getMinSpending());
        response.setMaxSpending(membership.getMaxSpending());
        response.setAccumulatedSpending(accumulatedSpending);
        response.setActiveBenefits(buildBenefitLabels(membership));
        response.setUpgraded(upgraded);
        response.setUpgradeMessage(upgraded
                ? "Congratulations! You are now " + membership.getTier().name() + " Tier!"
                : null);
        if (nextTier != null) {
            response.setNextTierName(nextTier.getTier().name());
            response.setNextTierMinSpending(nextTier.getMinSpending());
            response.setSpendingToNextTier(nextTier.getMinSpending().subtract(accumulatedSpending).max(BigDecimal.ZERO));
        } else {
            response.setNextTierRequirement(accumulatedSpending);
            response.setSpendingToNextTier(BigDecimal.ZERO);
        }

        return response;
    }

    @Override
    @Transactional
    public void updateSpendingAndTier(String customerId, BigDecimal totalSpending) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + customerId));
        Membership tier = findTierForSpending(totalSpending);
        if (tier != null) {
            customer.assignMembership(tier);
            customerRepository.save(customer);
        }
    }

    private BigDecimal calculateAccumulatedSpending(String customerId) {
        return orderRepository.findByCustomerIdAndOrderStatusOrderByOrderDateDesc(customerId, OrderStatus.COMPLETED)
                .stream()
                .map(Order::calculateTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private List<String> buildBenefitLabels(Membership membership) {
        List<String> benefits = new java.util.ArrayList<>();
        if (membership.getBenefit() != null) {
            if (membership.getBenefit().getDescription() != null && !membership.getBenefit().getDescription().isBlank()) {
                benefits.add(membership.getBenefit().getDescription());
            }
            if (membership.getBenefit().getDiscountPercentage() != null
                    && membership.getBenefit().getDiscountPercentage() > 0) {
                benefits.add(membership.getBenefit().getDiscountPercentage() + "% discount on eligible orders");
            }
            if (membership.getBenefit().hasFreeShipping()) {
                benefits.add("Free shipping benefit");
            }
        }
        if (benefits.isEmpty()) {
            benefits.add("Standard membership benefits");
        }
        return benefits;
    }

    private Membership findTierForSpending(BigDecimal totalSpending) {
        if (totalSpending == null) {
            throw new IllegalArgumentException("totalSpending must not be null");
        }
        List<Membership> memberships = sortedMemberships();
        if (memberships.isEmpty()) {
            return null;
        }
        return memberships.stream()
                .filter(membership -> membership.isSpendingInRange(totalSpending))
                .findFirst()
                .orElse(memberships.get(0));
    }

    private Membership findNextTier(Membership currentMembership) {
        BigDecimal currentMinSpending = currentMembership.getMinSpending() != null
                ? currentMembership.getMinSpending()
                : BigDecimal.ZERO;
        return sortedMemberships().stream()
                .filter(membership -> membership.getMinSpending() != null
                        && membership.getMinSpending().compareTo(currentMinSpending) > 0)
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
