package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, String> {

	Optional<Invoice> findByOrderId(String orderId);
}
