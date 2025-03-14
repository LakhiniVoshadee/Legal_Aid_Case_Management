package lk.ijse.legal_aid_and_case_management_system.dto;

import lk.ijse.legal_aid_and_case_management_system.util.Enum.UserRole;
import lombok.*;


public class UserDTO {
    private String email;
    private String password;
    private String name;
    private UserRole role; // Changed to UserRole enum
    private String specialization;
    private int experienceYears;
    private boolean available;

    public UserDTO() {
    }

    public UserDTO(String email, String password, String name, UserRole role, String specialization, int experienceYears, boolean available) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
        this.specialization = specialization;
        this.experienceYears = experienceYears;
        this.available = available;
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

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public int getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(int experienceYears) {
        this.experienceYears = experienceYears;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
}
