package com.oose.tech_store.controller;

import com.oose.tech_store.dto.CategoryResponseDTO;
import com.oose.tech_store.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    public List<CategoryResponseDTO> getCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryResponseDTO(c.getId(), c.getName(), c.getImageUrl()))
                .toList();
    }
}
