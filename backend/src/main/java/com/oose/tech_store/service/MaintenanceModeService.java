package com.oose.tech_store.service;

import java.util.concurrent.atomic.AtomicBoolean;
import org.springframework.stereotype.Service;

@Service
public class MaintenanceModeService {

    private final AtomicBoolean enabled = new AtomicBoolean(false);

    public void enable() {
        enabled.set(true);
    }

    public void disable() {
        enabled.set(false);
    }

    public boolean isEnabled() {
        return enabled.get();
    }
}
