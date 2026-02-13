package com.parkease.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "custom_id", unique = true)
    private String customId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name")
    private String name;

    @Column(nullable = false)
    private String role; // "admin" or "user"

    @Column(name = "wallet_balance")
    private Double walletBalance = 0.0;

    @Column(name = "loyalty_points")
    private Integer loyaltyPoints = 0;
}
