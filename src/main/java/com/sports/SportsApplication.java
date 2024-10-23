package com.sports;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SportsApplication {


    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();
        String dbUser = dotenv.get("SPRING_DATASOURCE_USERNAME");
        String dbPassword = dotenv.get("SPRING_DATASOURCE_PASSWORD");

        SpringApplication.run(SportsApplication.class, args);
    }

}
