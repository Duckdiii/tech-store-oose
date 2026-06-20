package com.oose.tech_store.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.oose.tech_store.dto.MembershipTierResponseDTO;
import com.oose.tech_store.entity.Membership;
import com.oose.tech_store.entity.MembershipTier;
import com.oose.tech_store.repository.MembershipRepository;
import com.oose.tech_store.repository.MembershipTierRepository;

@Service
public class MembershipService {

    private final MembershipRepository membershipRepository;
    private final MembershipTierRepository membershipTierRepository;

    public MembershipService(MembershipRepository membershipRepository,
                             MembershipTierRepository membershipTierRepository) {
        this.membershipRepository = membershipRepository;
        this.membershipTierRepository = membershipTierRepository;
    }

    public MembershipTierResponseDTO getMembershipInfo(Long userId) {
        Membership membership = membershipRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Membership not found for user: " + userId));

        return calculateTier(membership);
    }

    public MembershipTierResponseDTO calculateTier(Membership membership) {
        // Get all tiers sorted by minSpendingRequired ascending
        List<MembershipTier> allTiers = membershipTierRepository.findAll();
        allTiers.sort((a, b) -> Long.compare(a.getMinSpendingRequired(), b.getMinSpendingRequired()));

        // Determine current tier based on totalSpending
        MembershipTier currentTier = membership.getCurrentTier();
        for (MembershipTier tier : allTiers) {
            if (membership.getTotalSpending().compareTo(BigDecimal.valueOf(tier.getMinSpendingRequired())) >= 0) {
                currentTier = tier;
            }
        }

        // Find next tier
        MembershipTier nextTier = null;
        Long pointsNeededForNext = 0L;
        for (MembershipTier tier : allTiers) {
            if (tier.getMinSpendingRequired() > currentTier.getMinSpendingRequired()) {
                nextTier = tier;
                pointsNeededForNext = tier.getMinSpendingRequired() - membership.getTotalSpending().longValue();
                break;
            }
        }

        // Build response DTO
        MembershipTierResponseDTO response = new MembershipTierResponseDTO();
        response.setCurrentTierId(currentTier.getId());
        response.setCurrentTierName(currentTier.getName());
        response.setCurrentTierDescription(currentTier.getDescription());
        response.setPointsMultiplier(currentTier.getPointsMultiplier());
        response.setTotalSpending(membership.getTotalSpending());
        response.setCurrentPoints(membership.getCurrentPoints());
        response.setPointsNeededForNextTier(pointsNeededForNext);
        if (nextTier != null) {
            response.setNextTierName(nextTier.getName());
        }

        return response;
    }

    public void updateSpendingAndTier(Long userId, BigDecimal amount) {
        Membership membership = membershipRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Membership not found for user: " + userId));

        // Update total spending
        membership.setTotalSpending(membership.getTotalSpending().add(amount));

        // Recalculate tier
        List<MembershipTier> allTiers = membershipTierRepository.findAll();
        allTiers.sort((a, b) -> Long.compare(a.getMinSpendingRequired(), b.getMinSpendingRequired()));

        for (MembershipTier tier : allTiers) {
            if (membership.getTotalSpending().compareTo(BigDecimal.valueOf(tier.getMinSpendingRequired())) >= 0) {
                membership.setCurrentTier(tier);
            }
        }

        membershipRepository.save(membership);
    }
}
