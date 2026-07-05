package com.oose.tech_store.dto.manage;

public record ManageProductStatusCountsDTO(
        long all,
        long active,
        long low,
        long hidden) {
}
