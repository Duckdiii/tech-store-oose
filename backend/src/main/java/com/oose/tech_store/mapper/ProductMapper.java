package com.oose.tech_store.mapper;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import com.oose.tech_store.dto.ProductDetailResponseDTO;
import com.oose.tech_store.dto.ProductResponseDTO;
import com.oose.tech_store.dto.ProductSearchResponseDTO;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.ProductImage;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.entity.Promotion;

public class ProductMapper {

    private ProductMapper() {
        // utility class
    }

    /**
     * Map to simple response DTO (legacy/basic).
     */
    public static ProductResponseDTO toResponse(Product p, List<ProductVariant> variants) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        BigDecimal price = (variants == null || variants.isEmpty()) ? BigDecimal.ZERO : variants.get(0).getPrice();
        dto.setPrice(price);
        return dto;
    }

    /**
     * Map to search result summary DTO with brand, category, lowest price, thumbnail.
     */
    public static ProductSearchResponseDTO toSearchResponse(Product p, List<ProductVariant> availableVariants) {
        ProductSearchResponseDTO dto = new ProductSearchResponseDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setDescription(truncateDescription(p.getDescription(), 150));

        // Brand
        if (p.getBrand() != null) {
            dto.setBrandName(p.getBrand().getName());
            dto.setBrandLogoUrl(p.getBrand().getLogoUrl());
        }

        // Category
        if (p.getCategory() != null) {
            dto.setCategoryName(p.getCategory().getName());
        }

        // Find active promotion
        Double maxDiscountPercent = (p.getPromotions() == null) ? null : p.getPromotions().stream()
                .filter(Promotion::isActiveNow)
                .map(Promotion::getDiscountPercent)
                .max(Double::compareTo)
                .orElse(null);

        if (maxDiscountPercent != null && maxDiscountPercent > 0) {
            dto.setDiscountPercent(maxDiscountPercent);
            dto.setDiscount("-" + Math.round(maxDiscountPercent) + "%");
        }

        // Lowest price from available variants
        if (availableVariants != null && !availableVariants.isEmpty()) {
            BigDecimal lowest = availableVariants.stream()
                    .map(ProductVariant::getPrice)
                    .filter(price -> price != null)
                    .min(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO);
            
            dto.setOriginalPrice(lowest);
            if (maxDiscountPercent != null && maxDiscountPercent > 0) {
                BigDecimal discountFactor = BigDecimal.ONE.subtract(BigDecimal.valueOf(maxDiscountPercent).divide(BigDecimal.valueOf(100)));
                dto.setLowestPrice(lowest.multiply(discountFactor));
            } else {
                dto.setLowestPrice(lowest);
            }
            dto.setAvailableVariantCount(availableVariants.size());
        } else {
            dto.setOriginalPrice(BigDecimal.ZERO);
            dto.setLowestPrice(BigDecimal.ZERO);
            dto.setAvailableVariantCount(0);
        }

        // Thumbnail (first image)
        if (p.getImages() != null && !p.getImages().isEmpty()) {
            dto.setThumbnailUrl(p.getImages().get(0).getImageUrl());
        }

        return dto;
    }

    /**
     * Map to full detail DTO with all specs, variants, images.
     */
    public static ProductDetailResponseDTO toDetailResponse(Product p, List<ProductVariant> variants) {
        ProductDetailResponseDTO dto = new ProductDetailResponseDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());

        // Brand
        if (p.getBrand() != null) {
            dto.setBrandId(p.getBrand().getId());
            dto.setBrandName(p.getBrand().getName());
            dto.setBrandLogoUrl(p.getBrand().getLogoUrl());
        }

        // Category
        if (p.getCategory() != null) {
            dto.setCategoryId(p.getCategory().getId());
            dto.setCategoryName(p.getCategory().getName());
        }

        // Specs
        dto.setScreenSize(p.getScreenSize());
        dto.setRearCamera(p.getRearCamera());
        dto.setFrontCamera(p.getFrontCamera());
        dto.setChipset(p.getChipset());
        dto.setNfcSupported(p.getNfcSupported());
        dto.setBatteryCapacity(p.getBatteryCapacity());
        dto.setSimType(p.getSimType());
        dto.setOperatingSystem(p.getOperatingSystem());
        dto.setScreenResolution(p.getScreenResolution());

        // Active promotion discount (same rule as search results: highest active discount wins)
        Double maxDiscountPercent = (p.getPromotions() == null) ? null : p.getPromotions().stream()
                .filter(Promotion::isActiveNow)
                .map(Promotion::getDiscountPercent)
                .max(Double::compareTo)
                .orElse(null);
        BigDecimal discountFactor = (maxDiscountPercent != null && maxDiscountPercent > 0)
                ? BigDecimal.ONE.subtract(BigDecimal.valueOf(maxDiscountPercent).divide(BigDecimal.valueOf(100)))
                : null;

        // Variants
        if (variants != null) {
            List<ProductDetailResponseDTO.VariantDTO> variantDTOs = variants.stream()
                    .sorted(Comparator.comparing(ProductVariant::getPrice, Comparator.nullsLast(BigDecimal::compareTo)))
                    .map(v -> {
                        ProductDetailResponseDTO.VariantDTO vDto = new ProductDetailResponseDTO.VariantDTO();
                        vDto.setId(v.getId());
                        vDto.setRamGb(v.getRamGb());
                        vDto.setStorageGb(v.getStorageGb());
                        vDto.setColor(v.getColor());
                        vDto.setOriginalPrice(v.getPrice());
                        vDto.setPrice(discountFactor != null ? v.getPrice().multiply(discountFactor) : v.getPrice());
                        vDto.setStatus(v.getStatus() != null ? v.getStatus().name() : null);
                        return vDto;
                    })
                    .collect(Collectors.toList());
            dto.setVariants(variantDTOs);
        }

        // Images
        if (p.getImages() != null) {
            List<ProductDetailResponseDTO.ImageDTO> imageDTOs = p.getImages().stream()
                    .map(img -> {
                        ProductDetailResponseDTO.ImageDTO iDto = new ProductDetailResponseDTO.ImageDTO();
                        iDto.setId(img.getId());
                        iDto.setName(img.getName());
                        iDto.setImageUrl(img.getImageUrl());
                        return iDto;
                    })
                    .collect(Collectors.toList());
            dto.setImages(imageDTOs);
        }

        return dto;
    }

    private static String truncateDescription(String description, int maxLength) {
        if (description == null) {
            return null;
        }
        if (description.length() <= maxLength) {
            return description;
        }
        return description.substring(0, maxLength) + "...";
    }
}
