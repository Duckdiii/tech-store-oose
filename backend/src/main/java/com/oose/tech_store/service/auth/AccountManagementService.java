package com.oose.tech_store.service.auth;

import com.oose.tech_store.dto.account.AccountResponse;
import com.oose.tech_store.dto.account.AddStaffRequest;
import com.oose.tech_store.dto.account.BlockAccountResponse;
import com.oose.tech_store.dto.account.PageResponse;
import com.oose.tech_store.dto.account.StaffMutationResponse;
import com.oose.tech_store.dto.account.StaffResponse;
import com.oose.tech_store.entity.Account;
import com.oose.tech_store.entity.Manager;
import com.oose.tech_store.entity.Staff;
import com.oose.tech_store.entity.enums.AccountStatus;
import com.oose.tech_store.exception.ApiException;
import com.oose.tech_store.repository.AccountRepository;
import com.oose.tech_store.repository.StaffRepository;
import com.oose.tech_store.security.UserRoleResolver;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountManagementService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AccountManagementService.class);

    private final AccountRepository accountRepository;
    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;
    private final AccountSessionService accountSessionService;

    public AccountManagementService(AccountRepository accountRepository, StaffRepository staffRepository,
            PasswordEncoder passwordEncoder, AccountSessionService accountSessionService) {
        this.accountRepository = accountRepository;
        this.staffRepository = staffRepository;
        this.passwordEncoder = passwordEncoder;
        this.accountSessionService = accountSessionService;
    }

    @Transactional(readOnly = true)
    public PageResponse<AccountResponse> searchAccounts(String query, AccountStatus status, Pageable pageable) {
        return PageResponse.from(accountRepository.findAll(accountSpecification(query, status), pageable)
                .map(this::toAccountResponse));
    }

    @Transactional
    public BlockAccountResponse blockAccount(String managerAccountId, String targetAccountId) {
        try {
            Account target = findAccount(targetAccountId);
            if (target.isBlocked()) {
                // Exception Flow 8a
                throw new ApiException(HttpStatus.CONFLICT, "This account already has Blocked status");
            }
            if (target.getId().equals(managerAccountId) || target.getUser() instanceof Manager
                    || target.isDeleted()) {
                // Exception Flow 8b
                throw new ApiException(HttpStatus.FORBIDDEN,
                        "System rules do not allow blocking this account");
            }
            target.block();
            accountRepository.saveAndFlush(target);
            accountSessionService.expireAllSessions(targetAccountId);
            LOGGER.info("Manager account {} blocked account {}", managerAccountId, targetAccountId);
            return new BlockAccountResponse(targetAccountId, target.getStatus(),
                    "Account blocked successfully");
        } catch (ApiException exception) {
            throw exception;
        } catch (DataAccessException exception) {
            // Exception Flow 8c
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to block account. Please try again later");
        }
    }

    @Transactional
    public BlockAccountResponse unblockAccount(String managerAccountId, String targetAccountId) {
        try {
            Account target = findAccount(targetAccountId);
            if (!target.isBlocked()) {
                throw new ApiException(HttpStatus.CONFLICT, "Tài khoản này chưa bị khóa");
            }
            target.unlock();
            accountRepository.saveAndFlush(target);
            LOGGER.info("Manager account {} unblocked account {}", managerAccountId, targetAccountId);
            return new BlockAccountResponse(targetAccountId, target.getStatus(),
                    "Account unblocked successfully");
        } catch (ApiException exception) {
            throw exception;
        } catch (DataAccessException exception) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Không thể mở khóa tài khoản. Vui lòng thử lại sau");
        }
    }

    @Transactional(readOnly = true)
    public PageResponse<StaffResponse> searchStaff(String criteria, Pageable pageable) {
        String normalized = criteria == null || criteria.isBlank() ? null : criteria.trim();
        return PageResponse.from(staffRepository.searchActive(normalized, AccountStatus.DELETED, pageable)
                .map(this::toStaffResponse));
    }

    @Transactional(readOnly = true)
    public StaffResponse getStaffDetails(String staffId) {
        return toStaffResponse(findStaff(staffId));
    }

    @Transactional
    public StaffMutationResponse addStaff(String managerAccountId, AddStaffRequest request) {
        try {
            String email = request.email().trim().toLowerCase(Locale.ROOT);
            if (accountRepository.existsByEmailIgnoreCase(email)) {
                // Exception Flow 4c (Add Staff) / 1b (Create Account)
                throw new ApiException(HttpStatus.CONFLICT, "Email already exists");
            }
            if (staffRepository.existsByStaffCodeIgnoreCase(request.staffCode().trim())) {
                throw new ApiException(HttpStatus.CONFLICT, "Mã nhân viên đã tồn tại");
            }

            Staff staff = new Staff(request.fullName().trim(), request.phone().trim(),
                    request.staffCode().trim(), request.hireDate());
            staff = staffRepository.saveAndFlush(staff);
            Account account = createAccount(staff, email, request.initialPassword());
            LOGGER.info("Manager account {} added staff {} with account {}", managerAccountId,
                    staff.getId(), account.getId());
            return new StaffMutationResponse(staff.getId(), account.getId(),
                    "Staff added successfully");
        } catch (ApiException exception) {
            throw exception;
        } catch (DataAccessException exception) {
            // Exception Flow 6a
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to add Staff. Please try again later");
        }
    }

    @Transactional
    public StaffMutationResponse deleteStaff(String managerAccountId, String staffId) {
        try {
            Staff staff = findStaff(staffId);
            Account account = staff.getAccount();
            if (account == null) {
                // Exception Flow 8a (Delete Account 1a: account does not exist)
                throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                        "Unable to remove Staff account access. Please try again later.");
            }
            if (account.isDeleted()) {
                throw new ApiException(HttpStatus.CONFLICT, "Tài khoản nhân viên đã bị xóa trước đó");
            }
            deleteAccount(account);
            LOGGER.info("Manager account {} deleted staff {} account access {}", managerAccountId,
                    staffId, account.getId());
            return new StaffMutationResponse(staffId, account.getId(),
                    "Staff deleted successfully");
        } catch (ApiException exception) {
            throw exception;
        } catch (DataAccessException exception) {
            // Exception Flow 9a
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to delete Staff. Please try again later");
        }
    }

    private Account createAccount(Staff staff, String email, String initialPassword) {
        try {
            return accountRepository.saveAndFlush(new Account(email,
                    passwordEncoder.encode(initialPassword), staff, AccountStatus.ACTIVE));
        } catch (DataAccessException exception) {
            // Exception Flow 1c (Create Account) / 5a (Add Staff)
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to create Staff account. Please try again later");
        }
    }

    private void deleteAccount(Account account) {
        if (!(account.getUser() instanceof Staff)) {
            // Delete Account Exception Flow 1b, surfaced via Delete Staff Exception Flow 8a
            throw new ApiException(HttpStatus.FORBIDDEN,
                    "Unable to remove Staff account access. Please try again later.");
        }
        account.delete();
        accountRepository.saveAndFlush(account);
        accountSessionService.expireAllSessions(account.getId());
    }

    private Account findAccount(String accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Tài khoản không tồn tại"));
    }

    private Staff findStaff(String staffId) {
        return staffRepository.findWithAccountById(staffId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy nhân viên"));
    }

    private StaffResponse toStaffResponse(Staff staff) {
        Account account = staff.getAccount();
        return new StaffResponse(staff.getId(), staff.getFullName(), staff.getPhone(),
                staff.getStaffCode(), staff.getHireDate(), account.getId(), account.getEmail(),
                account.getStatus());
    }

    private AccountResponse toAccountResponse(Account account) {
        return new AccountResponse(account.getId(), account.getEmail(), account.getStatus(),
                UserRoleResolver.resolve(account.getUser()), account.getUser().getId(),
                account.getUser().getFullName());
    }

    private Specification<Account> accountSpecification(String query, AccountStatus status) {
        return (root, criteriaQuery, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (query != null && !query.isBlank()) {
                String pattern = "%" + query.trim().toLowerCase(Locale.ROOT) + "%";
                predicates.add(builder.or(
                        builder.like(builder.lower(root.get("email")), pattern),
                        builder.like(builder.lower(root.get("user").get("fullName")), pattern)));
            }
            if (status != null) {
                predicates.add(builder.equal(root.get("status"), status));
            }
            return builder.and(predicates.toArray(Predicate[]::new));
        };
    }
}
