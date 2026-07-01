package com.oose.tech_store.payment.price;

import com.oose.tech_store.entity.MembershipBenefit;
import java.math.BigDecimal;
import org.springframework.stereotype.Component;
import org.springframework.core.annotation.Order;

@Component
@Order(2)
public class ShippingFeeProcessor implements PriceProcessor {

    @Override
    public void process(PriceContext context) {
        boolean isFreeShip = false;
        
        if (context.getCustomer().getMembership() != null) {
            MembershipBenefit benefit = context.getCustomer().getMembership().getBenefit();
            isFreeShip = benefit.hasFreeShipping();
        }

        if (context.getSubtotal().compareTo(BigDecimal.valueOf(500000)) >= 0) {
            isFreeShip = true;
        }

        if (!isFreeShip) {
            BigDecimal shipFee = BigDecimal.valueOf(30000);
            context.setShippingFee(shipFee);
            context.applyFee(shipFee);
        }
    }
}
