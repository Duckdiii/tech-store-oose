package com.oose.tech_store.repository;

import com.oose.tech_store.entity.Notification;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, String> {

    List<Notification> findByCustomer_IdOrderByCreatedAtDesc(String customerId);

    List<Notification> findByCustomer_IdAndReadAtIsNullOrderByCreatedAtDesc(String customerId);

    Optional<Notification> findByIdAndCustomer_Id(String id, String customerId);

    List<Notification> findByRecipientRoleOrderByCreatedAtDesc(String recipientRole);

    List<Notification> findByRecipientRoleAndReadAtIsNullOrderByCreatedAtDesc(String recipientRole);

    Optional<Notification> findByIdAndRecipientRole(String id, String recipientRole);
}
