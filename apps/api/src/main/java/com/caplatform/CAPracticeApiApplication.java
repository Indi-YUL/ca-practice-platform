package com.caplatform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * Main Spring Boot application entry point
 */
@SpringBootApplication
@ComponentScan(basePackages = "com.caplatform")
public class CAPracticeApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(CAPracticeApiApplication.class, args);
    }
}
