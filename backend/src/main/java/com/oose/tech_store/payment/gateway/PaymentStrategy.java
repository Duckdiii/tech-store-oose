package com.oose.tech_store.payment.gateway;

import com.oose.tech_store.dto.payment.PaymentInitResponse;
import com.oose.tech_store.dto.payment.PaymentResultResponse;
import com.oose.tech_store.entity.PaymentMethod;
import com.oose.tech_store.payment.PendingCheckout;
import java.util.Map;

public interface PaymentStrategy {

    boolean supports(PaymentMethod paymentMethod); // nhận dạng phương thức thanh toán

    PaymentInitResponse initialize(PendingCheckout checkout, PaymentMethod paymentMethod, String clientIp); // Khởi tạo
                                                                                                            // thanh
                                                                                                            // toán

    PaymentResultResponse handleReturn(Map<String, String> params); // Xử lý callback phản hồi kết quả từ nhà cung cấp
}
