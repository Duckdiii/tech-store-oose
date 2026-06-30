package com.oose.tech_store.repository;

import com.oose.tech_store.entity.ImportLog;
import com.oose.tech_store.entity.enums.ImportAndExportStatus;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ImportLogRepository extends JpaRepository<ImportLog, String> {

    @Query("""
            select distinct log
            from ImportLog log
            left join fetch log.items item
            left join fetch item.productVariant variant
            left join fetch variant.product product
            where log.importedAt >= :from
              and log.importedAt <= :to
            order by log.importedAt desc
            """)
    List<ImportLog> searchWarehouseLogs(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to);

    @Query("""
            select distinct log
            from ImportLog log
            left join fetch log.items item
            left join fetch item.productVariant variant
            left join fetch variant.product product
            where log.importedAt >= :from
              and log.importedAt <= :to
              and log.status = :status
            order by log.importedAt desc
            """)
    List<ImportLog> searchWarehouseLogsByStatus(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("status") ImportAndExportStatus status);

    @Query("""
            select distinct log
            from ImportLog log
            left join fetch log.items item
            left join fetch item.productVariant variant
            left join fetch variant.product product
            where log.importedAt >= :from
              and log.importedAt <= :to
              and (
                    lower(log.performedBy) like lower(concat('%', :performedBy, '%'))
                    or log.performedBy in :actorIds
                  )
            order by log.importedAt desc
            """)
    List<ImportLog> searchWarehouseLogsByActor(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("performedBy") String performedBy,
            @Param("actorIds") Collection<String> actorIds);

    @Query("""
            select distinct log
            from ImportLog log
            left join fetch log.items item
            left join fetch item.productVariant variant
            left join fetch variant.product product
            where log.importedAt >= :from
              and log.importedAt <= :to
              and log.status = :status
              and (
                    lower(log.performedBy) like lower(concat('%', :performedBy, '%'))
                    or log.performedBy in :actorIds
                  )
            order by log.importedAt desc
            """)
    List<ImportLog> searchWarehouseLogsByActorAndStatus(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("status") ImportAndExportStatus status,
            @Param("performedBy") String performedBy,
            @Param("actorIds") Collection<String> actorIds);
}
