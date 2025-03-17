package lk.ijse.legal_aid_and_case_management_system.dto;

import lk.ijse.legal_aid_and_case_management_system.util.Enum.UserRole;
import lombok.*;


public class UserDTO {
    private String email;
    private String password;
    private String name;
    private String role; // Changed to UserRole enum

    private String admin_name;
    private String full_name;
    private String lawyer_name;
    private String address;

    public UserDTO() {
    }

    public UserDTO(String email, String password, String name, String role, String admin_name, String full_name, String lawyer_name, String address) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
        this.admin_name = admin_name;
        this.full_name = full_name;
        this.lawyer_name = lawyer_name;
        this.address = address;
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

    public String getAdmin_name() {
        return admin_name;
    }

    public void setAdmin_name(String admin_name) {
        this.admin_name = admin_name;
    }

    public String getFull_name() {
        return full_name;
    }

    public void setFull_name(String full_name) {
        this.full_name = full_name;
    }

    public String getLawyer_name() {
        return lawyer_name;
    }

    public void setLawyer_name(String lawyer_name) {
        this.lawyer_name = lawyer_name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
