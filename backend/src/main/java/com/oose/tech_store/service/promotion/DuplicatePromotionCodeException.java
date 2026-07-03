package com.oose.tech_store.service.promotion;

public class DuplicatePromotionCodeException extends RuntimeException {

    public DuplicatePromotionCodeException() {
        super("Promotion code already exists. Please use a different code");
    }
}
