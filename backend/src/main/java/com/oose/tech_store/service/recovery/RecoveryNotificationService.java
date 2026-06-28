package com.oose.tech_store.service.recovery;

import org.springframework.stereotype.Service;

@Service
public class RecoveryNotificationService {

    public String restoreSuccessMessage() {
        return "Restore operation completed successfully";
    }
}
