package com.oose.tech_store.service;

import com.oose.tech_store.dto.staff.CreateStaffRequestDTO;
import com.oose.tech_store.dto.staff.StaffResponseDTO;
import com.oose.tech_store.entity.Account;
import com.oose.tech_store.entity.Staff;
import com.oose.tech_store.entity.enums.AccountStatus;
import com.oose.tech_store.mapper.StaffMapper;
import com.oose.tech_store.repository.AccountRepository;
import com.oose.tech_store.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final StaffMapper staffMapper;

    @Transactional
    public StaffResponseDTO addStaff(CreateStaffRequestDTO request) {
        String email = normalizeEmail(request.email());
        String staffCode = request.staffCode().trim();

        if (accountRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        if (staffRepository.existsByStaffCodeIgnoreCase(staffCode)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Staff code already exists");
        }

        Staff staff = new Staff(
                request.fullName().trim(),
                request.phone(),
                staffCode,
                request.hireDate());
        staffRepository.save(staff);

        Account account = new Account(
                email,
                passwordEncoder.encode(request.initialPassword()),
                staff,
                AccountStatus.ACTIVE);
        accountRepository.save(account);

        return staffMapper.toResponse(staff);
    }

    @Transactional
    public StaffResponseDTO deleteStaff(String staffId) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Staff not found"));

        Account account = staff.getAccount();
        if (account == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Staff does not have an account");
        }

        account.delete();
        return staffMapper.toResponse(staff);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
