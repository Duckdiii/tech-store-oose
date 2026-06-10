package com.oose.tech_store.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "staffs")
@DiscriminatorValue("STAFF")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Staff extends User {

    @Column(name = "staff_code", nullable = false, unique = true, length = 40)
    private String staffCode;

    @Column(name = "hire_date")
    private LocalDate hireDate;

    public Staff(String fullName, String phone, String staffCode, LocalDate hireDate) {
        if (staffCode == null) {
            throw new IllegalArgumentException("staffCode must not be null");
        }
        if (hireDate == null) {
            throw new IllegalArgumentException("hireDate must not be null");
        }
        super(fullName, phone);
        this.staffCode = staffCode;
        this.hireDate = hireDate;
    }

    public boolean canManageInventory() {
        return true;
    }
}
