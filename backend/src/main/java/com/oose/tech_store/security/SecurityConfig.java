package com.oose.tech_store.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

        @Bean
        SecurityFilterChain securityFilterChain(
                        HttpSecurity http,
                        AccountUserDetailsService accountUserDetailsService,
                        JwtAuthFilter jwtAuthFilter) throws Exception {
                return http
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/health", "/api/auth/**").permitAll()
                                                .requestMatchers("/api/admin/warehouse/logs/**")
                                                .hasRole("MANAGER")
                                                .requestMatchers(
                                                                "/api/admin/warehouse",
                                                                "/api/admin/warehouse/import/**",
                                                                "/api/admin/warehouse/export/**",
                                                                "/api/warehouse/receipts/**")
                                                .hasAnyRole("STAFF", "MANAGER")
                                                // Payment gateway callbacks must remain public (external servers +
                                                // browser redirects)
                                                .requestMatchers(
                                                                "/api/payments/momo/return",
                                                                "/api/payments/momo/ipn",
                                                                "/api/payments/vnpay/return",
                                                                "/api/payments/vnpay/ipn")
                                                .permitAll()
                                                .requestMatchers("/api/bundle-services/**").permitAll()
                                                .requestMatchers("/api/promotions/**").hasRole("MANAGER")
                                                .requestMatchers("/api/payments/**").hasRole("CUSTOMER")
                                                .requestMatchers("/api/cart/**").hasRole("CUSTOMER")
                                                .requestMatchers("/api/orders/**").hasRole("CUSTOMER")
                                                .requestMatchers("/api/invoices/**").hasRole("CUSTOMER")
                                                .requestMatchers("/api/membership/**").hasRole("CUSTOMER")
                                                .requestMatchers(
                                                                "/api/users/me/notification-subscriptions",
                                                                "/api/users/me/notifications",
                                                                "/api/users/me/notifications/**")
                                                .hasRole("CUSTOMER")
                                                .anyRequest().authenticated())
                                .userDetailsService(accountUserDetailsService)
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                                .build();
        }

        @Bean
        AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }

        @Bean
        PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }
}
