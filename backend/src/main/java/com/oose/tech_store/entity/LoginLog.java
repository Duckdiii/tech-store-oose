package com.oose.tech_store.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import com.oose.tech_store.entity.enums.LoginStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "login_logs")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LoginLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    @Column(name = "email", nullable = false, length = 150)
    private String email;

    @Column(name = "role_name", length = 50)
    private String roleName;

    @Enumerated(EnumType.STRING)
    @Column(name = "login_status", nullable = false, length = 30)
    private LoginStatus loginStatus;

    @Column(name = "login_time", nullable = false)
    private LocalDateTime loginTime;

    public LoginLog(Account account, String email, String roleName, LoginStatus loginStatus) {
        if (account == null) {
            throw new IllegalArgumentException("account must not be null");
        }
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("email must not be blank");
        }
        if (loginStatus == null) {
            throw new IllegalArgumentException("loginStatus must not be null");
        }
        this.account = account;
        this.email = email;
        this.roleName = roleName;
        this.loginStatus = loginStatus;
        this.loginTime = LocalDateTime.now();
    }

    public static LoginLog success(Account account) {
        if (account == null) {
            throw new IllegalArgumentException("account must not be null");
        }
        return new LoginLog(account, account.getEmail(), resolveRoleName(account), LoginStatus.SUCCESS);
    }

    private static String resolveRoleName(Account account) {
        User user = account.getUser();
        if (user instanceof Manager) {
            return "MANAGER";
        }
        if (user instanceof Staff) {
            return "STAFF";
        }
        if (user instanceof Customer) {
            return "CUSTOMER";
        }
        return null;
    }

    public static LoginLog failure(Account account) {
        if (account == null) {
            throw new IllegalArgumentException("account must not be null");
        }
        return new LoginLog(account, account.getEmail(), resolveRoleName(account), LoginStatus.FAILED);
    }

    public static LoginLog failure(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("email must not be blank");
        }
        LoginLog log = new LoginLog();
        log.email = email;
        log.loginStatus = LoginStatus.FAILED;
        log.loginTime = LocalDateTime.now();
        return log;
    }

    public boolean isSuccess() {
        return LoginStatus.SUCCESS.equals(loginStatus);
    }
}
