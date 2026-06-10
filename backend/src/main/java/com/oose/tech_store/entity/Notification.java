package com.oose.tech_store.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "notifications")
public class Notification {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(nullable = false, updatable = false, length = 36)
	private String id;

	@Column(nullable = false, length = 150)
	private String title;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private NotificationType type;

	@ElementCollection(targetClass = NotificationChannel.class)
	@CollectionTable(name = "notification_channels", joinColumns = @JoinColumn(name = "notification_id"))
	@Enumerated(EnumType.STRING)
	@Column(name = "channel", nullable = false, length = 20)
	private List<NotificationChannel> channels = new ArrayList<>();

	@Column(name = "favorite_id", nullable = false, length = 36)
	private String favoriteId;

	@Column(nullable = false, length = 1000)
	private String message;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private NotificationStatus status;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@Column(name = "sent_at")
	private LocalDateTime sentAt;

	@Column(name = "read_at")
	private LocalDateTime readAt;

	protected Notification() {
	}

	public Notification(String title, NotificationType type, String favoriteId, String message) {
		this.title = requireText(title, "Notification title is required");
		this.type = requireType(type);
		this.favoriteId = requireText(favoriteId, "Favorite id is required");
		this.message = requireText(message, "Notification message is required");
		this.status = NotificationStatus.PENDING;
	}

	@PrePersist
	public void prePersist() {
		if (status == null) {
			status = NotificationStatus.PENDING;
		}
		if (createdAt == null) {
			createdAt = LocalDateTime.now();
		}
	}

	public void addChannel(NotificationChannel channel) {
		if (channel == null) {
			throw new IllegalArgumentException("Notification channel is required");
		}
		if (!channels.contains(channel)) {
			channels.add(channel);
		}
	}

	public void removeChannel(NotificationChannel channel) {
		channels.remove(channel);
	}

	public void markSuccess(LocalDateTime sentAt) {
		this.status = NotificationStatus.SUCCESS;
		this.sentAt = sentAt == null ? LocalDateTime.now() : sentAt;
	}

	public void markFailure() {
		this.status = NotificationStatus.FAILURE;
	}

	public void markRead(LocalDateTime readAt) {
		this.readAt = readAt == null ? LocalDateTime.now() : readAt;
	}

	private static String requireText(String value, String message) {
		if (value == null || value.isBlank()) {
			throw new IllegalArgumentException(message);
		}
		return value;
	}

	private static NotificationType requireType(NotificationType type) {
		if (type == null) {
			throw new IllegalArgumentException("Notification type is required");
		}
		return type;
	}

	public String getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = requireText(title, "Notification title is required");
	}

	public NotificationType getType() {
		return type;
	}

	public void setType(NotificationType type) {
		this.type = requireType(type);
	}

	public List<NotificationChannel> getChannels() {
		return Collections.unmodifiableList(channels);
	}

	public String getFavoriteId() {
		return favoriteId;
	}

	public void setFavoriteId(String favoriteId) {
		this.favoriteId = requireText(favoriteId, "Favorite id is required");
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = requireText(message, "Notification message is required");
	}

	public NotificationStatus getStatus() {
		return status;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public LocalDateTime getSentAt() {
		return sentAt;
	}

	public LocalDateTime getReadAt() {
		return readAt;
	}
}
