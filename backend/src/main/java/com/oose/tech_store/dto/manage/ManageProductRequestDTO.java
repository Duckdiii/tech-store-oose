package com.oose.tech_store.dto.manage;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import java.util.List;

public record ManageProductRequestDTO(
        @NotBlank String name,
        String description,
        String brandId,
        String brand,
        String categoryId,
        String category,
        @Positive Double screenSize,
        String rearCamera,
        String frontCamera,
        String chipset,
        Boolean nfcSupported,
        @Positive Integer batteryCapacity,
        String simType,
        String operatingSystem,
        String screenResolution,
        @Valid List<ImageRequestDTO> images) {

    public record ImageRequestDTO(
            String name,
            @NotBlank String imageUrl) {
    }
}
