package com.oose.tech_store.dto.account;

import com.oose.tech_store.entity.enums.LoginStatus;
import java.time.LocalDateTime;

public record LoginLogResponse(
        String id,
        String email,
        String roleName,
        LoginStatus loginStatus,
        LocalDateTime loginTime) {
}
