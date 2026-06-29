package com.oose.tech_store.repository;

import com.oose.tech_store.entity.SupplyOrder;
import com.oose.tech_store.entity.enums.SupplyOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplyOrderRepository extends JpaRepository<SupplyOrder, String> {
    long countBySupplierIdAndStatusIn(String supplierId, List<SupplyOrderStatus> statuses);
}
