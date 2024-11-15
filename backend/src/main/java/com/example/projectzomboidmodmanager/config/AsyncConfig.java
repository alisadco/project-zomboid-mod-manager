package com.example.projectzomboidmodmanager.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

@Configuration
@EnableAsync  // Enables asynchronous processing
public class AsyncConfig {
    // No methods are required in this class, just the annotations to enable async
}
