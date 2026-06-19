package com.oose.tech_store.service;

import com.oose.tech_store.dto.warehouse.WarehouseLogRequestDTO;
import com.oose.tech_store.dto.warehouse.WarehouseLogResponseDTO;
import com.oose.tech_store.dto.warehouse.WarehouseLogSummaryDTO;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WarehouseLogExportService {

    private final WarehouseLogService warehouseLogService;

    public byte[] exportCsv(WarehouseLogRequestDTO request) {
        WarehouseLogResponseDTO response = warehouseLogService.getWarehouseLogs(request);
        StringBuilder csv = new StringBuilder();
        csv.append("logId,logType,occurredAt,performedBy,status,totalQuantity,description\n");

        for (WarehouseLogSummaryDTO log : response.logs()) {
            csv.append(escape(log.logId())).append(',')
                    .append(escape(log.logType().name())).append(',')
                    .append(escape(String.valueOf(log.occurredAt()))).append(',')
                    .append(escape(log.performedBy())).append(',')
                    .append(escape(log.status().name())).append(',')
                    .append(log.totalQuantity()).append(',')
                    .append(escape(log.description())).append('\n');
        }
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String escape(String value) {
        if (value == null) {
            return "";
        }
        return '"' + value.replace("\"", "\"\"") + '"';
    }
}