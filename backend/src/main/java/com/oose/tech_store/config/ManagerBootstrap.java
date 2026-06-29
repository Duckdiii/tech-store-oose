package com.oose.tech_store.config;

import com.oose.tech_store.entity.Account;
import com.oose.tech_store.entity.Manager;
import com.oose.tech_store.entity.enums.AccountStatus;
import com.oose.tech_store.repository.AccountRepository;
import com.oose.tech_store.repository.ManagerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class ManagerBootstrap implements ApplicationRunner {

    private static final Logger LOGGER = LoggerFactory.getLogger(ManagerBootstrap.class);

    private final ManagerRepository managerRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final String email;
    private final String password;
    private final String fullName;
    private final String phone;

    public ManagerBootstrap(ManagerRepository managerRepository, AccountRepository accountRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.bootstrap-manager.email:}") String email,
            @Value("${app.bootstrap-manager.password:}") String password,
            @Value("${app.bootstrap-manager.full-name:System Manager}") String fullName,
            @Value("${app.bootstrap-manager.phone:0900000000}") String phone) {
        this.managerRepository = managerRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.phone = phone;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (managerRepository.count() > 0 || email.isBlank() || password.isBlank()) {
            return;
        }
        Manager manager = managerRepository.save(new Manager(fullName, phone));
        Account account = new Account(email.trim().toLowerCase(), passwordEncoder.encode(password),
                manager, AccountStatus.ACTIVE);
        accountRepository.save(account);
        LOGGER.info("Created bootstrap Manager account {}", email);
    }
}
