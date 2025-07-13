package com.blooddonation.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.blooddonation.backend.security.jwt.JwtAuthenticationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
    
    @Bean
   public CorsConfigurationSource corsConfigurationSource() { 
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
    configuration.setAllowedOriginPatterns(Arrays.asList("*"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setExposedHeaders(Arrays.asList("Authorization"));
    configuration.setAllowCredentials(true);
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}

    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> {
                log.debug("Configuring authorization rules");
                authz
                .requestMatchers("/", "/auth/**", "/h2-console/**", "/swagger-ui/**", "/api-docs/**", "/css/**", "/js/**", "/images/**", "/contact").permitAll()
                .requestMatchers("/admin-staff/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers("/donation-registers/**").hasAnyRole("ADMIN", "STAFF", "DONOR", "MEDICAL_FACILITY")
                .requestMatchers("/donation-process/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers("/donor/eligible").hasAnyRole("ADMIN", "STAFF", "DONOR")
                .requestMatchers("/donor/**").hasRole("DONOR")
                .requestMatchers("/medical/**").hasRole("MEDICAL_FACILITY")
                .requestMatchers("/medical-facility/**").hasRole("MEDICAL_FACILITY")
                .requestMatchers("/api/medical-facility/**").hasRole("MEDICAL_FACILITY")
                .requestMatchers("/blood-groups").hasAnyRole("DONOR", "MEDICAL_FACILITY", "ADMIN")
                .requestMatchers("/donor/profile/**").hasRole("DONOR")
                .requestMatchers("/donor/register-donation/**").hasRole("DONOR")
                .requestMatchers("/donor/donation-history/**").hasRole("DONOR")
                .requestMatchers("/donor/survey/**").hasRole("DONOR")
                .requestMatchers("/accounts/**").hasRole("ADMIN")
                .requestMatchers("/api/blood-stock/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers("/api/admin/donors/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers("/api/admin/medical-facilities/**").hasAnyRole("ADMIN", "STAFF", "MEDICAL_FACILITY")
                .requestMatchers("/admin/matching-blood/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers("/admin/certificates/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers("/api/common/distance").permitAll()
                .anyRequest().authenticated(); // Các request còn lại phải xác thực
            })
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // Thêm filter để log thông tin Authentication
        http.addFilterAfter((request, response, chain) -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null) {
                log.debug("[DEBUG] Principal: {} | Authorities: {} | Authenticated: {}", authentication.getPrincipal(), authentication.getAuthorities(), authentication.isAuthenticated());
            } else {
                log.debug("[DEBUG] No authentication in context");
            }
            chain.doFilter(request, response);
        }, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
} 