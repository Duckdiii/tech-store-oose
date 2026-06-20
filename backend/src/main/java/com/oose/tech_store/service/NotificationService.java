package com.oose.tech_store.service;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void sendTierUpgradeNotification(Long userId, String newTierName) {
        // This is a placeholder implementation
        // In a real application, this would send email or push notification
        System.out.println("Sending tier upgrade notification to user " + userId + 
                           ": You are now " + newTierName + " Tier!");
    }
}
