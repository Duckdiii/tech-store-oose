package com.oose.tech_store.service.product;

import com.oose.tech_store.dto.admin.AdminProductRequestDTO;
import com.oose.tech_store.dto.admin.AdminProductResponseDTO;
import com.oose.tech_store.entity.Brand;
import com.oose.tech_store.entity.Category;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.ProductImage;
import com.oose.tech_store.exception.ResourceNotFoundException;
import com.oose.tech_store.repository.BrandRepository;
import com.oose.tech_store.repository.CategoryRepository;
import com.oose.tech_store.repository.ProductRepository;
import com.oose.tech_store.repository.ProductVariantRepository;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final ProductVariantRepository productVariantRepository;

    @Transactional(readOnly = true)
    public List<AdminProductResponseDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .sorted(Comparator.comparing(Product::getName, String.CASE_INSENSITIVE_ORDER))
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminProductResponseDTO getProductById(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return toResponse(product);
    }

    @Transactional
    public AdminProductResponseDTO createProduct(AdminProductRequestDTO request) {
        Product product = new Product(
                cleanRequired(request.name(), "Product name is required"),
                cleanOptional(request.description()),
                resolveBrand(request),
                resolveCategory(request));
        applyProductDetails(product, request);
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public AdminProductResponseDTO updateProduct(String id, AdminProductRequestDTO request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setName(cleanRequired(request.name(), "Product name is required"));
        product.setDescription(cleanOptional(request.description()));
        resolveBrand(request).addProduct(product);
        resolveCategory(request).addProduct(product);
        applyProductDetails(product, request);

        return toResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        long variantCount = productVariantRepository.countByProductId(id);
        if (variantCount > 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete product while warehouse items still exist");
        }

        productRepository.delete(product);
    }

    private void applyProductDetails(Product product, AdminProductRequestDTO request) {
        product.setScreenSize(request.screenSize());
        product.setRearCamera(cleanOptional(request.rearCamera()));
        product.setFrontCamera(cleanOptional(request.frontCamera()));
        product.setChipset(cleanOptional(request.chipset()));
        product.setNfcSupported(request.nfcSupported());
        product.setBatteryCapacity(request.batteryCapacity());
        product.setSimType(cleanOptional(request.simType()));
        product.setOperatingSystem(cleanOptional(request.operatingSystem()));
        product.setScreenResolution(cleanOptional(request.screenResolution()));

        product.getImages().clear();
        if (request.images() == null) {
            return;
        }
        request.images().stream()
                .filter(image -> image.imageUrl() != null && !image.imageUrl().isBlank())
                .forEach(image -> new ProductImage(
                        product,
                        cleanOptional(image.name()),
                        image.imageUrl().trim()));
    }

    private Brand resolveBrand(AdminProductRequestDTO request) {
        String brandId = cleanOptional(request.brandId());
        if (brandId != null) {
            return brandRepository.findById(brandId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Brand was not found"));
        }

        String brandName = cleanRequired(request.brand(), "Brand is required");
        return brandRepository.findByNameIgnoreCase(brandName)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Brand was not found"));
    }

    private Category resolveCategory(AdminProductRequestDTO request) {
        String categoryId = cleanOptional(request.categoryId());
        if (categoryId != null) {
            return categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category was not found"));
        }

        String categoryName = cleanRequired(request.category(), "Category is required");
        return categoryRepository.findByNameIgnoreCase(categoryName)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category was not found"));
    }

    private String cleanRequired(String value, String message) {
        String cleaned = cleanOptional(value);
        if (cleaned == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return cleaned;
    }

    private String cleanOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private AdminProductResponseDTO toResponse(Product product) {
        Brand brand = product.getBrand();
        Category category = product.getCategory();

        List<AdminProductResponseDTO.ImageDTO> images = product.getImages().stream()
                .map(this::toImageResponse)
                .toList();

        return new AdminProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                brand != null ? brand.getId() : null,
                brand != null ? brand.getName() : null,
                category != null ? category.getId() : null,
                category != null ? category.getName() : null,
                product.getScreenSize(),
                product.getRearCamera(),
                product.getFrontCamera(),
                product.getChipset(),
                product.getNfcSupported(),
                product.getBatteryCapacity(),
                product.getSimType(),
                product.getOperatingSystem(),
                product.getScreenResolution(),
                images);
    }

    private AdminProductResponseDTO.ImageDTO toImageResponse(ProductImage image) {
        return new AdminProductResponseDTO.ImageDTO(
                image.getId(),
                image.getName(),
                image.getImageUrl());
    }
}
