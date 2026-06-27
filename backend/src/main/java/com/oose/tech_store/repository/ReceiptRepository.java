package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Receipt;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReceiptRepository extends JpaRepository<Receipt, String> {

    Optional<Receipt> findByExportLogId(String exportLogId);
}
