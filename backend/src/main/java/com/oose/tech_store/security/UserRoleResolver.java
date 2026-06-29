package com.oose.tech_store.security;

import com.oose.tech_store.entity.Customer;
import com.oose.tech_store.entity.Manager;
import com.oose.tech_store.entity.Staff;
import com.oose.tech_store.entity.User;

public final class UserRoleResolver {

    private UserRoleResolver() {
    }

    public static String resolve(User user) {
        if (user instanceof Manager) {
            return "MANAGER";
        }
        if (user instanceof Staff) {
            return "STAFF";
        }
        if (user instanceof Customer) {
            return "CUSTOMER";
        }
        throw new IllegalArgumentException("Unsupported user type: " + user.getClass().getName());
    }
}
