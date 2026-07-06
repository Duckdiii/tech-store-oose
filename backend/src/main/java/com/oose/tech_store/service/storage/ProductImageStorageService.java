package com.oose.tech_store.service.storage;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface ProductImageStorageService {

    List<StoredImage> store(List<MultipartFile> files);

    record StoredImage(String name, String url) {
    }
}
