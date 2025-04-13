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
    @Column(updatable = false, nullable = false)
    private UUID uid;
    @Column(nullable = false,unique = true)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String name;
   // @Enumerated(EnumType.STRING)
   @Column(nullable = false)
    private String role;
    @Column
    private String profilePictureUrl;

    @Column
    private String profilePicturePublicId;


    public User() {
    }

    public User(UUID uid, String email, String password, String name, String role, String profilePictureUrl, String profilePicturePublicId) {
        this.uid = uid;
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
        this.profilePictureUrl = profilePictureUrl;
        this.profilePicturePublicId = profilePicturePublicId;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

    public String getProfilePicturePublicId() {
        return profilePicturePublicId;
    }

    public void setProfilePicturePublicId(String profilePicturePublicId) {
        this.profilePicturePublicId = profilePicturePublicId;
    }
}