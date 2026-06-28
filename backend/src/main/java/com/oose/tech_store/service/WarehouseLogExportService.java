package com.oose.tech_store.service;

import com.oose.tech_store.dto.warehouse.WarehouseLogRequestDTO;
import com.oose.tech_store.dto.warehouse.WarehouseLogFileFormat;
import com.oose.tech_store.dto.warehouse.WarehouseLogResponseDTO;
import com.oose.tech_store.dto.warehouse.WarehouseLogSummaryDTO;
import java.nio.charset.StandardCharsets;
import java.io.ByteArrayOutputStream;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WarehouseLogExportService {

    private final WarehouseLogService warehouseLogService;

    public byte[] export(WarehouseLogRequestDTO request, WarehouseLogFileFormat format) {
        return format == WarehouseLogFileFormat.EXCEL ? exportExcel(request) : exportCsv(request);
    }

    private byte[] exportCsv(WarehouseLogRequestDTO request) {
        WarehouseLogResponseDTO response = warehouseLogService.getWarehouseLogs(request);
        StringBuilder csv = new StringBuilder();
        csv.append("logId,logType,occurredAt,performedBy,status,totalQuantity,productNames\n");

        for (WarehouseLogSummaryDTO log : response.logs()) {
            csv.append(escape(log.logId())).append(',')
                    .append(escape(log.logType().name())).append(',')
                    .append(escape(String.valueOf(log.occurredAt()))).append(',')
                    .append(escape(log.performedBy())).append(',')
                    .append(escape(log.status().name())).append(',')
                    .append(log.totalQuantity()).append(',')
                    .append(escape(log.productNames())).append('\n');
        }
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private byte[] exportExcel(WarehouseLogRequestDTO request) {
        WarehouseLogResponseDTO response = warehouseLogService.getWarehouseLogs(request);
        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            XSSFSheet sheet = workbook.createSheet("Warehouse Logs");
            String[] headers = { "Log ID", "Type", "Occurred At", "Performed By", "Status", "Quantity", "Product Names" };
            Row header = sheet.createRow(0);
            for (int index = 0; index < headers.length; index++) {
                header.createCell(index).setCellValue(headers[index]);
            }

            int rowIndex = 1;
            for (WarehouseLogSummaryDTO log : response.logs()) {
                Row row = sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(log.logId());
                row.createCell(1).setCellValue(log.logType().name());
                row.createCell(2).setCellValue(String.valueOf(log.occurredAt()));
                row.createCell(3).setCellValue(log.performedBy());
                row.createCell(4).setCellValue(log.status().name());
                row.createCell(5).setCellValue(log.totalQuantity());
                row.createCell(6).setCellValue(log.productNames());
            }
            for (int index = 0; index < headers.length; index++) {
                sheet.autoSizeColumn(index);
            }
            workbook.write(output);
            return output.toByteArray();
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to generate warehouse log Excel file", exception);
        }
    }

    private String escape(String value) {
        if (value == null) {
            return "";
        }
        return '"' + value.replace("\"", "\"\"") + '"';
    }
}
