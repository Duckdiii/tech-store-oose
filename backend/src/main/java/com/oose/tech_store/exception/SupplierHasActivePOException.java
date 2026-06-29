package com.oose.tech_store.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class SupplierHasActivePOException extends RuntimeException {
    public SupplierHasActivePOException(String message) {
        super(message);
    }
}
