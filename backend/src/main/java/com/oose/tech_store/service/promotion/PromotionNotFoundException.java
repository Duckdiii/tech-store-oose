package com.oose.tech_store.service.promotion;

public class PromotionNotFoundException extends RuntimeException {

    public PromotionNotFoundException() {
        super("Promotion not found");
    }
}
