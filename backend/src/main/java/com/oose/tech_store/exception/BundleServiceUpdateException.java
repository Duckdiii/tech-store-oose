package com.oose.tech_store.exception;

public class BundleServiceUpdateException extends RuntimeException {

    public BundleServiceUpdateException(String message) {
        super(message);
    }

    public BundleServiceUpdateException(String message, Throwable cause) {
        super(message, cause);
    }
}
