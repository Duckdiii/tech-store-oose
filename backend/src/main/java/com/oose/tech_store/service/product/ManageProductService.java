package com.oose.tech_store.service.product;

import com.oose.tech_store.dto.manage.ManageProductRequestDTO;
import com.oose.tech_store.dto.manage.ManageProductResponseDTO;
import java.util.List;

public interface ManageProductService {

    List<ManageProductResponseDTO> getAllProducts();

    ManageProductResponseDTO getProductById(String id);

    ManageProductResponseDTO createProduct(ManageProductRequestDTO request);

    ManageProductResponseDTO updateProduct(String id, ManageProductRequestDTO request);

    void deleteProduct(String id);
}
