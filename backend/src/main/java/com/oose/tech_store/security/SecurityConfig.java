package com.oose.tech_store.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

@Configuration
public class SecurityConfig {

        @Bean
        SecurityFilterChain securityFilterChain(HttpSecurity http, SessionRegistry sessionRegistry,
                        SecurityContextRepository securityContextRepository,
                        JwtAuthFilter jwtAuthFilter) throws Exception {
                return http
                                .csrf(csrf -> csrf.disable())
                                .securityContext(context -> context
                                                .requireExplicitSave(true)
                                                .securityContextRepository(securityContextRepository))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/health", "/api/auth/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                                                // Payment gateway callbacks must remain public (external servers +
                                                // browser redirects)
                                                .requestMatchers(
                                                                "/api/payments/momo/return",
                                                                "/api/payments/momo/ipn",
                                                                "/api/payments/vnpay/return",
                                                                "/api/payments/vnpay/ipn")
                                                .permitAll()
                                                .requestMatchers("/api/bundle-services/**").permitAll()
                                                .requestMatchers("/api/admin/warehouse/logs/**").hasRole("MANAGER")
                                                .requestMatchers(
                                                                "/api/admin/warehouse",
                                                                "/api/admin/warehouse/import/**",
                                                                "/api/admin/warehouse/export/**",
                                                                "/api/warehouse/receipts/**")
                                                .hasAnyRole("STAFF", "MANAGER")
                                                .requestMatchers("/api/admin/supply-orders/**")
                                                .hasAnyRole("STAFF", "MANAGER")
                                                .requestMatchers("/api/admin/suppliers/**")
                                                .hasAnyRole("STAFF", "MANAGER")
                                                .requestMatchers("/api/admin/**").hasRole("MANAGER")
                                                .requestMatchers("/api/promotions/**").hasRole("MANAGER")
                                                .requestMatchers("/api/reports/**", "/api/payment-logs/**")
                                                .hasRole("MANAGER")
                                                .requestMatchers("/api/products/*/notifications/subscription")
                                                .hasRole("CUSTOMER")
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
                                .sessionManagement(session -> session
                                                .maximumSessions(1)
                                                .sessionRegistry(sessionRegistry))
                                .formLogin(form -> form.disable())
                                .httpBasic(basic -> basic.disable())
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                                .build();
        }

        @Bean
        PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        SessionRegistry sessionRegistry() {
                return new SessionRegistryImpl();
        }

        @Bean
        SecurityContextRepository securityContextRepository() {
                return new HttpSessionSecurityContextRepository();
        }
}
