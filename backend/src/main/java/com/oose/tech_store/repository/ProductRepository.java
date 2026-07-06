package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Product;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface ProductRepository extends JpaRepository<Product, String>, JpaSpecificationExecutor<Product> {

    @EntityGraph(attributePaths = {"brand", "category", "images"})
    List<Product> findAll();

    @EntityGraph(attributePaths = {"brand", "category", "images"})
    Page<Product> findAll(Specification<Product> spec, Pageable pageable);

    Optional<Product> findFirstByNameIgnoreCaseAndBrandIdAndCategoryId(
            String name, String brandId, String categoryId);

    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    boolean existsByNameIgnoreCase(String name);

    Optional<Product> findByNameIgnoreCase(String name);

    @Query("SELECT DISTINCT p.screenSize FROM Product p WHERE p.screenSize IS NOT NULL ORDER BY p.screenSize")
    List<Double> findDistinctScreenSizes();

    @Query("SELECT DISTINCT p.screenResolution FROM Product p WHERE p.screenResolution IS NOT NULL ORDER BY p.screenResolution")
    List<String> findDistinctScreenResolutions();

    @Query("SELECT DISTINCT p.rearCamera FROM Product p WHERE p.rearCamera IS NOT NULL ORDER BY p.rearCamera")
    List<String> findDistinctRearCameras();

    @Query("SELECT DISTINCT p.frontCamera FROM Product p WHERE p.frontCamera IS NOT NULL ORDER BY p.frontCamera")
    List<String> findDistinctFrontCameras();

    @Query("SELECT DISTINCT p.chipset FROM Product p WHERE p.chipset IS NOT NULL ORDER BY p.chipset")
    List<String> findDistinctChipsets();

    @Query("SELECT DISTINCT p.batteryCapacity FROM Product p WHERE p.batteryCapacity IS NOT NULL ORDER BY p.batteryCapacity")
    List<Integer> findDistinctBatteryCapacities();

    @Query("SELECT DISTINCT p.simType FROM Product p WHERE p.simType IS NOT NULL ORDER BY p.simType")
    List<String> findDistinctSimTypes();

    @Query("SELECT DISTINCT p.operatingSystem FROM Product p WHERE p.operatingSystem IS NOT NULL ORDER BY p.operatingSystem")
    List<String> findDistinctOperatingSystems();
}
