package com.oose.tech_store.mapper;

import com.oose.tech_store.dto.staff.StaffResponseDTO;
import com.oose.tech_store.entity.Account;
import com.oose.tech_store.entity.Staff;
import org.springframework.stereotype.Component;

@Component
public class StaffMapper {

    public StaffResponseDTO toResponse(Staff staff) {
        Account account = staff.getAccount();
        return new StaffResponseDTO(
                staff.getId(),
                staff.getFullName(),
                staff.getPhone(),
                staff.getStaffCode(),
                staff.getHireDate(),
                account != null ? account.getId() : null,
                account != null ? account.getEmail() : null,
                account != null ? account.getStatus() : null);
    }
}
