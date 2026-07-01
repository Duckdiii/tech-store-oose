package com.oose.tech_store.payment.price;

import com.oose.tech_store.entity.MembershipBenefit;
import java.math.BigDecimal;
import java.math.RoundingMode;
import org.springframework.stereotype.Component;
import org.springframework.core.annotation.Order;

@Component
@Order(1)
public class MembershipDiscountProcessor implements PriceProcessor {

    @Override
    public void process(PriceContext context) { // xử lý tính toán chiết khấu thẻ thành viên
        if (context.getCustomer().getMembership() != null) {
            MembershipBenefit benefit = context.getCustomer().getMembership().getBenefit();
            BigDecimal discount = benefit.calculateDiscount(context.getSubtotal())
                    .setScale(2, RoundingMode.HALF_UP);

            context.setMembershipDiscount(discount);
            context.applyDiscount(discount);
        }
    }
}
