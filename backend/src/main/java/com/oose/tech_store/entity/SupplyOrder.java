package com.oose.tech_store.entity;

import com.oose.tech_store.entity.enums.POStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "purchase_orders")
@Getter
@Setter
@NoArgsConstructor
public class SupplyOrder extends BaseEntity {

    // Supplier
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    // Status
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private POStatus status = POStatus.PENDING;

    // Items
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    private List<SupplyOrderItem> items = new ArrayList<>();

    @Column(name = "order_date")
    private LocalDate orderDate;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public SupplyOrder(Supplier supplier, LocalDate orderDate) {
        this.supplier = supplier;
        this.orderDate = orderDate;
    }

    public void addItem(SupplyOrderItem item) {
        items.add(item);
    }
}
