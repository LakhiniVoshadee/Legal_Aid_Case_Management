package lk.ijse.legal_aid_and_case_management_system.dto;

import lk.ijse.legal_aid_and_case_management_system.util.Enum.UserRole;
import lombok.*;


public class UserDTO {
    private String email;
    private String password;
    private String name;
    private UserRole role; // Changed to UserRole enum

    public UserDTO() {
    }

    public UserDTO(String email, String password, String name, UserRole role) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
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
