package com.oose.tech_store.service.warehouse;

import com.oose.tech_store.dto.warehouse.WarehouseLogDetailResponseDTO;
import com.oose.tech_store.dto.warehouse.WarehouseLogRequestDTO;
import com.oose.tech_store.dto.warehouse.WarehouseLogResponseDTO;
import com.oose.tech_store.dto.warehouse.WarehouseLogType;

public interface WarehouseLogService {

    WarehouseLogResponseDTO getWarehouseLogs(WarehouseLogRequestDTO request);

    WarehouseLogDetailResponseDTO getWarehouseLogDetail(WarehouseLogType logType, String logId);
}
