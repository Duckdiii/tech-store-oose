package com.oose.tech_store.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http, AccountUserDetailsService accountUserDetailsService) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/health").permitAll()
                        .requestMatchers(
                                "/api/warehouse/logs/**",
                                "/api/admin/warehouse/logs/**")
                        .hasRole("MANAGER")
                        .requestMatchers(
                                "/api/admin/warehouse",
                                "/api/admin/warehouse/import/**",
                                "/api/admin/warehouse/export/**",
                                "/api/warehouse/inventory/**",
                                "/api/warehouse/imports/**",
                                "/api/warehouse/exports/**",
                                "/api/warehouse/receipts/**")
                        .hasAnyRole("STAFF", "MANAGER")
                        .requestMatchers("/api/invoices/**").permitAll()
                        .requestMatchers("/api/payments/**").permitAll()
                        .requestMatchers("/api/bundle-services/**").permitAll()
                        .requestMatchers("/api/cart/**").permitAll()
                        .requestMatchers("/api/orders/**").permitAll()
                        .anyRequest().authenticated())
                .userDetailsService(accountUserDetailsService)
                .httpBasic(Customizer.withDefaults())
                .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
