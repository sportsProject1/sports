package com.sports.Security.config;

import com.sports.Security.jwt.JwtAuthenticationFilter;
import com.sports.Security.auth.oauth2.PrincipalOauth2UserService;
import com.sports.Security.auth.PrincipalUserDetailsService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true) // secured 어노테이션 활성화 -> 컨트롤러 어딘가 @Secured("ROLE_ADMIN")해주면 admin만 들어갈수있게 되는것// prePostEnabled 어노테이션 활성화 -> Secured와 같지만, 권한을 여러개 걸어주거나 복잡한 권한을 부여할때
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final PrincipalUserDetailsService principalUserDetailsService;
    private final PrincipalOauth2UserService principalOauth2UserService;

    @Autowired
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, PrincipalUserDetailsService principalUserDetailsService, PrincipalOauth2UserService principalOauth2UserService) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.principalUserDetailsService = principalUserDetailsService;
        this.principalOauth2UserService = principalOauth2UserService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http	.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .httpBasic(httpBasic -> httpBasic.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // 세션이 필요할 때만 생성
                )
                .authorizeHttpRequests((authorize) -> authorize
                        .requestMatchers("/admin").hasRole("ADMIN")
                        .requestMatchers("/manager").hasRole("MANAGER")
                        .requestMatchers("/seller").hasRole("SELLER")
                        .requestMatchers("/board/fileAdd", "/board/{id}/like").authenticated() // 첫 번째 매칭되는 조건이 적용, 아래에서 permitAll 해줘도 인증이 적용됨
                        .requestMatchers((request) ->
                                request.getRequestURI().endsWith("/add") && "POST".equals(request.getMethod())
                        ).authenticated() // 모든 POST /add 요청에 인증 필요
                        .requestMatchers("/", "/register", "/login","/oauth", "/oauth2/**", "/refresh", "/user", "/shop", "/shop/**", "/board/**", "/category/get", "/comment/get/**", "/map/**", "/kakao/**").permitAll()
                        .anyRequest().authenticated())
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                }))
                .formLogin(formLogin -> formLogin.disable())
                .logout(logout -> logout.disable())         // 시큐리티의 기본 로그인,로그아웃 비활성화
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class) // 주입받은 JWT 필터 사용
                .oauth2Login(oauth2Login -> oauth2Login
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(principalOauth2UserService)
                        )
                        .defaultSuccessUrl("http://localhost:8090/login/oauth2/code/google", true) // 성공 후 리디렉트 URL 설정
//                      .defaultSuccessUrl("http://localhost:3000/oauth2/redirect", true)
                );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public RoleHierarchy roleHierarchy() {
        RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();
        roleHierarchy.setHierarchy("ROLE_ADMIN > ROLE_MANAGER > ROLE_SELLER > ROLE_USER");
        return roleHierarchy;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.addAllowedOrigin("http://localhost:3000"); // React 앱의 주소
        configuration.addAllowedOrigin("https://localhost:3000");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        configuration.setExposedHeaders(List.of("Authorization", "Refresh-Token"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}