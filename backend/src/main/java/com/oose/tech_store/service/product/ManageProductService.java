package com.oose.tech_store.service.product;

import com.oose.tech_store.dto.manage.ManageProductRequestDTO;
import com.oose.tech_store.dto.manage.ManageProductResponseDTO;
import com.oose.tech_store.dto.manage.ManageProductSearchRequestDTO;
import com.oose.tech_store.dto.manage.ManageProductSpecOptionsDTO;
import com.oose.tech_store.dto.manage.ManageProductStatusCountsDTO;
import java.util.List;
import org.springframework.data.domain.Page;

public interface ManageProductService {

    List<ManageProductResponseDTO> getAllProducts();

    Page<ManageProductResponseDTO> searchProducts(ManageProductSearchRequestDTO request);

    ManageProductStatusCountsDTO getStatusCounts(String keyword);

    ManageProductSpecOptionsDTO getSpecOptions();

    ManageProductResponseDTO getProductById(String id);

    ManageProductResponseDTO createProduct(ManageProductRequestDTO request);

    ManageProductResponseDTO updateProduct(String id, ManageProductRequestDTO request);

    void deleteProduct(String id);
}
