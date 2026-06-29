package com.oose.tech_store.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.oose.tech_store.dto.account.AddStaffRequest;
import com.oose.tech_store.entity.Account;
import com.oose.tech_store.entity.Manager;
import com.oose.tech_store.entity.Staff;
import com.oose.tech_store.entity.enums.AccountStatus;
import com.oose.tech_store.exception.ApiException;
import com.oose.tech_store.repository.AccountRepository;
import com.oose.tech_store.repository.StaffRepository;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AccountManagementServiceTests {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private StaffRepository staffRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AccountSessionService accountSessionService;

    private AccountManagementService service;

    @BeforeEach
    void setUp() {
        service = new AccountManagementService(accountRepository, staffRepository, passwordEncoder,
                accountSessionService);
    }

    @Test
    void addStaffCreatesActiveAccountWithEncodedPassword() {
        AddStaffRequest request = new AddStaffRequest("Staff One", "staff@example.com", "0901234567",
                "ST001", LocalDate.now(), "password123");
        when(accountRepository.existsByEmailIgnoreCase("staff@example.com")).thenReturn(false);
        when(staffRepository.existsByStaffCodeIgnoreCase("ST001")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded-password");
        when(staffRepository.saveAndFlush(any(Staff.class))).thenAnswer(invocation -> {
            Staff staff = invocation.getArgument(0);
            staff.setId("staff-1");
            return staff;
        });
        when(accountRepository.saveAndFlush(any(Account.class))).thenAnswer(invocation -> {
            Account account = invocation.getArgument(0);
            account.setId("account-1");
            return account;
        });

        var response = service.addStaff("manager-account", request);

        assertEquals("staff-1", response.staffId());
        assertEquals("account-1", response.accountId());
        ArgumentCaptor<Account> account = ArgumentCaptor.forClass(Account.class);
        verify(accountRepository).saveAndFlush(account.capture());
        assertEquals("encoded-password", account.getValue().getPassword());
        assertEquals(AccountStatus.ACTIVE, account.getValue().getStatus());
    }

    @Test
    void blockAccountRejectsManagerTarget() {
        Manager manager = new Manager("Another Manager", "0900000001");
        manager.setId("manager-2");
        Account account = new Account("other-manager@example.com", "encoded", manager,
                AccountStatus.ACTIVE);
        account.setId("account-2");
        when(accountRepository.findById("account-2")).thenReturn(Optional.of(account));

        ApiException exception = assertThrows(ApiException.class,
                () -> service.blockAccount("account-1", "account-2"));

        assertEquals("System rules do not allow blocking this account", exception.getMessage());
    }

    @Test
    void deleteStaffSoftDeletesAccountAndExpiresSession() {
        Staff staff = new Staff("Staff One", "0901234567", "ST001", LocalDate.now());
        staff.setId("staff-1");
        Account account = new Account("staff@example.com", "encoded", staff, AccountStatus.ACTIVE);
        account.setId("account-1");
        when(staffRepository.findWithAccountById("staff-1")).thenReturn(Optional.of(staff));
        when(accountRepository.saveAndFlush(account)).thenReturn(account);

        var response = service.deleteStaff("manager-account", "staff-1");

        assertEquals(AccountStatus.DELETED, account.getStatus());
        assertEquals("account-1", response.accountId());
        verify(accountSessionService).expireAllSessions("account-1");
    }
}
