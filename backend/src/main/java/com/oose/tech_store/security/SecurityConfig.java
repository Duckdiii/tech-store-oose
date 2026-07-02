package com.oose.tech_store.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
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
                                                .requestMatchers("/api/health", "/api/auth/**", "/api/promotions/flash-sale").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                                                // Payment gateway callbacks must remain public (external servers +
                                                // browser redirects)
                                                .requestMatchers(
                                                                "/api/payments/momo/return",
                                                                "/api/payments/momo/ipn",
                                                                "/api/payments/vnpay/return",
                                                                "/api/payments/vnpay/ipn")
                                                .permitAll()
                                                .requestMatchers("/api/bundle-services", "/api/bundle-services/**").permitAll()
                                                .requestMatchers("/api/manage/warehouse/logs/**")
                                                                .hasAnyRole("STAFF", "MANAGER")
                                                .requestMatchers(
                                                                "/api/manage/warehouse",
                                                                "/api/manage/warehouse/import/**",
                                                                "/api/manage/warehouse/export/**",
                                                                "/api/warehouse/receipts/**")
                                                .hasAnyRole("STAFF", "MANAGER")
                                                .requestMatchers("/api/manage/supply-orders/**")
                                                .hasAnyRole("STAFF", "MANAGER")
                                                .requestMatchers("/api/manage/suppliers/**")
                                                .hasAnyRole("STAFF", "MANAGER")
                                                .requestMatchers("/api/manage/orders", "/api/manage/orders/**")
                                                                .hasAnyRole("STAFF", "MANAGER")
                                                .requestMatchers("/api/manage/notifications", "/api/manage/notifications/**")
                                                                .hasAnyRole("STAFF", "MANAGER")
                                                .requestMatchers("/api/manage/**").hasRole("MANAGER")
                                                .requestMatchers("/api/promotions/**").hasRole("MANAGER")
                                                .requestMatchers("/api/reports/**", "/api/payment-logs/**")
                                                .hasRole("MANAGER")
                                                .requestMatchers("/api/variants/*/notifications/subscription") // cho
                                                                                                               // phép
                                                                                                               // khách
                                                                                                               // hàng
                                                                                                               // gọi
                                                                                                               // API
                                                                                                               // đăng
                                                                                                               // ký
                                                                                                               // theo
                                                                                                               // biến
                                                                                                               // thể
                                                .hasRole("CUSTOMER")
                                                .requestMatchers("/api/payments/**").hasRole("CUSTOMER")
                                                .requestMatchers("/api/cart/**").hasRole("CUSTOMER")
                                                .requestMatchers("/api/orders/**").hasRole("CUSTOMER")
                                                .requestMatchers("/api/invoices/**").hasRole("CUSTOMER")
                                                .requestMatchers("/api/membership/**").hasRole("CUSTOMER")
                                                .requestMatchers(
                                                                "/api/users/me",
                                                                "/api/users/me/**")
                                                .hasRole("CUSTOMER")
                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .maximumSessions(1)
                                                .sessionRegistry(sessionRegistry))
                                .exceptionHandling(exceptions -> exceptions
                                                .authenticationEntryPoint(authenticationEntryPoint()))
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

        /**
         * Without formLogin/httpBasic, Spring Security falls back to Http403ForbiddenEntryPoint,
         * so missing/expired tokens return 403 instead of 401 and the frontend's session-expiry
         * handling (which only reacts to 401) never kicks in. Return 401 for unauthenticated
         * requests instead; role-mismatch on an authenticated user still yields 403 via the
         * default AccessDeniedHandler.
         */
        @Bean
        AuthenticationEntryPoint authenticationEntryPoint() {
                return (request, response, authException) -> response.sendError(HttpStatus.UNAUTHORIZED.value());
        }
}
