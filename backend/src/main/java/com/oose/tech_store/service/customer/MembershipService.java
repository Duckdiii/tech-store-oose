package com.oose.tech_store.service.customer;

import com.oose.tech_store.dto.MembershipTierResponseDTO;
import com.oose.tech_store.entity.Membership;
import java.math.BigDecimal;

public interface MembershipService {

    MembershipTierResponseDTO getMembershipInfo(String customerId);

    MembershipTierResponseDTO calculateTier(Membership membership);

    MembershipTierResponseDTO calculateTier(Membership membership, BigDecimal accumulatedSpending, boolean upgraded);

    void updateSpendingAndTier(String customerId, BigDecimal totalSpending);
}
