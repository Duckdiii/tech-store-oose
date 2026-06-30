package com.oose.tech_store.repository;

import com.oose.tech_store.entity.ExportLog;
import com.oose.tech_store.entity.enums.ImportAndExportStatus;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ExportLogRepository extends JpaRepository<ExportLog, String> {

    @Query("""
            select distinct log
            from ExportLog log
            left join fetch log.items item
            left join fetch item.productVariant variant
            left join fetch variant.product product
            where log.exportedAt >= :from
              and log.exportedAt <= :to
            order by log.exportedAt desc
            """)
    List<ExportLog> searchWarehouseLogs(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to);

    @Query("""
            select distinct log
            from ExportLog log
            left join fetch log.items item
            left join fetch item.productVariant variant
            left join fetch variant.product product
            where log.exportedAt >= :from
              and log.exportedAt <= :to
              and log.status = :status
            order by log.exportedAt desc
            """)
    List<ExportLog> searchWarehouseLogsByStatus(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("status") ImportAndExportStatus status);

    @Query("""
            select distinct log
            from ExportLog log
            left join fetch log.items item
            left join fetch item.productVariant variant
            left join fetch variant.product product
            where log.exportedAt >= :from
              and log.exportedAt <= :to
              and (
                    lower(log.performedBy) like lower(concat('%', :performedBy, '%'))
                    or log.performedBy in :actorIds
                  )
            order by log.exportedAt desc
            """)
    List<ExportLog> searchWarehouseLogsByActor(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("performedBy") String performedBy,
            @Param("actorIds") Collection<String> actorIds);

    @Query("""
            select distinct log
            from ExportLog log
            left join fetch log.items item
            left join fetch item.productVariant variant
            left join fetch variant.product product
            where log.exportedAt >= :from
              and log.exportedAt <= :to
              and log.status = :status
              and (
                    lower(log.performedBy) like lower(concat('%', :performedBy, '%'))
                    or log.performedBy in :actorIds
                  )
            order by log.exportedAt desc
            """)
    List<ExportLog> searchWarehouseLogsByActorAndStatus(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("status") ImportAndExportStatus status,
            @Param("performedBy") String performedBy,
            @Param("actorIds") Collection<String> actorIds);
}
