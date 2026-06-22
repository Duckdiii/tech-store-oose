package com.oose.tech_store.entity;

import com.oose.tech_store.entity.enums.AccountStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "accounts", uniqueConstraints = {
        @UniqueConstraint(name = "uk_accounts_email", columnNames = "email"),
        @UniqueConstraint(name = "uk_accounts_user", columnNames = "user_id")
})
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Account extends BaseEntity {

    @Column(name = "email", nullable = false, length = 150)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private AccountStatus status = AccountStatus.ACTIVE;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @OneToMany(mappedBy = "account", fetch = FetchType.LAZY)
    private List<LoginLog> loginLogs = new ArrayList<>();

    public Account(String email, String password, User user, AccountStatus status) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("email must not be blank");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("password must not be blank");
        }
        if (user == null) {
            throw new IllegalArgumentException("user must not be null");
        }
        if (status == null) {
            throw new IllegalArgumentException("status must not be null");
        }
        this.email = email;
        this.password = password;
        this.status = status;
        attachUser(user);
    }

    public void activate() {
        status = AccountStatus.ACTIVE;
    }

    public void block() {
        status = AccountStatus.BLOCKED;
    }

    public void unlock() {
        activate();
    }

    public boolean isActive() {
        return AccountStatus.ACTIVE.equals(status);
    }

    public boolean isBlocked() {
        return AccountStatus.BLOCKED.equals(status);
    }

    public void delete() {
        status = AccountStatus.DELETED;
    }

    public boolean isDeleted() {
        return AccountStatus.DELETED.equals(status);
    }

    public void changeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("email must not be blank");
        }
        this.email = email;
    }

    public void changePassword(String encodedPassword) {
        if (encodedPassword == null || encodedPassword.isBlank()) {
            throw new IllegalArgumentException("encodedPassword must not be blank");
        }
        password = encodedPassword;
    }

    public void recordLoginSuccess() {
        LoginLog.success(this);
    }

    public void recordLoginFailure() {
        LoginLog.failure(this);
    }

    public void attachUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("user must not be null");
        }
        if (this.user == user) {
            user.setAccount(this);
            return;
        }
        if (this.user != null) {
            this.user.setAccount(null);
        }
        if (user.getAccount() != null && user.getAccount() != this) {
            user.getAccount().setUser(null);
        }
        this.user = user;
        user.setAccount(this);
    }
}
