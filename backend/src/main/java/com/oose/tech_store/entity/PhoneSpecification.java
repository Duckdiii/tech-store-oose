package com.oose.tech_store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "phone_specifications")
public class PhoneSpecification {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(nullable = false, updatable = false, length = 36)
	private String id;

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "product_id", nullable = false, unique = true)
	private Product product;

	@Column(name = "screen_size")
	private Double screenSize;

	@Column(name = "rear_camera", length = 150)
	private String rearCamera;

	@Column(name = "front_camera", length = 150)
	private String frontCamera;

	@Column(length = 150)
	private String chipset;

	@Column(name = "nfc_supported", nullable = false)
	private boolean nfcSupported;

	@Column(name = "battery_capacity")
	private Integer batteryCapacity;

	@Column(name = "sim_type", length = 100)
	private String simType;

	@Column(name = "operating_system", length = 100)
	private String operatingSystem;

	@Column(name = "screen_resolution", length = 100)
	private String screenResolution;

	protected PhoneSpecification() {
	}

	public PhoneSpecification(Double screenSize, String rearCamera, String frontCamera, String chipset,
			boolean nfcSupported, Integer batteryCapacity, String simType, String operatingSystem,
			String screenResolution) {
		this.screenSize = screenSize;
		this.rearCamera = rearCamera;
		this.frontCamera = frontCamera;
		this.chipset = chipset;
		this.nfcSupported = nfcSupported;
		this.batteryCapacity = batteryCapacity;
		this.simType = simType;
		this.operatingSystem = operatingSystem;
		this.screenResolution = screenResolution;
	}

	void attachTo(Product product) {
		if (product == null) {
			throw new IllegalArgumentException("Product is required");
		}
		this.product = product;
	}

	void detachFromProduct() {
		this.product = null;
	}

	public String getId() {
		return id;
	}

	public Product getProduct() {
		return product;
	}

	public Double getScreenSize() {
		return screenSize;
	}

	public void setScreenSize(Double screenSize) {
		this.screenSize = screenSize;
	}

	public String getRearCamera() {
		return rearCamera;
	}

	public void setRearCamera(String rearCamera) {
		this.rearCamera = rearCamera;
	}

	public String getFrontCamera() {
		return frontCamera;
	}

	public void setFrontCamera(String frontCamera) {
		this.frontCamera = frontCamera;
	}

	public String getChipset() {
		return chipset;
	}

	public void setChipset(String chipset) {
		this.chipset = chipset;
	}

	public boolean isNfcSupported() {
		return nfcSupported;
	}

	public void setNfcSupported(boolean nfcSupported) {
		this.nfcSupported = nfcSupported;
	}

	public Integer getBatteryCapacity() {
		return batteryCapacity;
	}

	public void setBatteryCapacity(Integer batteryCapacity) {
		this.batteryCapacity = batteryCapacity;
	}

	public String getSimType() {
		return simType;
	}

	public void setSimType(String simType) {
		this.simType = simType;
	}

	public String getOperatingSystem() {
		return operatingSystem;
	}

	public void setOperatingSystem(String operatingSystem) {
		this.operatingSystem = operatingSystem;
	}

	public String getScreenResolution() {
		return screenResolution;
	}

	public void setScreenResolution(String screenResolution) {
		this.screenResolution = screenResolution;
	}
}
