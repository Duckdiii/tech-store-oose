package com.oose.tech_store.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidOrderItemsException extends RuntimeException {
    public InvalidOrderItemsException(String message) {
        super(message);
    }
}
