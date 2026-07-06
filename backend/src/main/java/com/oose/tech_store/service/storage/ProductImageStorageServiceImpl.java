package com.oose.tech_store.service.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProductImageStorageServiceImpl implements ProductImageStorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif");

    @Value("${app.upload.product-images-dir}")
    private String uploadDir;

    @Value("${app.upload.product-images-public-path}")
    private String publicPath;

    @Override
    public List<StoredImage> store(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No files were provided");
        }

        Path dir = Path.of(uploadDir).toAbsolutePath();
        try {
            Files.createDirectories(dir);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to prepare upload directory", ex);
        }

        List<StoredImage> result = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }
            String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ROOT);
            if (!ALLOWED_CONTENT_TYPES.contains(contentType)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Only image files (JPEG, PNG, WEBP, GIF) are allowed");
            }

            String filename = UUID.randomUUID() + extensionFor(contentType);
            Path target = dir.resolve(filename);
            try {
                file.transferTo(target);
            } catch (IOException ex) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to save uploaded image", ex);
            }

            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : filename;
            result.add(new StoredImage(originalName, publicPath + "/" + filename));
        }
        return result;
    }

    private String extensionFor(String contentType) {
        return switch (contentType) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> ".jpg";
        };
    }
}
