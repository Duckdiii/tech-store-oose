package com.oose.tech_store.dto.recovery;

import java.util.Map;

/**
 * The locally managed application state used by the recovery workflow.
 *
 * <p>Keeping it in a JSON document makes the feature safe to exercise from
 * Postman without touching the configured PostgreSQL/Supabase database.</p>
 */
public record RecoveryStateDTO(String applicationVersion, Map<String, Object> data) {
}
