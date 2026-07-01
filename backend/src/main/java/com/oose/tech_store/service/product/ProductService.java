package com.oose.tech_store.service.product;

import com.oose.tech_store.dto.ProductDetailResponseDTO;
import com.oose.tech_store.dto.ProductSearchRequestDTO;
import com.oose.tech_store.dto.ProductSearchResponseDTO;
import com.oose.tech_store.entity.Product;
import org.springframework.data.domain.Page;

public interface ProductService {

    Page<ProductSearchResponseDTO> searchProducts(ProductSearchRequestDTO request);

    ProductDetailResponseDTO getProductDetail(String id);

    Page<Product> searchAndFilterProducts(ProductSearchRequestDTO request);

    Product getProductById(String id);
}
