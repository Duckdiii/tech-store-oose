package com.oose.tech_store.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.oose.tech_store.dto.account.LoginRequest;
import com.oose.tech_store.entity.Account;
import com.oose.tech_store.entity.LoginLog;
import com.oose.tech_store.entity.Manager;
import com.oose.tech_store.entity.enums.AccountStatus;
import com.oose.tech_store.entity.enums.LoginStatus;
import com.oose.tech_store.exception.ApiException;
import com.oose.tech_store.repository.AccountRepository;
import com.oose.tech_store.repository.LoginLogRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTests {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private LoginLogRepository loginLogRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(accountRepository, loginLogRepository, passwordEncoder);
    }

    @Test
    void loginReturnsManagerRoleAndRecordsSuccess() {
        Manager manager = new Manager("System Manager", "0900000000");
        manager.setId("manager-1");
        Account account = new Account("manager@example.com", "encoded", manager, AccountStatus.ACTIVE);
        account.setId("account-1");
        when(accountRepository.findByEmailIgnoreCase("manager@example.com"))
                .thenReturn(Optional.of(account));
        when(passwordEncoder.matches("password123", "encoded")).thenReturn(true);

        var result = authService.login(new LoginRequest("MANAGER@example.com", "password123"));

        assertEquals("MANAGER", result.response().role());
        assertEquals("account-1", result.response().accountId());
        ArgumentCaptor<LoginLog> log = ArgumentCaptor.forClass(LoginLog.class);
        verify(loginLogRepository).save(log.capture());
        assertEquals(LoginStatus.SUCCESS, log.getValue().getLoginStatus());
    }

    @Test
    void loginWithUnknownEmailRecordsFailure() {
        when(accountRepository.findByEmailIgnoreCase("unknown@example.com"))
                .thenReturn(Optional.empty());

        ApiException exception = assertThrows(ApiException.class,
                () -> authService.login(new LoginRequest("unknown@example.com", "password123")));

        assertEquals("Incorrect email or password. Please try again", exception.getMessage());
        verify(loginLogRepository).save(any(LoginLog.class));
    }
}
