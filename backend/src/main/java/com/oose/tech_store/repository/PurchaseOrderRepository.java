package com.oose.tech_store.repository;

import com.oose.tech_store.entity.PurchaseOrder;
import com.oose.tech_store.entity.enums.PurchaseOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, String> {
    long countBySupplierIdAndStatusIn(String supplierId, List<PurchaseOrderStatus> statuses);
}
