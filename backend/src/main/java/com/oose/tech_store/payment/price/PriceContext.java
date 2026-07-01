package com.oose.tech_store.payment.price;

import com.oose.tech_store.entity.Customer;
import com.oose.tech_store.entity.Order;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PriceContext {
    private final Order order;
    private final Customer customer;

    private BigDecimal subtotal;
    private BigDecimal membershipDiscount = BigDecimal.ZERO;
    private BigDecimal promotionDiscount = BigDecimal.ZERO;
    private BigDecimal shippingFee = BigDecimal.ZERO;
    private BigDecimal taxAmount = BigDecimal.ZERO;
    private BigDecimal finalAmount;

    public PriceContext(Order order, Customer customer) { // Lớp giữ trạng thái và lưu kết quả trung gian trong suốt
                                                          // chuỗi xử lý
        this.order = order;
        this.customer = customer;
        this.subtotal = order.calculateSubtotal();
        this.finalAmount = this.subtotal;
    }

    public void applyDiscount(BigDecimal discount) {
        this.finalAmount = this.finalAmount.subtract(discount);
    }

    public void applyFee(BigDecimal fee) {
        this.finalAmount = this.finalAmount.add(fee);
    }
}
