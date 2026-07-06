package com.oose.tech_store.service.warehouse;

import com.oose.tech_store.dto.warehouse.WarehouseLogFileFormat;
import com.oose.tech_store.dto.warehouse.WarehouseLogRequestDTO;

public interface WarehouseLogExportService {

    byte[] export(WarehouseLogRequestDTO request, WarehouseLogFileFormat format);
}
