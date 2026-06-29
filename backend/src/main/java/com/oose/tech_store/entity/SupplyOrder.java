package com.oose.tech_store.entity;

import com.oose.tech_store.entity.enums.SupplyOrderStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "purchase_orders")
@Getter
@Setter
@NoArgsConstructor
public class SupplyOrder extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private SupplyOrderStatus status = SupplyOrderStatus.PENDING;

    @OneToMany(mappedBy = "supplyOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SupplyOrderItem> items = new ArrayList<>();

    public SupplyOrder(Supplier supplier) {
        this.supplier = supplier;
    }

    public void addItem(SupplyOrderItem item) {
        items.add(item);
        item.setSupplyOrder(this);
    }
}
