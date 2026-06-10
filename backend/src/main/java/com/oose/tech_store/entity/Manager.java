package com.oose.tech_store.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "managers")
public class Manager extends User {

	public Manager() {
	}
}
