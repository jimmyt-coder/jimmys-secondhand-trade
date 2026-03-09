package com.secondhand.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000",
                    "http://jimmy-secondhand-trade.s3-website-eu-west-1.amazonaws.com",
                    "https://d21nx2uemsx38f.cloudfront.net",
                    "https://d137tpw7dxzsa2.cloudfront.net")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    // Serve local upload directory when S3 is disabled (local development)
    @Configuration
    @ConditionalOnProperty(name = "app.s3.enabled", havingValue = "false", matchIfMissing = true)
    static class LocalResourceConfig implements WebMvcConfigurer {

        @Value("${app.upload.path:./uploads}")
        private String uploadPath;

        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry) {
            registry.addResourceHandler("/uploads/**")
                    .addResourceLocations("file:" + uploadPath + "/");
        }
    }
}
