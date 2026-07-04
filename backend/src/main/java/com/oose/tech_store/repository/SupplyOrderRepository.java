package com.oose.tech_store.repository;

import com.oose.tech_store.entity.SupplyOrder;
import com.oose.tech_store.entity.enums.POStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplyOrderRepository extends JpaRepository<SupplyOrder, String>, JpaSpecificationExecutor<SupplyOrder> {
    long countBySupplierIdAndStatusIn(String supplierId, List<POStatus> statuses);
}
