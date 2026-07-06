package com.oose.tech_store.service.warehouse;

import java.security.Principal;

public interface WarehouseActorService {

    String getCurrentUserId(Principal principal);
}
