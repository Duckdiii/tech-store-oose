package com.oose.tech_store.service.recovery;

import java.util.concurrent.atomic.AtomicBoolean;
import org.springframework.stereotype.Service;

@Service
public class MaintenanceService {

    private final AtomicBoolean maintenanceMode = new AtomicBoolean(false);

    public void enable() {
        maintenanceMode.set(true);
    }

    public void disable() {
        maintenanceMode.set(false);
    }

    public boolean isEnabled() {
        return maintenanceMode.get();
    }
}
