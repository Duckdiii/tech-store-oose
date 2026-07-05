package com.oose.tech_store;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TechStoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(TechStoreApplication.class, args);
	}
}
