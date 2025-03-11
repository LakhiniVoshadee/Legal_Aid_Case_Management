package lk.ijse.legal_aid_and_case_management_system.entity;

import jakarta.persistence.*;
import lk.ijse.legal_aid_and_case_management_system.util.Enum.UserRole;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "user")

public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID uid;
    @Column(unique = true)
    private String email;
    private String password;
    private String name;
    @Enumerated(EnumType.STRING)
    private UserRole role;

    public User() {
    }

    public User(UUID uid, String email, String password, String name, UserRole role) {
        this.uid = uid;
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
    }

    public UUID getUid() {
        return uid;
    }

    public void setUid(UUID uid) {
        this.uid = uid;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}