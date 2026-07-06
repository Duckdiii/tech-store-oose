package com.oose.tech_store.dto.manage;

import java.util.List;

public record ManageProductSpecOptionsDTO(
        List<Double> screenSizes,
        List<String> screenResolutions,
        List<String> rearCameras,
        List<String> frontCameras,
        List<String> chipsets,
        List<Integer> batteryCapacities,
        List<String> simTypes,
        List<String> operatingSystems) {
}
