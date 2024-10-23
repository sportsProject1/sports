package com.sports.user;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Data
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String username;
    private String password;
    private String nickname;
    private int phone;
    private String email;
    private String role;    // ROLE_USER, ROLE_ADMIN
    private String address;
    private String imgURL;

    private String provider;
    private String providerId;
    @CreationTimestamp
    private Timestamp createDate;

    @Builder
    public User(String username, String nickname, String password, int phone, String email, String role, String address, String imgURL, String provider, Timestamp createDate, String providerId) {
        this.username = username;
        this.nickname = nickname;
        this.password = password;
        this.phone = phone;
        this.email = email;
        this.role = role;
        this.address = address;
        this.imgURL = imgURL;
        this.provider = provider;
        this.providerId = providerId;
        this.createDate = createDate;
    }
}