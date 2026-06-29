package com.oose.tech_store.service.promotion;

public class PromotionInUseException extends RuntimeException {

    public PromotionInUseException() {
        super("Cannot remove: promotion already used");
    }
}
