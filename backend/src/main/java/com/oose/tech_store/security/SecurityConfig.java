package com.oose.tech_store.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http
			.csrf(csrf -> csrf.disable())
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/api/health").permitAll()
				.requestMatchers("/api/invoices/**").permitAll()
				.requestMatchers("/api/payments/**").permitAll()
				.requestMatchers("/api/bundle-services/**").permitAll()
				.requestMatchers("/api/cart/**").permitAll()
				.anyRequest().authenticated())
			.httpBasic(Customizer.withDefaults())
			.build();
	}
}
