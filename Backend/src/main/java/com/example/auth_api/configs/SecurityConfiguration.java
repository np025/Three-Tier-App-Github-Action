package com.example.auth_api.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${cors.url}")
    private String corsUrl;

    public SecurityConfiguration(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            AuthenticationProvider authenticationProvider
    ) {
        this.authenticationProvider = authenticationProvider;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf()
                .disable()
                .cors()  // Enable CORS
                .and()
                .authorizeHttpRequests()
                .requestMatchers("/auth/**", "/actuator/**") 
                .permitAll()
                .anyRequest()
                .authenticated()
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        // CORS configuration for all paths except /actuator
        CorsConfiguration apiCorsConfiguration = new CorsConfiguration();
        apiCorsConfiguration.setAllowedOrigins(List.of(corsUrl)); // Adjust based on your frontend origin
        apiCorsConfiguration.setAllowedMethods(List.of("GET", "POST", "OPTIONS", "DELETE", "PUT"));
        apiCorsConfiguration.setAllowedHeaders(List.of("Content-Type", "Authorization", "Accept"));
        apiCorsConfiguration.setAllowCredentials(true);
        apiCorsConfiguration.setMaxAge(3600L);

        // CORS configuration for /actuator endpoint (allow any origin)
        CorsConfiguration actuatorCorsConfiguration = new CorsConfiguration();
        actuatorCorsConfiguration.setAllowedOrigins(List.of("*")); // Allow all origins for actuator endpoints
        actuatorCorsConfiguration.setAllowedMethods(List.of("GET")); // Allow only GET requests for /actuator
        actuatorCorsConfiguration.setAllowedHeaders(List.of("Content-Type", "Authorization", "Accept"));
        actuatorCorsConfiguration.setAllowCredentials(false);
        actuatorCorsConfiguration.setMaxAge(3600L);

        // Register both configurations
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/actuator/**", actuatorCorsConfiguration);
        source.registerCorsConfiguration("/**", apiCorsConfiguration);  // Default CORS configuration for other endpoints

        return source;
    }
}