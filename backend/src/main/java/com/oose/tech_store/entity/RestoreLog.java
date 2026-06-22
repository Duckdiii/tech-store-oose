package com.oose.tech_store.entity;

import com.oose.tech_store.entity.enums.RestoreOperationStatus;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "restore_logs")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RestoreLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "backup_id")
    private Backup backup;

    @Column(name = "restore_mode", nullable = false, length = 20)
    private String restoreMode;

    @ElementCollection
    @CollectionTable(name = "restore_log_scopes", joinColumns = @JoinColumn(name = "restore_log_id"))
    @Column(name = "scope", nullable = false, length = 100)
    private List<String> selectedScopes = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private RestoreOperationStatus status = RestoreOperationStatus.IN_PROGRESS;

    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public RestoreLog(Backup backup, String restoreMode, List<String> selectedScopes) {
        this.backup = backup;
        this.restoreMode = restoreMode;
        if (selectedScopes != null) {
            this.selectedScopes.addAll(selectedScopes);
        }
        this.startedAt = LocalDateTime.now();
    }

    public void complete() {
        status = RestoreOperationStatus.COMPLETED;
        completedAt = LocalDateTime.now();
    }

    public void fail(RestoreOperationStatus status, String reason) {
        this.status = status;
        failureReason = reason;
        completedAt = LocalDateTime.now();
    }
}
