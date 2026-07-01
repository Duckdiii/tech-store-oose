package com.oose.tech_store.payment.gateway;

import com.oose.tech_store.dto.payment.PaymentInitResponse;
import com.oose.tech_store.dto.payment.PaymentResultResponse;
import com.oose.tech_store.entity.CODPaymentMethod;
import com.oose.tech_store.entity.PaymentMethod;
import com.oose.tech_store.entity.enums.PaymentLogStatus;
import com.oose.tech_store.payment.PendingCheckout;
import com.oose.tech_store.service.order.OrderFulfillmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class CODPaymentStrategy implements PaymentStrategy {

    private final OrderFulfillmentService fulfillmentService;

    @Override
    public boolean supports(PaymentMethod paymentMethod) { // nhận dạng phương thức thanh toán
        return paymentMethod instanceof CODPaymentMethod;
    }

    @Override
    public PaymentInitResponse initialize(PendingCheckout checkout, PaymentMethod paymentMethod, String clientIp) { // Khởi
                                                                                                                    // tạo
                                                                                                                    // thanh
                                                                                                                    // toán
        if (!(paymentMethod instanceof CODPaymentMethod cod)) {
            throw new IllegalArgumentException("Invalid payment method for COD strategy");
        }

        if (!cod.isAmountAllowed(checkout.getAmount())) {
            throw new IllegalArgumentException("Order amount exceeds COD limit of " + cod.getMaxAmount());
        }

        OrderFulfillmentService.OrderFulfillmentResult result = fulfillmentService.fulfill(checkout,
                PaymentLogStatus.PENDING);
        return new PaymentInitResponse("COD", checkout.getTxnRef(), null, result.orderId(), result.invoiceId(),
                "Order placed successfully");
    }

    @Override
    public PaymentResultResponse handleReturn(Map<String, String> params) { // Xử lý callback phản hồi kết quả từ nhà
                                                                            // cung cấp
        throw new UnsupportedOperationException("COD payment does not support return callback");
    }
}
