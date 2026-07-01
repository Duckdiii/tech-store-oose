package com.oose.tech_store.service.observer;

import com.oose.tech_store.entity.FavoriteProduct;
import com.oose.tech_store.entity.enums.SubscriptionStatus;
import com.oose.tech_store.repository.FavoriteProductRepository;
import jakarta.mail.internet.MimeMessage;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
// soạn và gửi email HTML cảnh báo sản phẩm hết hàng tới hòm thư đã đăng ký của
// khách hàng
public class EmailNotificationObserver implements InventoryObserver {

    private final JavaMailSender mailSender;
    private final FavoriteProductRepository favoriteProductRepository;

    @Value("${app.mail.from-address}")
    private String fromAddress;

    @Value("${app.mail.from-name}")
    private String fromName;

    @Override
    public void onInventoryChanged(InventoryStatusChangedEvent event) {
        if (!event.outOfStock()) {
            return;
        }

        List<FavoriteProduct> subscriptions = favoriteProductRepository.findBySpecsAndStatus(
                event.productId(), event.ramGb(), event.storageGb(), event.color(), SubscriptionStatus.SUBSCRIBED);

        for (FavoriteProduct subscription : subscriptions) {
            try {
                String email = subscription.getCustomer().getAccount().getEmail();
                String customerName = subscription.getCustomer().getFullName();
                sendEmail(email, customerName, event.productName());
            } catch (NullPointerException exception) {
                log.warn("[EMAIL] Customer has no linked account or email address");
            }
        }
    }

    private void sendEmail(String toEmail, String customerName, String productName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress, fromName);
            helper.setTo(toEmail);
            helper.setSubject("[TechStore] Thông báo sản phẩm hết hàng");

            String content = String.format(
                    "<h3>Xin chào %s,</h3>" +
                            "<p>Sản phẩm bạn đang theo dõi: <strong>%s</strong> hiện đã <strong>HẾT HÀNG</strong> trên hệ thống của chúng tôi.</p>"
                            +
                            "<p>Chúng tôi sẽ thông báo lại cho bạn ngay khi sản phẩm này được nhập thêm hàng.</p>" +
                            "<br/>" +
                            "<p>Trân trọng,<br/>Đội ngũ TechStore</p>",
                    customerName, productName);

            helper.setText(content, true);
            mailSender.send(message);
            log.info("[EMAIL] Sent out-of-stock alert to {} for {}", toEmail, productName);
        } catch (Exception exception) {
            log.error("[EMAIL] Failed to send email to {}", toEmail, exception);
        }
    }
}
