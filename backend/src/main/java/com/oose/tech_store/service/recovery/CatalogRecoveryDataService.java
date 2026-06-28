package com.oose.tech_store.service.recovery;

import com.oose.tech_store.dto.recovery.RecoveryScope;
import com.oose.tech_store.entity.Brand;
import com.oose.tech_store.entity.Category;
import com.oose.tech_store.entity.Product;
import com.oose.tech_store.entity.ProductImage;
import com.oose.tech_store.entity.ProductVariant;
import com.oose.tech_store.entity.enums.ProductVariantStatus;
import com.oose.tech_store.repository.BrandRepository;
import com.oose.tech_store.repository.CategoryRepository;
import com.oose.tech_store.repository.ProductRepository;
import com.oose.tech_store.repository.ProductVariantRepository;
import com.oose.tech_store.service.recovery.RecoveryCatalogSnapshot.BrandSnapshot;
import com.oose.tech_store.service.recovery.RecoveryCatalogSnapshot.CategorySnapshot;
import com.oose.tech_store.service.recovery.RecoveryCatalogSnapshot.ProductImageSnapshot;
import com.oose.tech_store.service.recovery.RecoveryCatalogSnapshot.ProductSnapshot;
import com.oose.tech_store.service.recovery.RecoveryCatalogSnapshot.ProductVariantSnapshot;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CatalogRecoveryDataService {

    private static final int SCHEMA_VERSION = 1;

    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    @Transactional(readOnly = true)
    public RecoveryCatalogSnapshot snapshot(RecoveryScope scope) {
        validateSupportedScope(scope);

        var brands = brandRepository.findAll().stream()
                .map(brand -> new BrandSnapshot(
                        brand.getId(),
                        brand.getName(),
                        brand.getLogoUrl(),
                        brand.getDescription()))
                .toList();

        var categories = categoryRepository.findAll().stream()
                .map(category -> new CategorySnapshot(
                        category.getId(),
                        category.getName(),
                        category.getImageUrl()))
                .toList();

        var products = productRepository.findAll().stream()
                .map(product -> new ProductSnapshot(
                        product.getId(),
                        product.getName(),
                        product.getDescription(),
                        product.getBrand().getId(),
                        product.getCategory().getId(),
                        product.getScreenSize(),
                        product.getRearCamera(),
                        product.getFrontCamera(),
                        product.getChipset(),
                        product.getNfcSupported(),
                        product.getBatteryCapacity(),
                        product.getSimType(),
                        product.getOperatingSystem(),
                        product.getScreenResolution(),
                        product.getImages().stream()
                                .map(image -> new ProductImageSnapshot(
                                        image.getId(),
                                        image.getName(),
                                        image.getImageUrl()))
                                .toList()))
                .toList();

        var variants = productVariantRepository.findAll().stream()
                .map(variant -> new ProductVariantSnapshot(
                        variant.getId(),
                        variant.getProduct().getId(),
                        variant.getRamGb(),
                        variant.getStorageGb(),
                        variant.getColor(),
                        variant.getPrice(),
                        variant.getStatus()))
                .toList();

        return new RecoveryCatalogSnapshot(SCHEMA_VERSION, brands, categories, products, variants);
    }

    @Transactional
    public void restore(RecoveryCatalogSnapshot snapshot, RecoveryScope scope) {
        validateSupportedScope(scope);
        validateSnapshot(snapshot, scope);

        Map<String, Brand> brands = new HashMap<>();
        for (BrandSnapshot source : snapshot.brands()) {
            Brand brand = brandRepository.findById(source.id())
                    .orElseGet(() -> {
                        Brand created = new Brand(
                                fallback(source.name(), "Restored Brand"),
                                fallback(source.logoUrl(), "restored-brand.png"),
                                fallback(source.description(), "Restored from backup"));
                        created.setId(source.id());
                        return created;
                    });
            brand.setName(source.name());
            brand.setLogoUrl(source.logoUrl());
            brand.setDescription(source.description());
            brands.put(source.id(), brandRepository.save(brand));
        }

        Map<String, Category> categories = new HashMap<>();
        for (CategorySnapshot source : snapshot.categories()) {
            Category category = categoryRepository.findById(source.id())
                    .orElseGet(() -> {
                        Category created = new Category(
                                fallback(source.name(), "Restored Category"),
                                fallback(source.imageUrl(), "restored-category.png"));
                        created.setId(source.id());
                        return created;
                    });
            category.setName(source.name());
            category.setImageUrl(source.imageUrl());
            categories.put(source.id(), categoryRepository.save(category));
        }

        Map<String, Product> products = new HashMap<>();
        for (ProductSnapshot source : snapshot.products()) {
            Brand brand = brands.get(source.brandId());
            Category category = categories.get(source.categoryId());
            Product product = productRepository.findById(source.id())
                    .orElseGet(() -> {
                        Product created = new Product(
                                fallback(source.name(), "Restored Product"),
                                source.description(),
                                brand,
                                category);
                        created.setId(source.id());
                        return created;
                    });

            product.setName(source.name());
            product.setDescription(source.description());
            brand.addProduct(product);
            category.addProduct(product);
            product.setScreenSize(source.screenSize());
            product.setRearCamera(source.rearCamera());
            product.setFrontCamera(source.frontCamera());
            product.setChipset(source.chipset());
            product.setNfcSupported(source.nfcSupported());
            product.setBatteryCapacity(source.batteryCapacity());
            product.setSimType(source.simType());
            product.setOperatingSystem(source.operatingSystem());
            product.setScreenResolution(source.screenResolution());
            product.getImages().clear();
            for (ProductImageSnapshot imageSource : safeImages(source)) {
                ProductImage image = new ProductImage(product, imageSource.name(), imageSource.imageUrl());
                image.setId(imageSource.id());
            }
            products.put(source.id(), productRepository.save(product));
        }

        var restoredVariants = new ArrayList<ProductVariant>();
        for (ProductVariantSnapshot source : snapshot.variants()) {
            Product product = products.get(source.productId());
            ProductVariant variant = productVariantRepository.findById(source.id())
                    .orElseGet(() -> {
                        ProductVariant created = new ProductVariant(
                                product,
                                source.ramGb(),
                                source.storageGb(),
                                source.color(),
                                source.price());
                        created.setId(source.id());
                        return created;
                    });
            variant.setProduct(product);
            variant.setRamGb(source.ramGb());
            variant.setStorageGb(source.storageGb());
            variant.setColor(source.color());
            variant.setPrice(source.price());
            variant.setStatus(source.status() == null ? ProductVariantStatus.AVAILABLE : source.status());
            restoredVariants.add(variant);
        }
        productVariantRepository.saveAll(restoredVariants);
    }

    public void validateSnapshot(RecoveryCatalogSnapshot snapshot, RecoveryScope scope) {
        validateSupportedScope(scope);
        if (snapshot == null || snapshot.schemaVersion() != SCHEMA_VERSION) {
            throw new IllegalArgumentException("The restored backup is incompatible with the current application version");
        }

        Set<String> brandIds = new HashSet<>();
        for (BrandSnapshot brand : safeBrands(snapshot)) {
            requireId(brand.id(), "brand");
            brandIds.add(brand.id());
        }

        Set<String> categoryIds = new HashSet<>();
        for (CategorySnapshot category : safeCategories(snapshot)) {
            requireId(category.id(), "category");
            categoryIds.add(category.id());
        }

        Set<String> productIds = new HashSet<>();
        for (ProductSnapshot product : safeProducts(snapshot)) {
            requireId(product.id(), "product");
            if (!brandIds.contains(product.brandId()) || !categoryIds.contains(product.categoryId())) {
                throw new IllegalArgumentException("Catalog backup contains broken product references");
            }
            for (ProductImageSnapshot image : safeImages(product)) {
                requireId(image.id(), "product image");
                if (image.imageUrl() == null || image.imageUrl().isBlank()) {
                    throw new IllegalArgumentException("Catalog backup contains an image without URL");
                }
            }
            productIds.add(product.id());
        }

        for (ProductVariantSnapshot variant : safeVariants(snapshot)) {
            requireId(variant.id(), "product variant");
            if (!productIds.contains(variant.productId())) {
                throw new IllegalArgumentException("Catalog backup contains broken variant references");
            }
        }
    }

    private void validateSupportedScope(RecoveryScope scope) {
        if (scope != RecoveryScope.FULL && scope != RecoveryScope.PRODUCT_CATALOG) {
            throw new IllegalArgumentException("Unsupported recovery scope");
        }
    }

    private void requireId(String id, String label) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Catalog backup contains " + label + " without ID");
        }
    }

    private String fallback(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private java.util.List<ProductImageSnapshot> safeImages(ProductSnapshot product) {
        return product.images() == null ? java.util.List.of() : product.images();
    }

    private java.util.List<BrandSnapshot> safeBrands(RecoveryCatalogSnapshot snapshot) {
        return snapshot.brands() == null ? java.util.List.of() : snapshot.brands();
    }

    private java.util.List<CategorySnapshot> safeCategories(RecoveryCatalogSnapshot snapshot) {
        return snapshot.categories() == null ? java.util.List.of() : snapshot.categories();
    }

    private java.util.List<ProductSnapshot> safeProducts(RecoveryCatalogSnapshot snapshot) {
        return snapshot.products() == null ? java.util.List.of() : snapshot.products();
    }

    private java.util.List<ProductVariantSnapshot> safeVariants(RecoveryCatalogSnapshot snapshot) {
        return snapshot.variants() == null ? java.util.List.of() : snapshot.variants();
    }
}
