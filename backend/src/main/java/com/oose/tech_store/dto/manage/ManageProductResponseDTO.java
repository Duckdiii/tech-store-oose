package com.oose.tech_store.dto.manage;

import java.util.List;

public record ManageProductResponseDTO(
                String id,
                String name,
                String description,
                String brandId,
                String brand,
                String categoryId,
                String category,
                Double screenSize,
                String rearCamera,
                String frontCamera,
                String chipset,
                Boolean nfcSupported,
                Integer batteryCapacity,
                String simType,
                String operatingSystem,
                String screenResolution,
                Integer stock,
                List<ImageDTO> images) {

        public record ImageDTO(
                        String id,
                        String name,
                        String imageUrl) {
        }
}
