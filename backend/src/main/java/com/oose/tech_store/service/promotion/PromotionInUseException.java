package com.oose.tech_store.service.promotion;

public class PromotionInUseException extends RuntimeException {

    public PromotionInUseException() {
        super("Cannot remove a promotion that has been used in orders. You may deactivate it instead");
    }
}
