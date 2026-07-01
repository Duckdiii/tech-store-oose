package com.oose.tech_store.service.auth;

import com.oose.tech_store.dto.account.LoginLogResponse;
import com.oose.tech_store.dto.account.PageResponse;
import com.oose.tech_store.entity.LoginLog;
import com.oose.tech_store.entity.enums.LoginStatus;
import com.oose.tech_store.exception.ApiException;
import com.oose.tech_store.repository.LoginLogRepository;
import jakarta.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoginLogService {

    private final LoginLogRepository loginLogRepository;

    public LoginLogService(LoginLogRepository loginLogRepository) {
        this.loginLogRepository = loginLogRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<LoginLogResponse> search(String email, String roleName, LoginStatus status,
            LocalDateTime from, LocalDateTime to, Pageable pageable) {
        validateRange(from, to);
        try {
            return PageResponse.from(loginLogRepository
                    .findAll(specification(email, roleName, status, from, to), pageable)
                    .map(this::toResponse));
        } catch (DataAccessException exception) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to load login log information. Please try again later");
        }
    }

    @Transactional(readOnly = true)
    public String exportCsv(String email, String roleName, LoginStatus status,
            LocalDateTime from, LocalDateTime to) {
        validateRange(from, to);
        try {
            StringBuilder csv = new StringBuilder("id,email,role,loginStatus,loginTime\n");
            loginLogRepository.findAll(specification(email, roleName, status, from, to)).forEach(log ->
                    csv.append(csv(log.getId())).append(',')
                            .append(csv(log.getEmail())).append(',')
                            .append(csv(log.getRoleName())).append(',')
                            .append(csv(log.getLoginStatus().name())).append(',')
                            .append(csv(log.getLoginTime().toString())).append('\n'));
            return csv.toString();
        } catch (DataAccessException exception) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to load login log information. Please try again later");
        }
    }

    private void validateRange(LocalDateTime from, LocalDateTime to) {
        if (from != null && to != null && from.isAfter(to)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid login time range");
        }
    }

    private Specification<LoginLog> specification(String email, String roleName, LoginStatus status,
            LocalDateTime from, LocalDateTime to) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (email != null && !email.isBlank()) {
                predicates.add(builder.like(builder.lower(root.get("email")),
                        "%" + email.trim().toLowerCase(Locale.ROOT) + "%"));
            }
            if (roleName != null && !roleName.isBlank()) {
                predicates.add(builder.equal(builder.upper(root.get("roleName")),
                        roleName.trim().toUpperCase(Locale.ROOT)));
            }
            if (status != null) {
                predicates.add(builder.equal(root.get("loginStatus"), status));
            }
            if (from != null) {
                predicates.add(builder.greaterThanOrEqualTo(root.get("loginTime"), from));
            }
            if (to != null) {
                predicates.add(builder.lessThanOrEqualTo(root.get("loginTime"), to));
            }
            return builder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private LoginLogResponse toResponse(LoginLog log) {
        return new LoginLogResponse(log.getId(), log.getEmail(), log.getRoleName(),
                log.getLoginStatus(), log.getLoginTime());
    }

    private String csv(String value) {
        if (value == null) {
            return "";
        }
        return '"' + value.replace("\"", "\"\"") + '"';
    }
}
