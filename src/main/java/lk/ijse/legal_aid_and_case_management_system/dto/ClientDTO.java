package lk.ijse.legal_aid_and_case_management_system.dto;

import java.time.LocalDate;

public class ClientDTO { // Renamed from UserDTO for clarity
    private String full_name;
    private String phone_number;
    private LocalDate date_of_birth;
    private String address;
    private String preferred_language;
    private String gender;
    private String NIC;


    // Default constructor
    public ClientDTO() {}

    // Constructor with all fields
    public ClientDTO(String full_name, String phone_number, LocalDate date_of_birth, String address,
                     String preferred_language, String gender, String NIC, boolean isActive) {
        this.full_name = full_name;
        this.phone_number = phone_number;
        this.date_of_birth = date_of_birth;
        this.address = address;
        this.preferred_language = preferred_language;
        this.gender = gender;
        this.NIC = NIC;

    }

    // Getters and Setters
    public String getFull_name() { return full_name; }
    public void setFull_name(String full_name) { this.full_name = full_name; }
    public String getPhone_number() { return phone_number; }
    public void setPhone_number(String phone_number) { this.phone_number = phone_number; }
    public LocalDate getDate_of_birth() { return date_of_birth; }
    public void setDate_of_birth(LocalDate date_of_birth) { this.date_of_birth = date_of_birth; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPreferred_language() { return preferred_language; }
    public void setPreferred_language(String preferred_language) { this.preferred_language = preferred_language; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getNIC() { return NIC; }
    public void setNIC(String NIC) { this.NIC = NIC; }

}