package com.oose.tech_store.dto.recovery;

import java.util.List;

public record RecoveryPointResponseDTO(
        String id,
        String createdAt,
        String applicationVersion,
        String description,
        String checksum,
        List<String> availableScopes
) {
}
