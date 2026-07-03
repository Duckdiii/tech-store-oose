package com.oose.tech_store.service.order.impl;

import com.oose.tech_store.dto.invoice.InvoiceItemResponse;
import com.oose.tech_store.dto.invoice.InvoiceResponse;
import com.oose.tech_store.entity.Invoice;
import com.oose.tech_store.entity.OrderItem;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.repository.InvoiceRepository;
import com.oose.tech_store.service.order.InvoiceService;
import com.oose.tech_store.util.InvoicePdfGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InvoiceServiceImpl implements InvoiceService {

        private final InvoiceRepository invoiceRepository;

        @Override
        public InvoiceResponse getInvoiceByOrderId(String orderId, String customerId) {
                Invoice invoice = invoiceRepository.findByOrderId(orderId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Invoice not found for order: " + orderId));

                verifyOwnership(invoice, customerId);

                List<InvoiceItemResponse> items = invoice.getOrder().getItems().stream()
                                .map(this::toItemResponse)
                                .toList();

                return new InvoiceResponse(
                                invoice.getId(),
                                invoice.getOrder().getId(),
                                invoice.getIssuedAt(),
                                invoice.getOrder().getOrderDate(),
                                invoice.getOrder().getSelectedPaymentMethod().getName(),
                                invoice.getOrder().getOrderStatus().name(),
                                items,
                                invoice.getOriginalAmount(),
                                invoice.getDiscountAmount(),
                                invoice.getVatAmount(),
                                invoice.getFinalAmount(),
                                invoice.getOrder().getCustomer().getFullName(),
                                invoice.getOrder().getAddress().getFullAddress());
        }

        @Override
        public byte[] generateInvoicePdf(String orderId, String customerId) {
                InvoiceResponse invoice = getInvoiceByOrderId(orderId, customerId);
                return InvoicePdfGenerator.generate(invoice);
        }

        private void verifyOwnership(Invoice invoice, String customerId) {
                String orderOwnerId = invoice.getOrder().getCustomer().getId();
                if (!orderOwnerId.equals(customerId)) {
                        throw new AccessDeniedException("Access denied to invoice for order: "
                                        + invoice.getOrder().getId());
                }
        }

        private InvoiceItemResponse toItemResponse(OrderItem item) {
                List<InvoiceItemResponse.BundleServiceSummary> bundleServices = item.getBundleServices().stream()
                                .map(bs -> new InvoiceItemResponse.BundleServiceSummary(bs.getName(), bs.getPrice()))
                                .toList();

                return new InvoiceItemResponse(
                                item.getId(),
                                item.getProductVariant().getProduct().getName(),
                                item.getProductVariant().getDisplayName(),
                                item.getQuantity(),
                                item.getUnitPriceAtOrder(),
                                bundleServices,
                                item.calculateTotal());
        }
}
